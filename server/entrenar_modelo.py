# Importamos TensorFlow y sus componentes para construir modelos con Keras
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
import tensorflow_datasets as tfds  # Importamos el gestor de datasets predefinidos
import os  # Para manipular rutas del sistema
import json  # Para guardar las clases en un archivo JSON

# --- Configuración Mejorada ---
IMG_SIZE = (128, 128)  # Tamaño al que se redimensionarán las imágenes
BATCH_SIZE = 32        # Tamaño del batch para entrenamiento
EPOCHS = 10            # Número de épocas de entrenamiento

# Definimos la ruta absoluta para guardar el dataset y evitar descargas repetidas
HOME_DIR = os.path.expanduser("~")  # Ruta del directorio del usuario (por ejemplo, /home/usuario)
DATA_DIR = os.path.join(HOME_DIR, "tensorflow_datasets", "stanford_online_products")
os.makedirs(DATA_DIR, exist_ok=True)  # Creamos el directorio si no existe

print(f"🔄 Descargando y cargando el dataset (si es necesario) desde: {DATA_DIR}")

# Cargamos el dataset Stanford Online Products con TensorFlow Datasets
# split=['train', 'test']: Carga los conjuntos de entrenamiento y prueba
# as_supervised=None: Nos devuelve un diccionario con claves en lugar de tuplas
# with_info=True: Nos devuelve información adicional como el número de clases
# data_dir=DATA_DIR: Usamos una ruta explícita para almacenamiento local
(train_ds, test_ds), ds_info = tfds.load(
    'stanford_online_products',
    split=['train', 'test'],
    as_supervised=None,
    with_info=True,
    data_dir=DATA_DIR
)

# Extraemos el número total de clases del dataset
NUM_CLASSES = ds_info.features['super_class_id'].num_classes
print(f"✅ Dataset cargado. Total clases: {NUM_CLASSES}")

# Función para preprocesar los datos (imagen + etiqueta)
def preprocess(features):
    image = features['image']  # Extraemos la imagen
    label = features['super_class_id']  # Extraemos la etiqueta (categoría)
    image = tf.image.resize(image, IMG_SIZE)  # Redimensionamos la imagen
    image = tf.cast(image, tf.float32) / 255.0  # Normalizamos la imagen a [0,1]
    return image, tf.one_hot(label, NUM_CLASSES)  # One-hot encoding de la etiqueta

# Aplicamos el preprocesamiento y optimizaciones a los datasets
train_ds = (
    train_ds
    .map(preprocess)              # Aplicamos la función preprocess
    .shuffle(1000)                # Mezclamos los datos para evitar patrones en el entrenamiento
    .batch(BATCH_SIZE)            # Agrupamos en batches
    .prefetch(tf.data.AUTOTUNE)  # Precargamos batches para mejor rendimiento
)

test_ds = (
    test_ds
    .map(preprocess)              # Preprocesamos los datos de prueba
    .batch(BATCH_SIZE)            # No hace falta mezclar, solo agrupar
    .prefetch(tf.data.AUTOTUNE)  # Precarga para eficiencia
)

# Definimos la arquitectura del modelo CNN
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(*IMG_SIZE, 3)),  # Capa convolucional inicial
    MaxPooling2D(),                                                    # Pooling para reducción espacial
    Conv2D(64, (3, 3), activation='relu'),                             # Segunda capa convolucional
    MaxPooling2D(),                                                    # Segundo pooling
    Flatten(),                                                         # Aplanamos para pasar a capa densa
    Dense(256, activation='relu'),                                     # Capa totalmente conectada
    Dropout(0.5),                                                      # Dropout para evitar sobreajuste
    Dense(NUM_CLASSES, activation='softmax')                           # Capa de salida con softmax
])

# Compilamos el modelo con optimizador, función de pérdida y métrica
model.compile(
    optimizer='adam',                        # Optimizador Adam
    loss='categorical_crossentropy',         # Pérdida para clasificación multiclase
    metrics=['accuracy']                     # Métrica a evaluar: precisión
)

print("🚀 Entrenando modelo...")

# Entrenamos el modelo con los datos de entrenamiento y validamos con los datos de prueba
model.fit(train_ds, epochs=EPOCHS, validation_data=test_ds)

# Creamos la carpeta de salida si no existe
os.makedirs("modelo", exist_ok=True)

# Guardamos el modelo entrenado en formato HDF5 (.h5)
model.save("modelo/modelo_productos.h5")

# Guardamos los nombres de las clases en formato JSON para poder usarlos luego (por ejemplo, en inferencias)
with open("modelo/class_names.json", "w") as f:
    class_names = ds_info.features['super_class_id'].names
    json.dump(class_names, f)

print("✅ Modelo y clases guardados en carpeta /modelo/")
