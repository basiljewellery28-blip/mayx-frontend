import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Adjust if your backend runs on a different port

let socket;

export const initSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            transports: ['websocket'],
            withCredentials: true,
        });

        socket.on('connect', () => {

        });

        socket.on('disconnect', () => {

        });
    }
    return socket;
};

export const getSocket = () => {
    if (!socket) {
        return initSocket();
    }
    return socket;
};

export const joinBriefRoom = (briefId) => {
    if (socket) {
        socket.emit('join_brief', briefId);
    }
};

export const leaveBriefRoom = (briefId) => {
    if (socket) {
        socket.emit('leave_brief', briefId);
    }
};
