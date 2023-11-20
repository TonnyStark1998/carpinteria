var preViewDataInput = document.getElementById("pre_view_data");
var viewDataInput = document.getElementById("view_data");
var numberA = -1;
var numberB = -1;
var symbol = '';

function agregarNumero(_numero){
    if(symbol == '='){
        symbol = '';
        clean();
    }
    viewDataInput.value = viewDataInput.value + _numero;
}

// Función para mostrar números y operadores en la pantalla
function insert(_operador) {
    if (viewDataInput.value != ""){
        switch (_operador) {
            case "/":
                if (parseFloat(viewDataInput.value) == 0){
                    alert("No se puede dividir entre cero");
                    viewDataInput.value = '';
                } else {
                    if (numberB != -1){
                        viewDataInput.value = parseFloat(numberB) / parseFloat(viewDataInput.value);
                    }
                    numberB = viewDataInput.value;
                    preViewDataInput.value = viewDataInput.value + " /";
                    numberA = viewDataInput.value;
                    viewDataInput.value = "";
                    symbol = '/';
                }
                break;
            case "@":
                    numberB = viewDataInput.value;
                    preViewDataInput.value = viewDataInput.value + " cuadrado";
                    viewDataInput.value = parseFloat(viewDataInput.value) * parseFloat(viewDataInput.value);
                    symbol = '@';
                break;
            case "raiz":
                    numberB = viewDataInput.value;
                    preViewDataInput.value = viewDataInput.value + " raiz";
                    viewDataInput.value = Math.sqrt(parseFloat(viewDataInput.value));
                    symbol = 'raiz';
                break;
            case "*":
                if (numberB != -1){
                    viewDataInput.value = parseFloat(numberB) * parseFloat(viewDataInput.value);
                }
                numberB = viewDataInput.value;
                preViewDataInput.value = viewDataInput.value + " *";
                numberA = viewDataInput.value;
                viewDataInput.value = "";
                symbol = '*';
                break;
            case "-":
                if (numberB != -1){
                    viewDataInput.value = parseFloat(numberB) - parseFloat(viewDataInput.value);
                }
                numberB = viewDataInput.value;
                preViewDataInput.value = viewDataInput.value + " -";
                numberA = viewDataInput.value;
                viewDataInput.value = "";
                symbol = '-';
                break;
            case "+":
                if (numberB != -1){
                    viewDataInput.value = parseFloat(numberB) + parseFloat(viewDataInput.value);
                }
                numberB = viewDataInput.value;
                preViewDataInput.value = viewDataInput.value + " +";
                numberA = viewDataInput.value;
                viewDataInput.value = "";
                symbol = '+';
                break;
            case "=":
                switch (symbol) {
                    case '+':
                        preViewDataInput.value = '';
                        viewDataInput.value = parseFloat(numberA) + parseFloat(viewDataInput.value);
                    break;
                    case '-':
                        preViewDataInput.value = '';
                        viewDataInput.value = parseFloat(numberA) - parseFloat(viewDataInput.value);
                    break;
                    case '*':
                        preViewDataInput.value = '';
                        viewDataInput.value = parseFloat(numberA) * parseFloat(viewDataInput.value);
                    break;
                    case '/':
                        if (parseFloat(viewDataInput.value) == 0){
                            alert("No se puede dividir entre cero");
                            viewDataInput.value = '';
                        } else {
                            preViewDataInput.value = '';
                            viewDataInput.value = parseFloat(numberA) / parseFloat(viewDataInput.value);
                        }
                    break;
                    case "@":
                            preViewDataInput.value = viewDataInput.value + " cuadrado";
                            viewDataInput.value = parseFloat(viewDataInput.value) * parseFloat(viewDataInput.value);
                            symbol = '@';
                        break;
                    case "raiz":
                            preViewDataInput.value = viewDataInput.value + " raiz";
                            viewDataInput.value = Math.sqrt(parseFloat(viewDataInput.value));
                            symbol = 'raiz';
                        break;
                }
                numberA = -1;
                numberB = -1;
                symbol = '=';
            break;
        }
    } else {
//        alert("Ingrese un numero por favor");
        preViewDataInput.value = preViewDataInput.value.slice(0, -2) + " "+ _operador;

    }
}

// Función para borrar el contenido de la pantalla
function clean() {
//    document.forms['calculator']['textview'].value = '';
    viewDataInput.value = "";
    preViewDataInput.value = "";
    numberA = -1;
    numberB = -1;
}

function back() {
    var textview = document.getElementById("view_data");
    var currentValue = textview.value;
    if (currentValue.length > 0) {
        var newValue = currentValue.slice(0, -1);
        textview.value = newValue;
    }
}
