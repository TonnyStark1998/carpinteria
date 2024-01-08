from colourswatch.io import openSwatch_SKP
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
import os
from django.conf import settings
import base64
import subprocess
import shlex


# def skp_to_gltf(input_path, output_gltf_path):
#     # Cargar el modelo SKP
#     model = sketchup.read_skp(input_path)
#
#     # Convertir el modelo a glTF
#     gltf_data = sketchup.export_gltf(model)
#
#     # Guardar el archivo glTF binario
#     with open(output_gltf_path, 'wb') as gltf_file:
#         gltf_file.write(gltf_data)
#
# def get_gltf_model(request):
#     # Ruta del archivo SKP de entrada
#     input_skp_path = 'path/to/your/model.skp'
#
#     # Ruta de salida para el archivo glTF binario
#     output_gltf_path = 'path/to/your/output/model.gltf'
#
#     # Convertir SKP a glTF
#     skp_to_gltf(input_skp_path, output_gltf_path)
#
#     # Convertir el archivo glTF binario a base64 para incluirlo en la respuesta JSON
#     with open(output_gltf_path, 'rb') as gltf_file:
#         base64_model = gltf_file.read().encode('base64').decode('utf-8')
#
#     # Devolver la respuesta JSON
#     return JsonResponse({'model': base64_model})

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


def get_file_data_skp_bin(request):
    from django.http import HttpResponse
    print(request.GET)
    print(request.GET['path_bin'])
    path_bin = request.GET['path_bin']

    response = HttpResponse(content_type='application/octet-stream')

    response.write(contenido_bin)
    return response

def get_file_data_skp(request):
    print("SMMMMMMMMMMMMMMMMMMM")
    print(request)
    print("SMMMMMMMMMMMMMMMMMMM12")
    print(request.GET['path'])
    print("SMMMMMMMMMMMMMMMMMMM33")

    # Ruta al ejecutable de Blender
    # blender_executable = 'blender'
    blender_executable = 'blender'

    # Ruta al script de Blender
    blender_script = settings.PATH_TO_SCRIPT_BLENDER

    # Rutas de los archivos skp y destino
    ubicacion_skp = request.GET['path']
    destino = settings.PATH_TO_TEMP

    # Comando para ejecutar el script de Blender con los argumentos
    command = f'{blender_executable} --background --python {blender_script} -- {shlex.quote(ubicacion_skp)} {shlex.quote(destino)}'

    # Ejecutar el comando
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()

    # Imprimir la salida y el error
    print("Salida:", output.decode('utf-8'))
    print("Error:", error.decode('utf-8'))

    # Verificar el código de salida
    if process.returncode == 0:
        print("El script se ejecutó exitosamente.")
    else:
        print("Hubo un error al ejecutar el script.")

    # print(openSwatch_SKP(request.GET['path']))
    # return JsonResponse({"data": obtener_contenido_del_archivo_pdf(request.GET['path'])})

    # Obtener el nombre del archivo generado en el directorio de destino
    base_filename = os.path.basename(ubicacion_skp)
    generated_filename = f"{os.path.splitext(base_filename)[0]}.glb"
    # generated_filename_bin = f"{os.path.splitext(base_filename)[0]}.bin"
    generated_filepath = os.path.join(destino, generated_filename)
    # generated_filepath_bin = os.path.join(destino, generated_filename)
    print(f"El archivo se ha guardado como: {generated_filename}")
    print(f"Ruta completa del archivo: {generated_filepath}")
    import json
    import io
    import zipfile
    from django.http import HttpResponse
    import mimetypes

    try:
        model_filepath = os.path.join(generated_filepath)
        archivos = None
        if os.path.exists(model_filepath):
            archivos = os.listdir(destino)
            print(archivos)

            with open(destino + '/' + generated_filename, 'rb') as archivo_gltf:
                contenido_gltf = archivo_gltf.read()


            response = HttpResponse(content_type='application/octet-stream')

            response.write(contenido_gltf)
          
            print(response)
            return response
    except Exception as e:
        print(f'Error: {str(e)}')
        print('Esto fue un error')
        return HttpResponse(f'Error: {str(e)}', status=500)
 

def get_file_data(request):
    print(request)
    print(request.GET['path'])

    # print(openSwatch_SKP(request.GET['path']))
    return JsonResponse({"data": obtener_contenido_del_archivo_pdf(request.GET['path'])})


def get_files(request):

    directorio = settings.PATH_TO_DIR \
        if (request.GET['path'] == '' or len(request.GET['path']) < len(settings.PATH_TO_DIR)) else f"{request.GET['path']}"

    print(f"Response: {request.GET['path']}, ruta: {directorio}")
    json_response = {"ruta": directorio}
    file_list = []
    try:
        archivos = os.listdir(directorio)

        for archivo in archivos:
            ruta_completa = os.path.join(directorio, archivo)
            if os.path.isfile(ruta_completa):
                # print(f'Archivo: {archivo}')
                file_list.append({
                    "file": archivo,
                    "type": "file",
                    "ext": obtener_tipo_archivo(ruta_completa),
                    "path_to_file": directorio + "/" + archivo,
                    # "data_file": obtener_contenido_del_archivo_pdf(),
                })

            elif os.path.isdir(ruta_completa):
                # print(f'Directorio: {archivo}')
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
    # print(json_response)
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
def proyectos(request, proyecto_id):
    return render(request, 'core/proyecto_proyecto.html', {'proyecto_id': proyecto_id})


@login_required
def start_view(request):
    return render(request, 'core/start_view.html')


def exit_session(request):
    logout(request)
    return redirect('home')
