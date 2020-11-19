import React, { useEffect, useContext } from 'react';
import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import constants from '../constants/constants';
import {Button} from "native-base";
import { AuthContext, MessageContext } from '../services/context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ICONS = {
    online: 'satellite-dish',
    offline: 'plug'
}
const COLORS = {
    online: 'green',
    offline: 'red'
}


export default function EchoServer(props){

    const { getMessages, setNewMessages } = React.useContext(MessageContext);
    const { getUser } = React.useContext(AuthContext);

    const [state, setState] = React.useState({
        user: null,
        isConnected: false,
        status: 1,
        icon: ICONS.offline,
        color: COLORS.offline,
    });


    const handleUser = async () => {
        try {
            if(!state.user){
                await getUser().then(user => {
                    setState({ user: user });
                    listenUserChannel(user);
                }).catch(error => console.log(error));
            }
        } catch (e) {
           console.log("Error", e);
        }
    }

    const handleMessages = async () => {
        try {
            setNewMessages();
        } catch (e) {
           console.log("Error", e);
        }
    }


    useEffect(() => {
        handleUser();
        handleMessages();
      }, []);

    // const checkConnection = () => {
    //     setState({
    //         //isConnected: this.echo ? this.echo.connector.socket.connected : false
    //     });
    // }

    const listenUserChannel = (params) => {
        try{
            const channel = `App.Models.User.${params.user.id}`;

            let echo = new Echo({
                broadcaster: 'socket.io',
                client: socketio,
                authEndpoint: constants.echoServer +  '/broadcasting/auth',
                host: constants.echoServer + ':' + constants.echoServerPort,
                auth: {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${params.access_token}`,
                    }
                },
            });

            echo
                .private(channel)
                .notification((notification) => {
                    alert(notification.type);
                    console.log(notification);
                });

            console.log('Join "online" channel');
            echo.join('online')
                .here(users => {
                    if(users.find(data => data.id === params.user.id)) {
                        setState({
                            icon: ICONS.online,
                            color: COLORS.online
                        });
                    }
                });

            echo.connector.socket.on('subscription_error', (channel, data) => {
                console.log('channel subscription error: ' + channel, data);
            });
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Button transparent>
            <FontAwesome5 name={state.icon} style={{fontSize:20, color: state.color}} />
        </Button>
      );
}

//EchoServer.contextType = MessageContext;

//export default EchoServer;
