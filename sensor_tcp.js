// Sensor tcp
var net = require("net");

// Creamos el sensor mediante protocolo TCP
var server = net.createServer(function (socket) {
  function generate() {
    limite = 0;
    var r = Math.random() * 100;
    r = r.toFixed(1);
    limite = limite + 1;
    console.log("sensor2: %s", r);

    socket.write(r.toString());
    if ((limite = 200)) {
      setTimeout(generate, 500);
    }
    return r;
  }
  generate();
});

server.listen(3000, "192.168.1.3");
