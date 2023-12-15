import bpy
import sys
import os

# Obtener los argumentos de línea de comandos
args = sys.argv
argv = args[args.index("--") + 1:]  # Solo consideramos los argumentos después de "--"

# Verificar que haya al menos dos argumentos (ubicación del archivo SKP y destino)
if len(argv) < 2:
    print("Faltan argumentos. Deben proporcionarse al menos dos: ubicación del archivo SKP y destino.")
    sys.exit(1)

# Argumento 1: Ubicación del archivo SKP
ubicacion_skp = argv[0]

# Argumento 2: Destino
destino = argv[1]

# Deselect all objects
bpy.ops.object.select_all(action='DESELECT')

# Select and delete all objects in the scene
bpy.ops.object.select_by_type(type='MESH')
bpy.ops.object.delete()

# Update the scene to reflect the changes
bpy.context.view_layer.update()

# Cargar el archivo SKP
bpy.ops.import_scene.skp(filepath=ubicacion_skp)
# bpy.ops.import_scene.skp(filepath=ubicacion_skp)

# Crear la ruta completa del archivo de destino
nombre_archivo = os.path.splitext(os.path.basename(ubicacion_skp))[0]
ruta_destino = os.path.join(destino, f"{nombre_archivo}.gltf")

# Exportar a glTF
bpy.ops.export_scene.gltf(filepath=ruta_destino, export_format='GLB')

# Imprimir información
print(f"Conversión completa. Se ha guardado en: {ruta_destino}")
