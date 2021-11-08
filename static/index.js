function tiempo_real() {
  moment().format();
  var socket = io();

  // Se escucha mediante Websocket el evento "sensor_temperatura"
  socket.on("data_rpc", function (data) {
    // Se genera el manómetro de Google Charts
    google.charts.load("current", { packages: ["gauge"] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      // Rellena los datos con la data recibida desde el sensor tcp
      var datosRecibidos = google.visualization.arrayToDataTable([
        ["Label", "Value"],
        ["Presión", parseInt(data)],
      ]);
      // Configuración de parámetros para estilos y rangos del manómetro
      var options = {
        width: 380,
        height: 400,
        redFrom: 750,
        redTo: 1000,
        yellowFrom: 400,
        yellowTo: 750,
        greenFrom: 0,
        greenTo: 400,
        minorTicks: 5,
        max: 1000,
        min: 0,
        animation: {
          duration: 250,
          easing: "ease",
        },
      };
      var chart = new google.visualization.Gauge(
        document.getElementById("temperatura")
      );
      // Redibuja el manómetro al actualizar la data
      chart.draw(datosRecibidos, options);
    }
  });

  // Se escucha mediante Websocket el evento "sensor_calidad"
  socket.on("sensor_calidad", function (data) {
    // Se genera el tubo de ensayo en el DOM
    var tube = document.getElementsByClassName("tube")[0];
    tube.style.setProperty("--tube-percentage", data + "%");
    tube.style.setProperty("--tube-title", `"${data}%"`);

    // Lógica para cambiar el color del tubo de ensayo dependiendo del nivel de calidad que envia el sensor
    if (data > 0 && data < 50) {
      tube.style.setProperty("--tube-color", "#DE3516");
    } else if (data > 50 && data <= 80) {
      tube.style.setProperty("--tube-color", "#049DD9");
    } else if (data > 80 && data <= 100) {
      tube.style.setProperty("--tube-color", "#9DDE16");
    }
  });

  // Tooltip - Box que aparece al pasar por cada punto del gráfico
  const footer = (tooltipItems) => {
    let sum = 0;
    tooltipItems.forEach(function (tooltipItem) {
      sum += tooltipItem.parsed.y;
    });
    return `$1 PEN = $${sum} CLP`;
  };

  // Se genera el gráfico de linea en el DOM
  const ctx = document.getElementById("myChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Valor de Moneda PEN",
          data: [],
          backgroundColor: ["rgba(255, 99, 132, 0.2)"],
          borderColor: ["rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
      plugins: {
        interaction: {
          intersect: false,
          mode: "index",
        },
        legend: {
          position: "top",
        },
        tooltip: {
          callbacks: {
            footer: footer,
          },
        },
      },
    },
  });
  // Se escucha mediante Websocket el evento "sensor_arduino"
  socket.on("sensor_arduino", function (datos) {
    // Se genera una nueva fecha para mostrarla en el eje Y
    currentDate = new Date();

    const data = myChart.data;

    // Si existe una serie de datos entonces:
    if (data.datasets.length > 0) {
      // Genera el eje x con la hora actual de la máquina y va añadiendolo a la serie de datos
      // Gracias a MomentJS se puede obtener el formato de la fecha
      data.labels.push(moment(currentDate).format("LTS"));

      // Va añadiendo los datos recibidos del arduino en el eje y
      data.datasets[0].data.push(parseInt(datos));

      // Si ya hay 10 datos en la serie de datos, va eliminando el primer dato del arreglo para que ingrese uno nuevo, con el fin de que no se sature el gráfico y sea legible
      if (data.datasets[0].data.length >= 10) {
        data.labels.shift();
        data.datasets[0].data.shift();
      }
      // Actualiza el gráfico
      myChart.update();
    }
  });

  socket.on("data_rpc", function (data) {
    console.log("datos rpc", data);
  });
}
