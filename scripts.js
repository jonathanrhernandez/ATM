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

// Actualizar tarjetahabiente

async function actualizarSaldoTarjetaHabiente(nuevoSaldo) {
  try {
    // debugger;
    // Guardar el nuevo saldo en la base de datos
    await db.tarjetaHabientes.update(resultado.numeroTarjeta, {
      saldo: nuevoSaldo,
    });

    console.log("Saldo actualizado correctamente.");
    return true; // Retornar verdadero para indicar que se ha actualizado correctamente
  } catch (error) {
    console.error("Error al actualizar el saldo del tarjetaHabiente:", error);
    return false; // Retornar falso en caso de error
  }
}

/******************Logica******************** */

// Leer tarjeta

let cajero = document.getElementById("pantalla");
let error = document.getElementById("error");
let nip = document.getElementById("nip");
let nipInput = document.getElementById("nipInput");
let mainMenu = document.getElementById("mainMenu");
let graciasScreen = document.getElementById("graciasScreen");

let montoRetiroInput = document.getElementById("montoRetiroInput");
let montoDepositoInput = document.getElementById("montoDepositoInput");

let otraTransaccionRetiro = document.getElementById("otraTransaccionRetiro");
let otraTransaccionDeposito = document.getElementById("otraTransaccionDeposito");

let MinimoEnCuenta = 10;
let maximoEnCuenta = 990;
let saldoAnterior="";

let valorNip = "";
let flujo = "leerTarjeta";
let regresar = "inicio";
let inforetirarMonto = document.getElementById("inforetirarMonto");
let resultado;

//Boton aceptar

const aceptar = document.getElementById("aceptar");

aceptar.addEventListener("click", async function (event) {
  const numeroTarjeta = cardNumberInput.value.replace(/\D/g, "");
  if (flujo === "leerTarjeta" && numeroTarjeta.length == 16) {
    aceptar.disabled = true; // deshabilita el btn aceptar
    cardNumberInput.setAttribute("readonly", true);
    try {
      resultado = await consultarTarjetaHabiente(numeroTarjeta);
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
        }, 3000);
      } else {
        cajero.style.display = "none";
        nip.style.display = "block";
        document.getElementById("lblnip").innerText =
          "Bienvenido " + resultado.nombre + " por favor ingresa tu NIP";
        flujo = "leerNip";
        aceptar.disabled = false;
        return resultado;
      }
    } catch (error) {
      console.error("Error al consultar el tarjetaHabiente:", error);
    }
  } else if (flujo === "leerNip") {
    try {
      // resultado = await consultarTarjetaHabiente(numeroTarjeta);
      if (resultado.nip === valorNip) {
        console.log("NiP valido");
        nip.style.display = "none";
        mainMenu.style.display = "block";
        flujo = "retirarMonto";
        return resultado;
      } else {
        console.log("NiP incorrecto");
        valorNip = "";
        nipInput.innerText = "";
        document.getElementById("lblnip").innerText =
          resultado.nombre +
          " tu NIP es incorrecto, intenta de nuevo por favor";
      }
    } catch (error) {
      console.error("Error al validar NIP", error);
    }
  } else if (flujo === "retirarMonto") {
    console.log("Flujo Retirar monto");
    if (cantidad <= 0) {
      inforetirarMonto.innerText =
        "¡Debes ingresar un monto para poder retirarlo!";
        otraTransaccionRetiro.style.display = "block";
    } else if (resultado.saldo - cantidad >= MinimoEnCuenta) {
      saldoAnterior = resultado.saldo;
      let montoIngresado = await actualizarSaldoTarjetaHabiente(
        saldoAnterior - cantidad
      );
      if (montoIngresado) {
        resultado = await consultarTarjetaHabiente(resultado.numeroTarjeta);
        console.log(saldoAnterior + " - " + cantidad + " = " + resultado.saldo);
        inforetirarMonto.innerText =
          "Favor de tomar tu efectivo 💸 Retiraste $" +
          cantidad +
          ".00. Tu saldo anterior era de $" +
          saldoAnterior +
          ".00. Tu nuevo saldo es de $" +
          resultado.saldo +
          ".00";
          montoRetiroInput.value = "";
          cantidad = "";
        otraTransaccionRetiro.style.display = "block";
      }
    } else {
      console.log("Saldo insuficiente");
      cantidad = "";
      montoRetiroInput.value = "";
      inforetirarMonto.innerText =
        "¡Saldo insuficiente, recuerda que debes mantener un monto minimo en tu cuenta de $" +
        MinimoEnCuenta +
        ".00 favor de ingresar un monto menor a retirar!";
        otraTransaccionRetiro.style.display = "block";
    }
  } else if (flujo == "depositarMonto") {    
    console.log("Flujo depositar monto");
    if (cantidad <= 0) {
      infoDepositarMonto.innerText =
        "¡Debes ingresar un monto para poder depositarlo!";
        otraTransaccionDeposito.style.display = "block";
    }
    else if (resultado.saldo + parseFloat(cantidad) <= maximoEnCuenta) {
      saldoAnterior = resultado.saldo;
      let montoADepositar = await actualizarSaldoTarjetaHabiente(
        parseFloat(saldoAnterior) + parseFloat(cantidad)
      );
      if (montoADepositar) {
        resultado = await consultarTarjetaHabiente(resultado.numeroTarjeta);
        console.log(saldoAnterior + " + " + cantidad + " = " + resultado.saldo);
        infoDepositarMonto.innerText =
          "Transacción realizada con éxito 💸 Depositaste $" +
          cantidad +
          ".00. Tu saldo anterior era de $" +
          saldoAnterior +
          ".00. Tu nuevo saldo es de $" +
          resultado.saldo +
          ".00";
          montoDepositoInput.value = "";
          cantidad = "";
          otraTransaccionDeposito.style.display = "block";
      }
    }
    else {
      console.log("Monto mayor al permitido");
      cantidad = "";
      montoDepositoInput.value = "";
      infoDepositarMonto.innerText =
        "¡Saldo mayor al permitido, recuerda que debes mantener un monto máximo en tu cuenta de $" +
        maximoEnCuenta +
        ".00 favor de ingresar un monto menor a depositar!";
        otraTransaccionDeposito.style.display = "block";
    }
  } else {
    console.log("Tu tarjeta no puede ser leída por favor intenta de nuevo");
    cardNumberInput.value = "";
  }
});

//consultar Saldo

let consultarSaldo = document.getElementById("consultarSaldo");
let saldoAmount = document.getElementById("saldoAmount");
let saldoScreen = document.getElementById("saldoScreen");

consultarSaldo.addEventListener("click", function () {
  // console.log(resultado);
  const saldo = resultado.saldo.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
  saldoAmount.innerText = saldo;
  mainMenu.style.display = "none";
  saldoScreen.style.display = "block";  
});

// retirar Saldo

let retirarSaldo = document.getElementById("retirarSaldo");
let retirarSaldoScreen = document.getElementById("retirarSaldoScreen");

retirarSaldo.addEventListener("click", function () {
  mainMenu.style.display = "none";
  retirarSaldoScreen.style.display = "block";
  saldoAnterior=""
  flujo = "retirarMonto"
});

// depositar Saldo

let depositarSaldo = document.getElementById("depositarSaldo");
let depositarSaldoScreen = document.getElementById("depositarSaldoScreen");

depositarSaldo.addEventListener("click", function () {
  mainMenu.style.display = "none";
  cantidad = "";
  depositarSaldoScreen.style.display = "block";
  saldoAnterior=""
  flujo = "depositarMonto";
});

// Boton cancelar

let menuCancelar = document.getElementById("cancelarTransaccion");
let cancelarTransaccionRetiro = document.getElementById(
  "cancelarTransaccionRetiro"
);
let cancelarTransaccionDeposito = document.getElementById("cancelarTransaccionDeposito");
let aceptarTransaccion = document.getElementById("aceptarTransaccion");
let aceptarTransaccionRetiro = document.getElementById(
  "aceptarTransaccionRetiro"
);

function cancelarOperacion() {
  saldoScreen.style.display = "none";
  retirarSaldoScreen.style.display = "none";
  depositarSaldoScreen.style.display = "none";
  otraTransaccionRetiro.style.display = "none";
  otraTransaccionDeposito.style.display = "none";
  cantidad = "";
  montoRetiroInput.value = "";
  montoDepositoInput.value="";
  inforetirarMonto.innerText = "";
  infoDepositarMonto.innerText = "";

  graciasScreen.style.display = "block";

  // Cambiar la visibilidad nuevamente después de otros 3 segundos
  setTimeout(function () {
    cajero.style.display = "block";
    graciasScreen.style.display = "none";
    cardNumberInput.value = "";
    cardNumberInput.removeAttribute("readonly");
    nipInput.innerText = "";
    valorNip = "";
    flujo = "leerTarjeta";
  }, 3000);
}

function aceptarOperacion() {
  saldoScreen.style.display = "none";
  retirarSaldoScreen.style.display = "none";  
  otraTransaccionRetiro.style.display = "none";
  cantidad = "";
  montoRetiroInput.value = "";
  inforetirarMonto.innerText = "";

  depositarSaldoScreen.style.display = "none";
  otraTransaccionDeposito.style.display = "none";
  montoDepositoInput.value = "";
  infoDepositarMonto.innerText = "";

  mainMenu.style.display = "block";
}

//graciasScreen

menuCancelar.addEventListener("click", function () {
  cancelarOperacion();
});
cancelarTransaccionRetiro.addEventListener("click", function () {
  cancelarOperacion();
});

cancelarTransaccionDeposito.addEventListener("click", function () {
  cancelarOperacion();
});

aceptarTransaccion.addEventListener("click", function () {
  aceptarOperacion();
});

aceptarTransaccionRetiro.addEventListener("click", function () {
  aceptarOperacion();
});

aceptarTransaccionDeposito.addEventListener("click", function () {
  aceptarOperacion();
});

let cancelar = document.getElementById("salir");

cancelar.addEventListener("click", function () {
  let x = window.getComputedStyle(cajero);
  if (
    x.getPropertyValue("display") == "block" ||
    x.getPropertyValue("display") == "flex"
  ) {
    cardNumberInput.value = "";
  } else if (
    nip.style.display == "block" ||
    mainMenu.style.display == "block" ||
    saldoScreen.style.display == "block" ||
    retirarSaldoScreen.style.display == "block" || 
    depositarSaldoScreen.style.display == "block"
  ) {
    cardNumberInput.value = "";
    cardNumberInput.removeAttribute("readonly");
    nipInput.innerText = "";
    valorNip = "";
    cantidad = "";

    montoRetiroInput.value = "";
    inforetirarMonto.innerText = "";
    infoDepositarMonto.innerText = "";
    
    montoDepositoInput.value = "";

    flujo = "leerTarjeta";
    nip.style.display = "none";
    mainMenu.style.display = "none";
    saldoScreen.style.display = "none";
    retirarSaldoScreen.style.display = "none";
    otraTransaccionRetiro.style.display = "none";
    otraTransaccionDeposito.style.display = "none";
    depositarSaldoScreen.style.display = "none";

    cajero.style.display = "block";
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

let cantidad = "";

// Formatear el valor como moneda mexicana
function formatoMoneda(valor) {
  let dato = parseFloat(valor.replace(/[^0-9.-]/g, ""));
  if (!isNaN(dato) && dato > 99) {
    // Formatear el número como moneda mexicana
    let valorFormateado = new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(dato);
    // console.log(valorFormateado);
    return valorFormateado;
  } else {
    // Si el número no es válido, devolver el valor original
    return valor;
  }
}

btn0.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    if (valorNip.length < 4) {
      valorNip += "0";
      nipInput.innerText += "*";
      console.log(valorNip);
    }
  } else if (retirarSaldoScreen.style.display == "block" && cantidad > 0) {
    cantidad += "0";
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log(montoRetiroInput.value);
  } 
  else if(depositarSaldoScreen.style.display == "block" && cantidad > 0){
    cantidad += "0";
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log(montoDepositoInput.value );
  }
  else {
    console.log("Ingresa un valor mayor a 0");
  }
});

btn1.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    if (valorNip.length < 4) {
      valorNip += "1";
      nipInput.innerText += "*";
      console.log(valorNip);
    }
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad += "1";
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log(montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad += "1";
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log(montoDepositoInput.value );
  } 
});

btn2.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    if (valorNip.length < 4) {
      valorNip += "2";
      nipInput.innerText += "*";
      console.log(valorNip);
    }
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad += "2";
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log(montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad += "2";
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log(montoDepositoInput.value );
  } 
});

btn3.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    if (valorNip.length < 4) {
      valorNip += "3";
      nipInput.innerText += "*";
      console.log(valorNip);
    }
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad += "3";
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log(montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad += "3";
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log(montoDepositoInput.value );
  } 
});

btn4.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    if (valorNip.length < 4) {
      valorNip += "4";
      nipInput.innerText += "*";
      console.log(valorNip);
    }
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad += "4";
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log(montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad += "4";
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log(montoDepositoInput.value );
  } 
});

btn5.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    if (valorNip.length < 4) {
      valorNip += "5";
      nipInput.innerText += "*";
      console.log(valorNip);
    }
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad += "5";
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log(montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad += "5";
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log(montoDepositoInput.value );
  } 
});

btn6.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    if (valorNip.length < 4) {
      valorNip += "6";
      nipInput.innerText += "*";
      console.log(valorNip);
    }
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad += "6";
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log(montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad += "6";
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log(montoDepositoInput.value );
  } 
});

btn7.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    if (valorNip.length < 4) {
      valorNip += "7";
      nipInput.innerText += "*";
      console.log(valorNip);
    }
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad += "7";
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log(montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad += "7";
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log(montoDepositoInput.value );
  } 
});

btn8.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    if (valorNip.length < 4) {
      cantidad += "8";
      montoRetiroInput.value = formatoMoneda(cantidad);
      nipInput.innerText += "*";
      console.log(valorNip);
    }
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad += "8";
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log(montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad += "8";
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log(montoDepositoInput.value );
  } 
});

btn9.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    if (valorNip.length < 4) {
      valorNip += "9";
      nipInput.innerText += "*";
      console.log(valorNip);
    }
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad += "9";
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log(montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad += "9";
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log(montoDepositoInput.value );
  } 
});

btnx.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    valorNip = "";
    nipInput.innerText = "";
    console.log(valorNip);
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad = "";
    montoRetiroInput.value = "";
    console.log("Valor vacio " + montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad = "";
    montoDepositoInput.value = "";
    console.log("valor vacio " + montoDepositoInput.value );
  } 
});

btnDel.addEventListener("click", function () {
  //Identifica si estoy en la pantalla donde se pone el nip
  if (nip.style.display == "block") {
    valorNip = valorNip.slice(0, -1);
    let valor = nipInput.innerText;
    valor = valor.slice(0, -1);
    nipInput.innerText = valor;
    console.log(valorNip);
  } else if (retirarSaldoScreen.style.display == "block") {
    cantidad = cantidad.slice(0, -1);
    montoRetiroInput.value = formatoMoneda(cantidad);
    console.log("Se elimino un valor: " + montoRetiroInput.value);
  }
  else if(depositarSaldoScreen.style.display == "block"){
    cantidad = cantidad.slice(0, -1);
    montoDepositoInput.value = formatoMoneda(cantidad);
    console.log("Se elimino un valor: " + montoDepositoInput.value);
  }
});
