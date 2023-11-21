from django.urls import path
from .views import home, start_view, exit_session, calculadora, paint, proyectos, get_files, get_file_data

urlpatterns = [
    path('', home, name='home'),
    path('/paint', paint, name='paint'),
    path('proyectos', proyectos, name='proyectos'),
    path('/calculadora', calculadora, name='calculadora'),
    path('start_view/', start_view, name='start_view'),
    path('logout/', exit_session, name='exit_session'),
    path('get_files/', get_files, name='get_files'),
    path('get_file_data/', get_file_data, name='get_files'),
]
