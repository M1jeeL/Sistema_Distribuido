// Middleware Serial - TCP - UDP - HTTP - WS
const net = require("net");
const xmlrpc = require("xmlrpc");
const dgram = require("dgram");
const SerialPort = require("serialport");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

const enchufe_udp = dgram.createSocket("udp4");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Se define la carpeta static para obtener el index.html + index.css + index.js
app.use(express.static("static"));

// Se crea un endpoint que devuelve el archivo index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Se activa el servidor en el puerto 1000
server.listen(1000, () => {
  console.log("listening on 1000");
});

// Conexión a DB Mongo
mongoose.connect("mongodb://localhost/sistema-distribuido", function (err) {
  if (!err) {
    console.log(err);
  } else {
  }
});

// Schema para sensor vía tcp
Sensor1 = new mongoose.Schema(
  {
    medida: Number,
  },
  { collection: "sensor_tcp" }
);
// Schema para sensor vía udp
Sensor2 = new mongoose.Schema(
  {
    medida: Number,
  },
  { collection: "sensor_udp" }
);
// Schema para sensor vía Serial
Sensor3 = new mongoose.Schema(
  {
    medida: Number,
  },
  { collection: "sensor_serial" }
);

// Genera un modelo en mongoose para cada sensor

// TCP
Sensor1 = mongoose.model("Sensor1", Sensor1);
// UDP
Sensor2 = mongoose.model("Sensor2", Sensor2);
// Serial
Sensor3 = mongoose.model("Sensor3", Sensor3);

// Conexión vía TCP
var enchufe_tcp = new net.Socket();
// Conecta con sensor
enchufe_tcp.connect(3000, "192.168.1.3");

// Escucha mediante protocolo TCP
enchufe_tcp.on("data", (data) => {
  data = data.toString();
  console.log("sensor presion: " + data);

  // Se envía el dato mediante WebSocket
  //   io.emit("sensor_temperatura", data);

  // Conexión RPC
  setTimeout(() => {
    var data_rpc = parseInt(data);
    const cliente = xmlrpc.createClient({
      host: "192.168.1.3",
      port: 5000,
      path: "/",
    });

    // Mediante RPC se llama a la función "amplificar", para luego mostrar por consola el valor recibido
    cliente.methodCall("amplificar", [data_rpc], function (error, value) {
      console.log(`respuesta: ${value}`);
      // Se envía mediante WebSocket la respuesta de la aplicación conectada vía rpc
      io.emit("sensor_presion", value);
    });
  }, 2000);

  // Guardamos el dato recibido del sensor TCP en la base de datos MongoDB
  Sensor1.collection.insertOne({ medida: data }, function (err, res) {
    if (err) throw err;
  });

  //   // Buscamos en la base de datos los datos guardados en la colección para mostrar la cantidad total de datos
  Sensor1.find(function (err, data) {
    if (err) {
      return console.log(err);
    } else if (data === null) {
      console.log("no hay datos");
    }
    let paquete = new Array();

    data.forEach(function (element) {
      paquete.push(element.medida);
    });

    let total = paquete.length;
    console.log("El total de datos sensor 2 es: " + total);
  });
});

// Escucha mediante protocolo UDP
enchufe_udp.on("message", function (msg, info) {
  msg = msg.toString("utf8");

  //   console.log("sensor calidad: " + msg);

  // Se envía el dato mediante WebSocket
  io.emit("sensor_calidad", msg);

  // Guardamos el dato recibido del sensor UDP en la base de datos MongoDB
  Sensor2.collection.insertOne(
    { medida: msg.toString("utf8") },
    function (err, res) {
      if (err) throw err;
    }
  );

  //   // Buscamos en la base de datos los datos guardados en la colección para mostrar la cantidad total de datos
  Sensor2.find(function (err, data) {
    if (err) {
      return console.log(err);
    } else if (data === null) {
      console.log("no hay datos");
    }
    let paquete = new Array();

    data.forEach(function (element) {
      paquete.push(element.medida);
    });

    let total = paquete.length;

    console.log("El total de datos sensor 1 es: " + total);
  });
});
// Se establece el puerto y la dirección IP para el protocolo UDP
enchufe_udp.bind("2001", "192.168.1.3");

// Escucha mediante protocolo Serial
const Readline = SerialPort.parsers.Readline;
// Se establece el puerto
const port = new SerialPort("COM4");
const parser = new Readline();
port.pipe(parser);

// Escucha mediante protocolo Serial
parser.on("data", (data) => {
  console.log("sensor arduino: " + data);

  io.emit("sensor_arduino", data);

  // Guardamos el dato recibido del sensor Serial (arduino) en la base de datos MongoDB
  Sensor3.collection.insertOne({ medida: data }, function (err, res) {
    if (err) throw err;
  });

  //   // Buscamos en la base de datos los datos guardados en la colección para mostrar la cantidad total de datos
  Sensor3.find(function (err, data) {
    if (err) {
      return console.log(err);
    } else if (data === null) {
      console.log("no hay datos");
    }
    let paquete = new Array();

    data.forEach(function (element) {
      paquete.push(element.medida);
    });

    let total = paquete.length;
    console.log("El total de datos sensor arduino es: " + total);
  });
});
// Mensaje para saber que estamos conectados
port.write("arduino conectado\n");
