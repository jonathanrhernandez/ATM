/* Entrada del nùmero de tarjeta y validaciones para que no meta otro caracter que no sea numero, se formatea para que cada 4 digitos tenga un espacio */

const cardNumberInput = document.getElementById("cardNumberInput");
cardNumberInput.addEventListener("input", function () {
  // Obtener el valor actual del campo de entrada y limpiar los caracteres no numéricos
  let value = this.value.replace(/\D/g, "");
  // Limitar la longitud del número de tarjeta a 16 dígitos
  if (value.length > 16) {
    value = value.slice(0, 16);
  }
  // Formatear el número de tarjeta insertando un espacio cada 4 dígitos
  let formattedValue = value.replace(/(.{4})/g, "$1 ");
  // Actualizar el valor del campo de entrada con el número formateado
  this.value = formattedValue.trim();
});

/* ****IndexDB***** */

// Usando dexie.js

// Crear una instancia de Dexie y definir la base de datos
const db = new Dexie("miBanco");

// Definir el esquema de la base de datos y crear la tabla
db.version(1).stores({
  tarjetaHabientes: "++numeroTarjeta, nombre, saldo, nip", // "numeroTarjeta" será la clave primaria
});

// Abrir la base de datos
db.open().catch(function (error) {
  // console.error('Error al abrir la base de datos', error);
});

// Agregar valores por default, se crea un arreglo de objetos con los valores a agregar

const nuevosTarjetaHabientes = [
  {
    nombre: "Persona 1",
    saldo: 900,
    nip: "1111",
    numeroTarjeta: "1111111111111111",
  },
  {
    nombre: "Persona 2",
    saldo: 800,
    nip: "2222",
    numeroTarjeta: "2222222222222222",
  },
  {
    nombre: "Persona 3",
    saldo: 700,
    nip: "3333",
    numeroTarjeta: "3333333333333333",
  },
];

// Agregado de valores en bulk

db.tarjetaHabientes
  .bulkAdd(nuevosTarjetaHabientes)
  .then(function () {
    console.log("Registros agregados correctamente");
  })
  .catch(function (error) {
    // console.error('Error al agregar registros', error);
  });

// Consultar tarjetahabiente
async function consultarTarjetaHabiente(numeroTarjeta) {
  try {
    // Realizar la consulta y esperar a que se complete
    let tarjetaHabiente = await db.tarjetaHabientes.get(numeroTarjeta);

    if (tarjetaHabiente) {
      // console.log('TarjetaHabiente encontrado:', tarjetaHabiente);
      return tarjetaHabiente; // Retornar el tarjetaHabiente encontrado
    } else {
      console.log("TarjetaHabiente no encontrado");
      return null; // Retornar null si el tarjetaHabiente no se encuentra
    }
  } catch (error) {
    console.error("Error al consultar el tarjetaHabiente:", error);
    return null; // Retornar null en caso de error
  }
}

/******************Mi Código******************** */

// Leer tarjeta

let cajero = document.getElementById("pantalla");
let error = document.getElementById("error");
let nip = document.getElementById("nip");
let nipInput = document.getElementById('nipInput');
let mainMenu = document.getElementById('mainMenu');
let valorNip="";
let flujo = "leerTarjeta";

const aceptar = document.getElementById("aceptar");
aceptar.addEventListener("click", async function (event) {  
  const numeroTarjeta = cardNumberInput.value.replace(/\D/g, "");
  if (flujo === "leerTarjeta" && numeroTarjeta.length == 16) {
    aceptar.disabled = true; // deshabilita el btn aceptar
    cardNumberInput.setAttribute("readonly", true);
    try {
      let resultado = await consultarTarjetaHabiente(numeroTarjeta);
      if (resultado === null) {
        // Ocultar el primer div
        cajero.style.display = "none";
        // Mostrar el segundo div
        error.style.display = "block";

        // Cambiar la visibilidad nuevamente después de otros 3 segundos
        setTimeout(function () {
          cajero.style.display = "block";
          error.style.display = "none";
          cardNumberInput.value = "";
          cardNumberInput.removeAttribute("readonly");
          aceptar.disabled = false;
        }, 5000);
      } else {
        cajero.style.display = "none";
        nip.style.display = "block";
        document.getElementById('lblnip').innerText = "Bienvenido "+ resultado.nombre + " por favor ingresa tu NIP";
        flujo = "leerNip";
        aceptar.disabled = false;        
      }
    } catch (error) {
      console.error("Error al consultar el tarjetaHabiente:", error);
    }
  }
  else if(flujo === "leerNip"){    
    try {
      let resultado = await consultarTarjetaHabiente(numeroTarjeta);
      if (resultado.nip === valorNip) {
        console.log("NiP valido");
        nip.style.display = "none";
        mainMenu.style.display = "block";        
      }
      else{
        console.log("NiP incorrecto");
        valorNip = "";
        nipInput.innerText = '';
        document.getElementById('lblnip').innerText = resultado.nombre + " tu NIP es incorrecto, intenta de nuevo por favor";
      }
    } catch (error) {
      console.error("Error al validar NIP", error);
    }

  } else {
    console.log("Tu tarjeta no puede ser leída por favor intenta de nuevo");
    cardNumberInput.value = "";
  }
});

// Uso de botones
let btn0 = document.getElementById("btn0");
let btn1 = document.getElementById("btn1");
let btn2 = document.getElementById("btn2");
let btn3 = document.getElementById("btn3");
let btn4 = document.getElementById("btn4");
let btn5 = document.getElementById("btn5");
let btn6 = document.getElementById("btn6");
let btn7 = document.getElementById("btn7");
let btn8 = document.getElementById("btn8");
let btn9 = document.getElementById("btn9");
let btnx = document.getElementById("btnx");
let btnDel = document.getElementById("btnDel");

btn0.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {    
    if (valorNip.length < 4) {
      valorNip += "0";
      nipInput.innerText += '*';
      console.log(valorNip);
    }  
  }

});

btn1.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {    
    if (valorNip.length < 4) {
      valorNip += "1";
      nipInput.innerText += '*';
      console.log(valorNip);
    }  
  }

});

btn2.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {    
    if (valorNip.length < 4) {
      valorNip += "2";
      nipInput.innerText += '*';
      console.log(valorNip);
    }  
  }

});

btn3.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {    
    if (valorNip.length < 4) {
      valorNip += "3";
      nipInput.innerText += '*';
      console.log(valorNip);
    }  
  }

});

btn4.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {    
    if (valorNip.length < 4) {
      valorNip += "4";
      nipInput.innerText += '*';
      console.log(valorNip);
    }  
  }

});

btn5.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {    
    if (valorNip.length < 4) {
      valorNip += "5";
      nipInput.innerText += '*';
      console.log(valorNip);
    }  
  }

});

btn6.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {    
    if (valorNip.length < 4) {
      valorNip += "6";
      nipInput.innerText += '*';
      console.log(valorNip);
    }  
  }

});

btn7.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {    
    if (valorNip.length < 4) {
      valorNip += "7";
      nipInput.innerText += '*';
      console.log(valorNip);
    }  
  }

});

btn8.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {    
    if (valorNip.length < 4) {
      valorNip += "8";
      nipInput.innerText += '*';
      console.log(valorNip);
    }  
  }

});

btn9.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {    
    if (valorNip.length < 4) {
      valorNip += "9";
      nipInput.innerText += '*';
      console.log(valorNip);
    }  
  }

});

btnx.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {        
      valorNip = "";
      nipInput.innerText = '';
      console.log(valorNip);    
  }

});

btnDel.addEventListener('click', function(){
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == 'block') {        
      valorNip = valorNip.slice(0, -1);;
      let valor = nipInput.innerText;
      valor = valor.slice(0,-1)
      nipInput.innerText = valor;
      console.log(valorNip);      
  }

});


