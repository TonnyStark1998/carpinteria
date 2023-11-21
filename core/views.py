from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
import os
from django.conf import settings
import base64


def obtener_contenido_del_archivo_pdf(_path):
    # Supongamos que tienes la ruta del archivo PDF en tu sistema de archivos
    # ruta_archivo_pdf = '/ruta/a/tu/archivo.pdf'
    ruta_archivo_pdf = _path

    try:
        with open(ruta_archivo_pdf, 'rb') as archivo_pdf:
            # Leer el contenido del archivo PDF
            contenido_pdf = archivo_pdf.read()

            # Codificar el contenido en base64
            contenido_base64 = base64.b64encode(contenido_pdf).decode('utf-8')

            print("archivo encontrado")
            return contenido_base64
    except FileNotFoundError:
        print("no se encontro el archivo")
        # Manejar el caso en el que el archivo no se encuentra
        return None


def obtener_tipo_archivo(ruta_archivo):
    _, extension = os.path.splitext(ruta_archivo.lower())  # Obtener la extensión en minúsculas

    tipos = {
        '.pdf': 'PDF',
        '.skp': 'SKP',
    }

    tipo = tipos.get(extension, '-1')

    return tipo


def get_file_data(request):
    print(request)
    print(request.GET['path'])
    return JsonResponse({"data": obtener_contenido_del_archivo_pdf(request.GET['path'])})


def get_files(request):
    directorio = settings.PATH_TO_DIR
    json_response = {"ruta": directorio}
    file_list = []
    try:
        archivos = os.listdir(directorio)

        for archivo in archivos:
            ruta_completa = os.path.join(directorio, archivo)
            if os.path.isfile(ruta_completa):
                print(f'Archivo: {archivo}')
                file_list.append({
                    "file": archivo,
                    "type": "file",
                    "ext": obtener_tipo_archivo(ruta_completa),
                    "path_to_file": directorio + "/" + archivo,
                    # "data_file": obtener_contenido_del_archivo_pdf(),
                })

            elif os.path.isdir(ruta_completa):
                print(f'Directorio: {archivo}')
                file_list.append({
                    "file": archivo,
                    "type": "dict",
                    "ext": obtener_tipo_archivo(ruta_completa),
                    "data_file": None,
                })

    # def obtener_contenido_pdf(request):
    #     contenido_pdf = obtener_contenido_del_archivo_pdf()
    #
    #     if contenido_pdf is not None:
    #         return JsonResponse({'contenido_pdf': contenido_pdf})
    #     else:
    #         return JsonResponse({'error': 'El archivo PDF no se encontró'}, status=404)
    except FileNotFoundError:
        print(f'El directorio {directorio} no fue encontrado.')
    except Exception as e:
        print(f'Ocurrió un error al intentar listar archivos: {e}')
    json_response["file_list"] = file_list
    print(json_response)
    return JsonResponse(json_response)


def home(request):
    return render(request, 'core/home.html')


@login_required
def calculadora(request):
    return render(request, 'core/calculadora.html')


@login_required
def paint(request):
    return render(request, 'core/paint.html')


@login_required
def proyectos(request):
    return render(request, 'core/proyecto_proyecto.html')


@login_required
def start_view(request):
    return render(request, 'core/start_view.html')


def exit_session(request):
    logout(request)
    return redirect('home')
