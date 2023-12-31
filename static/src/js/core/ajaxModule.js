export function obtenerDirectorio(_path) {
    console.log('_path');
    console.log(_path);
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/get_files',
        dataType: 'json',
        data: {
          'path': _path,
        },
        success: resolve,
        error: reject,
      });
    });
  }
  
  export function getFileDataSKP(path) {
    $('#modal-xl').modal('show');
    var sceneContainer = document.getElementById('scene-container');
    sceneContainer.innerHTML = '';

    return fetch(`/get_file_data_skp?path=${path}`, {
      method: 'GET',
      responseType: 'arraybuffer'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.arrayBuffer();
    });
  }

  export function getFileData(path) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/get_file_data',
        dataType: 'json',
        data: { path: path },
        success: resolve,
        error: reject,
      });
    });
  }
  
  console.log("LOADED")