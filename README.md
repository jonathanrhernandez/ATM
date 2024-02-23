# Cajero Automático

## Descripción del ejericio

Crea una aplicación web con JavaScript donde simulemos la interacción con un cajero automático.
Al ingresar al cajero, puedes seleccionar la cuenta con la que deseas interactuar. Deben existir al menos tres cuentas:
Persona 1
Persona 2
Persona 3
Para esto, puedes trabajar con un arreglo de objetos como el siguiente:

Al seleccionar una cuenta, debes ingresar el password asociado a la cuenta. Si el password es incorrecto, debes notificar al usuario y permitirle intentarlo nuevamente. Si el password es correcto, debes mostrar las siguientes opciones:
Consultar saldo
Ingresar monto
Retirar Monto
Al seleccionar consultar saldo, debe mostrar en pantalla el saldo actual de la cuenta
Al seleccionar ingresar monto, el usuario debe escribir el monto a ingresar. Al ingresar el monto, debe mostrarle al usuario el monto ingresado y el nuevo saldo total.
Al seleccionar retirar monto, el usuario debe escribir el monto a retirar. Al retirar el monto, debe mostrarle al usuario el monto retirado y el nuevo saldo total.
Como regla de negocio, una cuenta no debe de tener más de $990 y menos de $10. Es necesario hacer las validaciones pertinentes para que no se rompa esta regla de negocio.

## Descripción de la solución

- Al correr el sitio, se crearan automaticamente 3 registros con los que se puede interactuar (Los registros están en una IndexedDB)
    - nombre: Persona 1,
        - saldo: 900,
        - nip: 1111,
        - numeroTarjeta: 1111111111111111,
    - nombre: Persona 2,    
        - saldo: 800,    
        - nip: 2222,    
        - numeroTarjeta: 2222222222222222,
    - nombre: Persona 3,    
        - saldo: 700,    
        - nip: 3333,    
        - numeroTarjeta: 3333333333333333,
- Usar cualquiera de los insumos mencionados previamente,si usas algun otro el sistema no te dejara entrar (Considerar que todo esto es de lado del cliente)
- El cajero simula el ingreso de una tarjeta fisica, usar el número de tarjeta con el teclado y dar click en el botón aceptar
- Una vez dentro el sistema te pedira el NIP, usar el NIP correspondiente para poder acceder, para ingresar el NIP solo se puede usar el teclado numerico que esta en la pantalla dando click en el número deseado.
- Si le das click al botón cancelar de dicho teclado, te botara la tarjeta como haría un cajero y debes volver a empezar.
- El botón aceptar es para ejecutar las acciones de seguir con el flujo
    - Si estas donde te pide el NIP, este botón sirve para validar que el NIP este correcto y dejarte o no pasar
    - Si estás en la pantalla (vista) de retirar o depositar saldo este botón ejecuta la acción de retiro o deposito
- Cuando el NIP sea correcto, serás dirigido al menú principal, con las opciones de:
    - Consultar Saldo
    - Retirar Saldo
    - Depositar Monto
- Dar click en la opción deseada, si es de retirar o depositar, solo se podrá usar el teclado azul para ingresar los montos, y dar click en aceptar
- Despues de intentar o realizar algúna transacción, el sistema preguntara si se desea realizar algún otro movimiento. Si se da click en el botón aceptar que aparece en la pantalla principal, serás dirigido de nuevo al menù de opciones, si das cancelar se te presentarà una pantalla agradeciedno tu preferencia y despues de 3 segundos se liberara la tarjeta para poder iniciar de nuevo

__Nota:__  Recuerda que al retirar no puedes quedarte con un saldo menor a $ 10.00 y al depositar no puedes tener un monto mayor a $ 990.00
