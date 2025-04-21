import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import GLOBALTYPES from './redux/actions/globalTypes';
const { VITE_APP_API_URI } = import.meta.env;
function SocketIO({ auth }) {
    const URL = VITE_APP_API_URI;
    const socket = io(URL);
    const dispatch = useDispatch();

    function onConnect() {
        dispatch({
            type: GLOBALTYPES.SOCKET.SET_SOCKET,
            payload: {
                socket: socket
            }
        });
    }

    useEffect(() => {
        if (socket) {
            socket.emit('handshake', {
                userId: auth.user._id
            });

            socket.on('connect', onConnect);

            return () => {
                socket.off('connect', onConnect);
            };
        }
    }, [socket, auth.user._id, dispatch]);

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
