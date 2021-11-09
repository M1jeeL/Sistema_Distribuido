// Sensor tcp
var net = require("net");

// Creamos el sensor mediante protocolo TCP
var server = net.createServer(function (socket) {
  // Función para limitar el envío de datos
  function generate() {
    limite = 0;
    // Genera un número aleatorio entre 0 y 100
    var r = Math.random() * 100;
    // Le quita los decimales al valor generado
    r = r.toFixed(1);

    limite = limite + 1;

    console.log("sensor2: %s", r);
    // Envía el dato al middleware mediante protocolo TCP
    socket.write(r.toString());
    if ((limite = 200)) {
      setTimeout(generate, 1000);
    }
    return r;
  }
  generate();
});

server.listen(3000, "192.168.1.3");
