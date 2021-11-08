import socket
from tkinter import *
import time
import random

enchufe_udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

def sensor():
    dato = (random.randrange(0,100))
    dato1 = str(dato)
    dato2 = dato1.encode()

    enchufe_udp.sendto(dato2, ('192.168.1.3', 2001))
    print(dato1)
    time.sleep(1)
    v.after(500, sensor())

# Creación de la ventana para activar el sensor
v = Tk()
v.geometry("100x100")
L = Label(v, text="SENSOR")
L.place(x=30, y=10)

b = Button(v, text="Activar", command=sensor)
b.place(x=30, y=50)

v.mainloop()