import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import constants from '../constants/constants';

const SocketService = {

    echo: null,
    SetConnection( userData ) {
        try {
            const channel = `App.Models.User.${userData.user.id}`;

            echo = new Echo({
                broadcaster: 'socket.io',
                client: socketio,
                authEndpoint: constants.echoServer +  '/broadcasting/auth',
                host: constants.echoServer + ':' + constants.echoServerPort,
                auth: {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${userData.access_token}`,
                    }
                },
                reconnectionAttempts: 3,
                // transports: ['websocket'],  
                // forceNew: true
            });

            echo
                .private(channel)
                .notification((notification) => {
                    const notification_type = notification.type;

                    console.log("NEW MESSAGE", notification);

                    if (notification_type.includes("MessageCreated")) {
                        // await dispatch({ type: 'ADD_THREAD', action: notification})
                        // await dispatch({ type: 'ADD_MESSAGES', action: notification})

                    }

                });

            console.log('Join "online" channel');
            echo.join('online')
                .here(users => {
                    // if(users.find(data => data.id === params.user.id)) {
                    //     // setState({
                    //     //     icon: ICONS.online,
                    //     //     color: COLORS.online
                    //     // });
                    // }
                });

            echo.connector.socket.on('connect', function(){
                console.log('Socket connected', echo.socketId());
            });

            echo.connector.socket.on('connect_timeout', (timeout) => {
                console.log('Connection timeout', timeout);
            });

            echo.connector.socket.on('connect_error', (error) => {
                console.log('Connection error', error);
            });

            echo.connector.socket.on('subscription_error', (channel, data) => {
                console.log('Channel subscription error: ' + channel, data);
            });

            echo.connector.socket.on('disconnect', function(reason){
                console.log("Disconnection reason", reason);
                if (reason === 'io server disconnect') {
                    // the disconnection was initiated by the server, you need to reconnect manually
                    echo.connector.socket.connect();
                }
                // else the socket will automatically try to reconnect
                console.log('Socket disconnected');
            });
            
            echo.connector.socket.on('reconnecting', function(attemptNumber){
                console.log('Socket reconnecting', attemptNumber);
            });

            echo.connector.socket.on('reconnected', () => {
                console.log('Socket reconnected',  echo.socketId());
            });

            echo.connector.socket.on('reconnect_failed', () => {
                //Fired when the client couldn’t reconnect within reconnectionAttempts.
                console.log('Socket reconnection failed. Trying again...');
                echo.connector.socket.connect();
            });
            

        } catch (error) {
            throw error.message;
        }
    },
    GetConnectionStatus(){
        try {
            return echo.connector.socket.connected;
        } catch (error) {
            console.log('GetConnectionStatus ERROR =>', error.message)
        }
        return false;
    }
};

export default SocketService; 


