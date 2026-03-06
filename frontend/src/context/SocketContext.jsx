import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children, serverUrl, userId }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId || socketRef.current) return;

    // Initialize socket connection
    const socketInstance = io(serverUrl, { withCredentials: true });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to socket server with id:', socketInstance.id);
      setIsConnected(true);
      if (userId) {
        socketInstance.emit('identity', { userId });
        console.log('📍 Identity emitted for user:', userId);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
      setIsConnected(false);
    });

    socketRef.current = socketInstance;

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, serverUrl]);

  const value = {
    socket: socketRef.current,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
