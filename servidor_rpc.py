#aplicación servidor XMLRPC 
from xmlrpc.server import SimpleXMLRPCServer

# Función para amplificar los datos recibidos desde el middleware
def amplificar(data):
    return data * 10

def main():
    print('servidor RPC')
    server = SimpleXMLRPCServer(( '192.168.1.3', 5000 ))
    # Regresamos mediante protocolo RPC el resultado de la función
    server.register_function(amplificar)
    server.serve_forever()

if __name__ == '__main__':
    main()