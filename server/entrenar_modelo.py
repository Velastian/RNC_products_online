# Importación de librerías necesarias
import os
import json
import tensorflow as tf
import matplotlib
matplotlib.use('TkAgg')  # Configura el backend de matplotlib para entornos con GUI (Tkinter)
import matplotlib.pyplot as plt
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    Conv2D, MaxPooling2D, Flatten, Dense, Dropout, 
    BatchNormalization, RandomFlip, RandomRotation, RandomZoom
)

# Definimos la ruta base del usuario para almacenar el dataset
HOME_DIR = os.path.expanduser("~")  # Ruta del directorio del usuario (ej: /home/usuario o C:\Users\usuario)

# Parámetros del entrenamiento
IMG_SIZE = (128, 128)        # Tamaño de imagen a utilizar
BATCH_SIZE = 32              # Tamaño del lote
EPOCHS = 1                   # Número de épocas de entrenamiento (cambiar para entrenamiento real)
DATASET_DIR = os.path.join(HOME_DIR, "datasets", "Stanford_Online_Products")  # Ruta del dataset

# Definimos una secuencia de aumentos de datos para mejorar la generalización
data_augmentation = tf.keras.Sequential([
    RandomFlip("horizontal"),      # Volteo horizontal aleatorio
    RandomRotation(0.1),           # Rotación aleatoria
    RandomZoom(0.1),               # Zoom aleatorio
])

# Función para leer rutas de imágenes y etiquetas desde un archivo de texto
def leer_rutas_y_etiquetas(txt_path):
    rutas, etiquetas = [], []
    with open(txt_path, 'r') as f:
        next(f)  # Saltamos la línea de cabecera
        for linea in f:
            partes = linea.strip().split()
            path_rel = partes[3].replace("/", os.sep)        # Ruta relativa del archivo de imagen
            super_class_id = int(partes[2]) - 1              # Clase (ajustada para comenzar desde 0)
            rutas.append(os.path.join(DATASET_DIR, path_rel))  # Ruta completa del archivo
            etiquetas.append(super_class_id)                   # Etiqueta de clase
    return rutas, etiquetas

# Cargamos rutas y etiquetas para entrenamiento y prueba
train_paths, train_labels = leer_rutas_y_etiquetas(os.path.join(DATASET_DIR, "Ebay_train.txt"))
test_paths, test_labels = leer_rutas_y_etiquetas(os.path.join(DATASET_DIR, "Ebay_test.txt"))

# Número total de clases distintas
NUM_CLASSES = len(set(train_labels))
print(f"✅ Dataset leído. Total clases: {NUM_CLASSES}")

# Función para cargar, procesar y aplicar aumentos a una imagen
def cargar_y_preprocesar(path, label):
    image = tf.io.read_file(path)                         # Leemos el archivo
    image = tf.image.decode_jpeg(image, channels=3)       # Decodificamos la imagen JPEG
    image = tf.image.resize(image, IMG_SIZE)              # Redimensionamos
    image = tf.cast(image, tf.float32) / 255.0            # Normalizamos a [0, 1]
    image = data_augmentation(image)                      # Aplicamos aumentos
    return image, tf.one_hot(label, NUM_CLASSES)          # Etiqueta codificada en one-hot

# Creamos dataset de entrenamiento: cargamos, mapeamos, barajamos y preprocesamos
train_ds = tf.data.Dataset.from_tensor_slices((train_paths, train_labels))
train_ds = train_ds.map(cargar_y_preprocesar, num_parallel_calls=tf.data.AUTOTUNE)
train_ds = train_ds.shuffle(1000).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

# Creamos dataset de prueba: solo mapeamos y agrupamos en batches
test_ds = tf.data.Dataset.from_tensor_slices((test_paths, test_labels))
test_ds = test_ds.map(cargar_y_preprocesar, num_parallel_calls=tf.data.AUTOTUNE)
test_ds = test_ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

# Definimos el modelo CNN secuencial
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(*IMG_SIZE, 3)),  # Capa convolucional con 32 filtros
    BatchNormalization(),                                               # Normalización para estabilizar el aprendizaje
    MaxPooling2D(),                                                     # Reducción espacial
    Conv2D(64, (3, 3), activation='relu'),                              # Segunda capa convolucional
    BatchNormalization(),
    MaxPooling2D(),
    Flatten(),                                                          # Aplanamos para conectar con capas densas
    Dense(256, activation='relu'),                                      # Capa densa intermedia
    Dropout(0.6),                                                       # Dropout para evitar sobreajuste
    Dense(NUM_CLASSES, activation='softmax')                            # Capa de salida con softmax para clasificación
])

# Compilamos el modelo con optimizador Adam y pérdida categórica
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-4),
    loss='categorical_crossentropy',
    metrics=['accuracy'],
)

# Entrenamos el modelo con los datasets definidos
print("🚀 Entrenando modelo...")
history = model.fit(train_ds, epochs=EPOCHS, validation_data=test_ds)

# Graficamos métricas de entrenamiento y validación
plt.figure(figsize=(12, 4))

# Gráfica de pérdida
plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Pérdida en entrenamiento')
plt.plot(history.history['val_loss'], label='Pérdida en validación')
plt.title('Pérdida')
plt.xlabel('Época')
plt.ylabel('Valor de pérdida')
plt.legend()

# Gráfica de precisión
plt.subplot(1, 2, 2)
plt.plot(history.history['accuracy'], label='Precisión en entrenamiento')
plt.plot(history.history['val_accuracy'], label='Precisión en validación')
plt.title('Precisión')
plt.xlabel('Época')
plt.ylabel('Valor de precisión')
plt.legend()

plt.show()

# Guardamos el modelo entrenado en formato .h5
os.makedirs("modelo", exist_ok=True)
model.save("modelo/modelo_productos.h5")

# Lista opcional de nombres de clase manual (no proviene directamente del dataset)
class_names = [
    "bicycle", "cabinet", "chair", "coffee_maker", "fan", "kettle",
    "lamp", "mug", "sofa", "stapler", "table", "toaster"
]
# Guardamos nombres de clase en formato JSON para futuras predicciones o visualizaciones
with open("modelo/class_names.json", "w") as f:
    json.dump(class_names, f)

print("✅ Modelo y clases guardados en carpeta /modelo/")
