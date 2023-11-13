from django.urls import path
from .views import home, start_view, exit_session, calculadora, paint

urlpatterns = [
    path('', home, name='home'),
    path('/paint', paint, name='paint'),
    path('/calculadora', calculadora, name='calculadora'),
    path('start_view/', start_view, name='start_view'),
    path('logout/', exit_session, name='exit_session'),
]
