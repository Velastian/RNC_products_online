from django.http import JsonResponse
from rest_framework.decorators import api_view
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import json
import os
import io # Import the io module

# Definir la ruta del modelo (.h5) y del archivo de nombres de clases (.json)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, '..', 'modelo', 'modelo_productos.h5')
CLASSES_PATH = os.path.join(BASE_DIR, '..', 'modelo', 'class_names.json')

# Cargar el modelo y las clases una sola vez al inicio de la aplicación para evitar recargas innecesarias
try:
    # Cargar el modelo entrenado desde el archivo .h5
    model = load_model(MODEL_PATH)
    
    # Cargar los nombres de las clases desde un archivo JSON
    with open(CLASSES_PATH, "r") as f:
        class_names = json.load(f)

except Exception as e:
    # Si ocurre un error al cargar el modelo o las clases, imprimir el error
    print(f"Error loading model or class names: {e}")
    
    # También puede considerarse guardar el error en un log para su análisis
    model = None         # Establecer el modelo como None para evitar errores posteriores
    class_names = []     # Lista vacía para evitar referencias nulas

# Definir la vista de API que reconoce productos a partir de una imagen
@api_view(['POST'])  # Solo se permite el método POST
def reconocer_producto(request):
    # Verificar si el modelo está disponible antes de proceder
    if model is None:
        return JsonResponse({'error': 'El modelo de predicción no está disponible. Contacte al administrador.'}, status=500)

    # Verificar que el archivo de imagen haya sido incluido en la solicitud
    if 'imagen' not in request.FILES:
        return JsonResponse({'error': 'No se encontró la imagen en la solicitud.'}, status=400)

    # Obtener el archivo de imagen desde la solicitud
    img_file = request.FILES['imagen']

    try:
        # Convertir el archivo subido en un flujo de bytes (BytesIO) para poder ser leído por Keras
        img_bytes = io.BytesIO(img_file.read())

        # Cargar la imagen en memoria, redimensionada al tamaño esperado por el modelo
        img = image.load_img(img_bytes, target_size=(224, 224))

        # Convertir la imagen a un arreglo NumPy y normalizar los valores entre 0 y 1
        img_array = image.img_to_array(img) / 255.0

        # Expandir dimensiones para simular un batch de tamaño 1 (requisito del modelo)
        img_array = np.expand_dims(img_array, axis=0)

        # Realizar la predicción con el modelo previamente cargado
        predictions = model.predict(img_array)[0]  # Obtenemos solo el primer (y único) resultado

        # Crear un diccionario con el nombre de cada clase y su probabilidad correspondiente (en porcentaje)
        result = {class_names[i]: float(f"{p * 100:.2f}") for i, p in enumerate(predictions)}

        # Ordenar las predicciones por probabilidad descendente y quedarse con las 5 mejores
        sorted_result = dict(sorted(result.items(), key=lambda x: x[1], reverse=True)[:5])

        # Devolver las predicciones al cliente en formato JSON
        return JsonResponse({'predicciones': sorted_result})

    except Exception as e:
        # Capturar errores durante el procesamiento de la imagen o la predicción
        return JsonResponse({'error': f'Ocurrió un error al procesar la imagen: {str(e)}'}, status=500)
