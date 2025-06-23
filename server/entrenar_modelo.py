# Importación de librerías necesarias
import os
import json
import tensorflow as tf
import matplotlib
matplotlib.use('TkAgg')  # Configura el backend de matplotlib para entornos con GUI (Tkinter)
import matplotlib.pyplot as plt
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    Conv2D, MaxPooling2D, Flatten, Dense, Dropout
)
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Definimos la ruta base del usuario para almacenar el dataset
HOME_DIR = os.path.expanduser("~")  # Ruta del directorio del usuario (ej: /home/usuario o C:\Users\usuario)
DATASET_DIR = os.path.join(HOME_DIR, "datasets", "Stanford_Online_Products")  # Ruta completa del dataset

# Paso 1: Cargar los datos desde los archivos .txt que describen las imágenes
def load_data(file_path):
    data = []
    with open(file_path, 'r') as f:
        f.readline()  # Ignorar la primera línea (encabezado)
        for line in f:
            parts = line.strip().split()  # Separar los campos por espacios
            image_id, class_id, super_class_id, path = parts
            # Guardar los datos como diccionario
            data.append({
                'image_id': int(image_id),
                'class_id': int(class_id),
                'super_class_id': int(super_class_id),
                'path': path
            })
    return data

# Construir rutas absolutas a los archivos de entrenamiento y prueba
train_file_path = os.path.join(DATASET_DIR, "Ebay_train.txt")
test_file_path = os.path.join(DATASET_DIR, "Ebay_test.txt")

# Cargar los datos desde los archivos
train_data = load_data(train_file_path)
test_data = load_data(test_file_path)

# Extraer rutas de imagen y etiquetas (superclases, ajustadas para que comiencen en 0)
X_train = [entry['path'] for entry in train_data]
y_train = [entry['super_class_id'] - 1 for entry in train_data]

X_test = [entry['path'] for entry in test_data]
y_test = [entry['super_class_id'] - 1 for entry in test_data]

# Paso 2: Definir generadores de datos para preprocesamiento y aumento

# Generador de datos para entrenamiento con aumentos y validación dividida
train_datagen = ImageDataGenerator(
    rescale=1./255,           # Escalar píxeles entre 0 y 1
    shear_range=0.2,          # Aplicar transformación de corte (shear)
    zoom_range=0.2,           # Aplicar zoom aleatorio
    horizontal_flip=True,     # Volteo horizontal aleatorio
    validation_split=0.2      # Reservar 20% de datos para validación
)

# Generador de datos para prueba (solo normalización)
test_datagen = ImageDataGenerator(rescale=1./255)

# Definir tamaño de lote e imágenes
batch_size = 32
target_size = (224, 224)  # Tamaño estándar de entrada de imagen

# Generador para entrenamiento
train_generator = train_datagen.flow_from_directory(
    directory=DATASET_DIR,
    classes=[f"{i}_final" for i in [
        "bicycle", "cabinet", "chair", "coffee_maker", "fan", "kettle",
        "lamp", "mug", "sofa", "stapler", "table", "toaster"
    ]],  # Lista de subdirectorios con nombres específicos de clases
    target_size=target_size,
    batch_size=batch_size,
    class_mode='sparse',  # Etiquetas como enteros
    subset='training'     # Solo parte de entrenamiento
)

# Generador para validación
validation_generator = train_datagen.flow_from_directory(
    directory=DATASET_DIR,
    classes=[f"{i}_final" for i in [
        "bicycle", "cabinet", "chair", "coffee_maker", "fan", "kettle",
        "lamp", "mug", "sofa", "stapler", "table", "toaster"
    ]],
    target_size=target_size,
    batch_size=batch_size,
    class_mode='sparse',
    subset='validation'
)

# Generador para pruebas (sin subset porque no hay separación en prueba)
test_generator = test_datagen.flow_from_directory(
    directory=DATASET_DIR,
    classes=[f"{i}_final" for i in [
        "bicycle", "cabinet", "chair", "coffee_maker", "fan", "kettle",
        "lamp", "mug", "sofa", "stapler", "table", "toaster"
    ]],
    target_size=target_size,
    batch_size=batch_size,
    class_mode='sparse'
)

# Paso 3: Construcción del modelo CNN (Convolutional Neural Network)
input_shape = (*target_size, 3)  # Agrega canal de color RGB
num_classes = 12  # Cantidad de clases (una por supercategoría)

# Definición del modelo secuencial
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),  # Capa convolucional 1
    MaxPooling2D((2, 2)),  # Reducción de dimensiones
    Conv2D(64, (3, 3), activation='relu'),  # Capa convolucional 2
    MaxPooling2D((2, 2)),
    Conv2D(128, (3, 3), activation='relu'),  # Capa convolucional 3
    MaxPooling2D((2, 2)),
    Conv2D(128, (3, 3), activation='relu'),  # Capa convolucional 4
    MaxPooling2D((2, 2)),
    Flatten(),  # Aplanamiento para entrada a capa densa
    Dense(256, activation='relu'),  # Capa densa totalmente conectada
    Dropout(0.5),  # Regularización para evitar overfitting
    Dense(num_classes, activation='softmax')  # Capa de salida con softmax
])

# Compilación del modelo con optimizador, función de pérdida y métrica
model.compile('adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Paso 4: Entrenamiento del modelo
epochs = 1  # Número de épocas (puede ajustarse según recursos)

history = model.fit(
    train_generator,
    steps_per_epoch=len(X_train) // batch_size,  # Cantidad de pasos por época
    epochs=epochs,
    validation_data=validation_generator,
    validation_steps=len(X_train) * 0.2 // batch_size  # Aproximación a pasos de validación
)

# Paso 5: Evaluación del modelo en conjunto de prueba
test_loss, test_accuracy = model.evaluate(test_generator, steps=len(X_test) // batch_size)
print(f"Pérdida en el conjunto de prueba: {test_loss}")
print(f"Precisión en el conjunto de prueba: {test_accuracy}")

# Guardar el modelo entrenado en formato HDF5 (.h5)
os.makedirs("modelo", exist_ok=True)
model.save("modelo/modelo_productos.h5")

# Lista de nombres de clase en orden (coincidente con `flow_from_directory`)
class_names = [
    "bicycle", "cabinet", "chair", "coffee_maker", "fan", "kettle",
    "lamp", "mug", "sofa", "stapler", "table", "toaster"
]

# Guardar los nombres de clases como archivo JSON
with open("modelo/class_names.json", "w") as f:
    json.dump(class_names, f)

print("✅ Modelo y clases guardados en carpeta /modelo/")

# Visualización de métricas de entrenamiento y validación
plt.figure(figsize=(12, 4))

# Gráfico de pérdida
plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Pérdida en entrenamiento')
plt.plot(history.history['val_loss'], label='Pérdida en validación')
plt.title('Pérdida')
plt.xlabel('Época')
plt.ylabel('Valor de pérdida')
plt.legend()

# Gráfico de precisión
plt.subplot(1, 2, 2)
plt.plot(history.history['accuracy'], label='Precisión en entrenamiento')
plt.plot(history.history['val_accuracy'], label='Precisión en validación')
plt.title('Precisión')
plt.xlabel('Época')
plt.ylabel('Valor de precisión')
plt.legend()

plt.show()
