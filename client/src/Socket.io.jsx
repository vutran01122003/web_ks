import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import GLOBALTYPES from './redux/actions/globalTypes';

function SocketIO({ auth }) {
    const URL = 'http://localhost:4000';
    const socket = io(URL);
    const dispatch = useDispatch();

    useEffect(() => {
        if (socket) {
            function onConnect() {
                dispatch({
                    type: GLOBALTYPES.SOCKET.SET_SOCKET,
                    payload: {
                        socket: socket
                    }
                });
            }

            socket.emit('handshake', {
                userId: auth.user._id
            });

            socket.on('connect', onConnect);

            return () => {
                socket.off('connect', onConnect);
            };
        }
    }, [socket, dispatch]);

    // notify
    useEffect(() => {
        if (socket) {
            const handleNotification = (data) => {
                dispatch({
                    type: GLOBALTYPES.NOTIFICATION.ADD_NOTIFICATION,
                    payload: {
                        notification: data
                    }
                });
            };

            socket.on('notify', handleNotification);

            return () => {
                socket.off('notify', handleNotification);
            };
        }
    }, [socket, dispatch]);
}

export default SocketIO;
