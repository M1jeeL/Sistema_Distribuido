# Sistema-Distribuido
Este es un proyecto de WebSocket creado en NodeJs, creando un servidor con Express y Socket.io, el cual recibe datos desde sensores creados con NodeJs (TCP), Python (UDP) y Arduino (Serial), aplicando también el protocolo RPC.
Estos datos son guardados en una base de datos en MongoDB, utilizando el ORM mongoose para facilitar las operaciones con la base de datos.

### Para iniciar el proyecto debemos instalar los modulos de node, para esto abrir una terminal y escribir lo siguiente:

<code>npm install</code>

#### Una vez teniendo los modulos listos debemos subir el programa al arduino, en caso de no usar el arduino, en el archivo <code>middleware.js</code>se debe comentar o eliminar las conexiones del protocolo Serial, de igual esta forma no funcionaría el gráfico del html (si no usaras arduino se recomienda eliminar el gráfico del html, js y css).

### Para poder iniciar el servidor primero debemos activar el Sensor UDP con el siguiente comando:

<code>py sensorudp.py</code>

### Se nos abrirá una ventana la cual solo debemos presionar Activar y el sensor enviará datos

### Lo siguiente es iniciar el Sensor TCP con el comando:

<code>node sensor_tcp.js</code>

### Luego se debe abrir el <code>servidor_rpc.py</code> con el siguiente comando:
<code>py servidor_rpc.py</code>


### Al tener los dos sensores funcionando y el servidor rpc activado, debemos ejecutar el <code>middleware.js</code> con el siguiente comando:

<code>node middleware.js</code>

## Finalmente conectarse a la ip junto el puerto indicado en el <code>middleware.js</code> y podrás ver la aplicación funcionando

## No olvidar cambiar la ip de todos los sensores y middleware, para ejecutarlo en localhost
