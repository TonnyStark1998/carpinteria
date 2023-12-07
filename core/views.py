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
    with open(path_bin, 'rb') as archivo_bin:
        contenido_bin = archivo_bin.read()

    response = HttpResponse(content_type='application/text')

    response.write(contenido_bin)
    # print(response.content)
    return response

def get_file_data_skp(request):
    print("SMMMMMMMMMMMMMMMMMMM")
    print(request)
    print("SMMMMMMMMMMMMMMMMMMM12")
    print(request.GET['path'])
    print("SMMMMMMMMMMMMMMMMMMM33")
    # Ruta al ejecutable de Blender
    blender_executable = 'blender'

    # Ruta al script de Blender
    blender_script = 'D:/Documentos/odoo/carpinteria/carpinteria/convertion_skp_gltf.py'

    # Rutas de los archivos skp y destino
    ubicacion_skp = request.GET['path']
    destino = 'C:/Users/corne/Documents/temp/'

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
    generated_filename = f"{os.path.splitext(base_filename)[0]}.gltf"
    generated_filename_bin = f"{os.path.splitext(base_filename)[0]}.bin"
    generated_filepath = os.path.join(destino, generated_filename)
    generated_filepath_bin = os.path.join(destino, generated_filename)
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
            # Lee el contenido de los archivos en modo binario
            with open(destino + '/' + generated_filename_bin, 'rb') as archivo_bin:
                contenido_bin = archivo_bin.read()

            with open(destino + '/' + generated_filename, 'rb') as archivo_gltf:
                contenido_gltf = archivo_gltf.read()

            # # Crear un objeto JSON que contenga tanto el binario como el JSON
            # datos_json = {
            #     'binario': contenido_bin.decode('latin-1'),  # Convertir el binario a una cadena
            #     'json': contenido_gltf.decode('utf-8'),  # Suponiendo que el contenido es texto JSON
            # }
            #
            # # Serializar el objeto JSON a una cadena
            # json_string = json.dumps(datos_json)
            #
            # # Configurar la respuesta HTTP
            # response = HttpResponse(content_type='application/json')
            # response.write(json_string)
            # Configura la respuesta HTTP
            response = HttpResponse(content_type='application/text')

            # # Establece los tipos MIME
            # tipo_mime_bin = mimetypes.guess_type(destino + '/' + generated_filename_bin)[0]
            # tipo_mime_gltf = mimetypes.guess_type(destino + '/' + generated_filename)[0]

            # # Adjunta los archivos a la respuesta
            response.write(contenido_gltf)
            response.write('---MARCA---')
            response.write(destino + generated_filename_bin)
            # response.write(contenido_bin)

            # Establece los encabezados para la descarga
            # response['Content-Disposition'] = f'attachment; filename=archivo.bin'
            # response['Content-Type'] = 'application/octet-stream'  # Tipo MIME genérico para archivos binarios
            # response['Content-Length'] = os.path.getsize(
            #     os.path.join(destino, generated_filename_bin)) + os.path.getsize(
            #     os.path.join(destino, generated_filename))
            print(response.content)
            # -----
#             buffer = io.BytesIO()
#             with zipfile.ZipFile(buffer, 'w') as zip_file:
#                 for archivo in archivos:
#                     archivo_path = os.path.join(destino, archivo)
#                     with open(archivo_path, 'rb') as file:
#                         contenido_binario = file.read()
#                         zip_file.writestr(archivo, contenido_binario)
#
#             # buffer.seek(0)
#             print('Longitud del buffer antes de enviar:', len(buffer.getvalue()))
#
#
#             # response = HttpResponse(buffer.getvalue(), content_type='application/octet-stream')
#             # response['Content-Disposition'] = 'attachment; filename=archivos_modelo.zip'
#
#             # Crear la respuesta HTTP
#             response = HttpResponse(buffer.getvalue(), content_type='application/octet-stream')
#             response['Content-Disposition'] = 'attachment; filename=archivos_modelo.zip'
# # ----
        # buffer = io.BytesIO()
        #
        # response = HttpResponse(content_type='application/octet-stream')
        # response['Content-Disposition'] = 'attachment; filename=archivos_modelo.zip'
        #
        # with zipfile.ZipFile(buffer, 'w') as zip_file:
        #     for archivo in archivos:
        #         if archivo.endswith('.bin') or archivo.endswith('.gltf'):
        #             print('archivo')
        #             print(archivo)
        #         with open(destino + '/' + archivo, 'rb') as file:
        #             response.write(file.read())
        #             # archivo_path = os.path.join(destino, archivo)
        #             # zip_file.write(archivo_path, archivo)

        # buffer.seek(0)

            print('Esto NO fue un error')
            print(response)
            return response
    except Exception as e:
        print(f'Error: {str(e)}')
        print('Esto fue un error')
        # return JsonResponse({'error': f'Error al obtener datos: {str(e)}'}, status=500)
        return HttpResponse(f'Error: {str(e)}', status=500)
        # -------------------------
        # model_filepath = os.path.join(generated_filepath)
        #
        # if os.path.exists(model_filepath):
        # # if os.path.exists(gltf_filepath) and os.path.exists(bin_filepath):
        #     # Leer el modelo GLTF como JSON
        #     with open(generated_filepath, 'r', encoding='utf-8') as gltf_file:
        #         gltf_data = json.load(gltf_file)
        #
        #     # Leer el archivo binario como binario
        #     with open(generated_filepath_bin, 'rb') as bin_file:
        #         bin_data = bin_file.read()
        #
        #     # Codificar el contenido binario en base64
        #     encoded_bin_data = base64.b64encode(bin_data).decode('utf-8')
        #
        #     # Actualizar el modelo GLTF para incluir el binario
        #     # Aquí asumimos que hay un único buffer en el modelo GLTF
        #     gltf_data["buffers"][0]['uri'] = f'data:application/octet-stream;base64,{encoded_bin_data}'
        #
        #     # Guardar el modelo GLTF modificado
        #     with open(generated_filepath, 'w', encoding='utf-8') as gltf_file:
        #         json.dump(gltf_data, gltf_file)
        #
        #     print("{'model_data': gltf_data}")
        #     print({'model_data': gltf_data})
        #     # Enviar la respuesta JSON con el modelo GLTF modificado
        #     # Convertir el diccionario a una cadena JSON
        #     cadena_json = json.dumps(gltf_data)
        #
        #     # Codificar la cadena JSON en base64
        #     response_data = base64.b64encode(cadena_json.encode('utf-8')).decode('utf-8')
        #     # response_data = {'model_data': base64.b64encode(gltf_data).decode('utf-8')}
        #     return JsonResponse(response_data, safe=False)

# -------------------------
        # if os.path.exists(model_filepath):
        #     # Leer el modelo principal como texto
        #     with open(model_filepath, 'r', encoding='latin-1') as file:
        #         model_data = file.read()
        #
        #     # Obtener la lista de archivos adicionales en la misma carpeta
        #     additional_files = None
        #
        #     for filename in os.listdir(destino):
        #         if filename != generated_filename:
        #             file_path = os.path.join(destino, filename)
        #             with open(file_path, 'rb') as additional_file:
        #                 if filename.endswith('.gltf'):
        #                     # additional_data = base64.b64encode(additional_file.read()).decode('utf-8')
        #                     model_data = additional_file.read()
        #                     print("additional_file")
        #                     print(additional_file)
        #                 if filename.endswith('.bin'):
        #                     additional_data = base64.b64encode(additional_file.read()).decode('utf-8')
        #                     additional_files = additional_data
        #                     # additional_files[filename] = additional_data
        #                     print("additional_file")
        #                     print(additional_file)
        #                 # additional_files[filename] = additional_data
        #                 # # Leer el archivo adicional como binario y codificarlo en Base64
        #                 # additional_data = base64.b64encode(additional_file.read()).decode('utf-8')
        #                 # additional_files[filename] = additional_data
        #
        #     # Incluir datos codificados en el JsonResponse
        #     response_data = {'model_data': model_data, 'additional_files': additional_files}
        #     return JsonResponse(response_data)
    #     else:
    #         return JsonResponse({'error': 'Modelo no encontrado'}, status=404)
    # except Exception as e:
    #     print(f'Error: {str(e)}')
    #     return JsonResponse({'error': f'Error al obtener datos: {str(e)}'}, status=500)


def get_file_data(request):
    print(request)
    print(request.GET['path'])

    # print(openSwatch_SKP(request.GET['path']))
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
