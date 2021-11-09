#aplicación servidor XMLRPC 
from xmlrpc.server import SimpleXMLRPCServer

# Función para amplificar los datos recibidos desde el middleware
def amplificar(data):
    return data * 10

def main():
    print('servidor RPC')   
    # Creamos la instancia para el servidor
    server = SimpleXMLRPCServer(( '192.168.1.3', 5000 ))

    # Registramos la función "amplificar" para que pueda ser utilizada por otras plataformas mediante protocolo RPC
    server.register_function(amplificar)

    # Mantiene el servidor en un bucle infinito para que reciba peticiones
    server.serve_forever()

if __name__ == '__main__':
    main()