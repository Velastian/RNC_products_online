from django.urls import path
from .views import reconocer_producto

urlpatterns = [
    path('prediccion/', reconocer_producto, name='reconocer_producto'),
]
