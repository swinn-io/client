import React, { useEffect, useContext } from 'react';
import {Button} from "native-base";
import { AuthContext } from '../services/authStore';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { MessageContext } from '../services/messageStore';

import { GetEcho } from '../services/socketService';

const ICONS = {
    online: 'satellite-dish',
    offline: 'plug'
}
const COLORS = {
    online: 'green',
    offline: 'red'
}


export default function EchoServer(props){

    const { getUser } = React.useContext(AuthContext);
    const [messageState, dispatch] = useContext(MessageContext)

    const [state, setState] = React.useState({
        user: null,
        isConnected: false,
        status: 1,
        icon: ICONS.offline,
        color: COLORS.offline,
        echo: null,
        channel: null
    });

    const handleUser = async () => {
        try {
            if(!state.user){
                await getUser().then(user => {
                    setState({
                        ...state,
                        user: user
                     });
                }).catch(error => console.log(error));
            }
        } catch (e) {
           console.log("Error", e);
        }
    }

    const handleEcho = async () => {
        try {
            const echo = GetEcho(state.user)

            const channel = `App.Models.User.${state.user.user.id}`;
            
            setState({
                ...state,
                echo: echo,
                channel: channel,
                icon: ICONS.online,
                color: COLORS.online
            })

            state.echo
                .private(channel)
                .notification((notification) => {
                    handleNewMessage(notification);
                });

            console.log('Join "online" channel');

            
            // state.echo.connector.socket.on('connect', function(){
            //     console.log('Socket connected to: ', state.echo.socketId());
            // });

            // state.echo.connector.socket.on('disconnect', function(reason){
            //     console.log("Disconnection reason", reason);
            //     if (reason === 'io server disconnect') {
            //         // the disconnection was initiated by the server, you need to reconnect manually
            //         state.echo.connector.socket.connect();
            //     }
            //     // else the socket will automatically try to reconnect
            //     console.log('Socket disconnected');
            // });

            

        } catch (error) {
            console.log(`Echo Server Handle Echo Error: ${error.message}`)
        }
    }


    const handleNewMessage = async (notification) => {
        try {
            const notification_type = notification.type;
            console.log("-----NEW NOTIFICATION-----", notification);
            if (notification_type.includes("MessageCreated")) {
                // await dispatch({ type: 'ADD_MESSAGES', action: notification})
            }
            else if (notification_type.includes("Thread")){
                await dispatch({ type: 'ADD_THREAD', action: notification})
            }
        } catch (e) {
           console.log("Error", e);
        }
    }

    useEffect(() => {
        handleUser();
    }, []);

    useEffect(() => {

        console.log("USE EFFECT CALLED");
        handleEcho();

        if(state.user && state.echo){
            return () => {
                state.echo.leave(state.channel);
                console.log("Leaving channel:", state.channel)

                // state.echo.connector.socket.off('connect');
                // state.echo.connector.socket.off('disconnect');

                // console.log("Socket unsubscribed from connect and disconnect events");
            }
        }
     }, [state.user, state.echo]);


    return (
        <Button transparent>
            <FontAwesome5 name={state.icon} style={{
                fontSize:20, 
                color: state.color
            }} />
        </Button>
      );
}
