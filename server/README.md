# 🧠 RNC Products Online – Clasificación de Productos con TensorFlow y Django

Este proyecto es una API REST creada con Django que sirve un modelo de reconocimiento de productos entrenado con TensorFlow. El modelo identifica productos en imágenes y devuelve predicciones con porcentajes.

---

## 🛠 Requisitos

- Python 3.10.11
- pip 23.0.0
- TensorFlow >= 2.10
- Django >= 4
- matplotlib
- pillow

1- Iniciar entorno virtual e instalar las dependencias con:
```bash
python -m venv venv
.\venv\Scripts\activate
pip install tensorflow==2.10.0  #Si tienes GPU
pip install "numpy<2" #Si tienes GPU
python.exe -m pip install --upgrade pip #Si no tienes GPU
pip install tensorflow #Si no tienes GPU

pip install django djangorestframework django-cors-headers matplotlib pillow
```
2- Iniciar entrenamiento del modelo CNN de productos en linea:
```bash
python entrenar_modelo.py
```
3- Inicializar y ejecutar el proyecto en el servidor:
```bash
python manage.py migrate
python manage.py runserver
```
