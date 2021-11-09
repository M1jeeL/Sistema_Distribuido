import socket
from tkinter import *
import time
import random

# Creamos el socket UDP
enchufe_udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

def sensor():
    # Generamos un numero aleatorio entre 0 y 100
    dato = (random.randrange(0,100))
    # Convertimos el dato a string
    dato1 = str(dato)
    # Codificamos el dato generado
    dato2 = dato1.encode()
    # Enviamos mediante protocolo UDP el dato generado codificado hacia el middleware
    enchufe_udp.sendto(dato2, ('192.168.1.3', 2001))

    print(dato1)
    time.sleep(1)

    # Loop
    v.after(500, sensor())

# Creación de la ventana para activar el sensor
v = Tk()
v.geometry("100x100")
L = Label(v, text="SENSOR")
L.place(x=30, y=10)

b = Button(v, text="Activar", command=sensor)
b.place(x=30, y=50)

v.mainloop()