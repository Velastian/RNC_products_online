# 🧠 RNC Products Online – Clasificación de Productos con TensorFlow y Django

Este proyecto es una API REST creada con Django que sirve un modelo de reconocimiento de productos entrenado con TensorFlow. El modelo identifica productos en imágenes y devuelve predicciones con porcentajes.

---

## 🛠 Requisitos

- Python 3.10.11
- pip 25.1.1
- TensorFlow >= 2.12
- Django >= 4
- tensorflow-datasets
- pillow

1- Iniciar entorno virtual e instalar las dependencias con:
```bash
python -m venv venv
.\venv\Scripts\activate
python.exe -m pip install --upgrade pip 
pip install django djangorestframework tensorflow tensorflow-datasets pillow
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
