import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { SOCKET_ENDPOINT } from '../utils/chatEndpoint';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth();
    const currentUserId = Number(user?.id);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!isAuthenticated || !currentUserId) {
            setSocket(null);
            return;
        }

        const newSocket = io(SOCKET_ENDPOINT, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
        });

        newSocket.on('connect', () => {
            newSocket.emit('join_room', currentUserId);
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, [isAuthenticated, currentUserId]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
