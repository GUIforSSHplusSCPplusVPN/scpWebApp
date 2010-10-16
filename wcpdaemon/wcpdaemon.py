"""wcp daemon"""
import socket
import thread

class wcpdaemon(object):
    def __init__(self, port, buf):
        # Set the socket parameters
        self.port = port
        self.buf = buf
    
    def run(self):
        # Create socket and bind to address
        TCPSock = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
        TCPSock.bind(('', self.port))
        TCPSock.listen(5)
        
        while 1:
            thread.start_new_thread(self.handle, TCPSock.accept())
        # Close socket - will never reach this!
        TCPSock.close()
        
    def handle(self, conn, addr):
        # Receive messages
        count=0
        while 1:
            data = conn.recv(1024)
            if not data:
        	break
            else:
                if count == 0:
                    count += 1
                    if data == '<policy-file-request/>\0':
                        conn.send('<cross-domain-policy><allow-access-from domain="*" to-ports="*" /></cross-domain-policy>\0')
                        continue
        	print "\nReceived message '", data,"'"

def main():
    port = 7500
    buf = 1024
    wcpdaemon(port, buf).run();

if __name__ == '__main__':
    main()
