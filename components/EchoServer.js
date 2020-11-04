import * as React from 'react';
import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import constants from '../constants/constants';
import {Text, View} from "native-base";
import { AuthContext } from '../services/context';

class EchoServer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isConnected: false,
        };
    }

    componentDidMount() {
        let context = this.context;
        (async () => {
            try {
                await context.getUser().then(user => {
                    this.setState({ user: user});
                    this.listenUserChannel(user);
                }).catch(error => console.log(error));
            } catch (e) {
                console.log(e)
            }
        })();
    }

    checkConnection() {
        this.setState({
            isConnected: this.echo ? this.echo.connector.socket.connected : false
        });
    }

    listenUserChannel(params) {
        try{
            const channel = `App.Models.User.${params.user.id}`;
            console.log('Attempting to connect Echo server.');

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

            console.log(`Join "${channel}" channel`);
            echo
                .private(channel)
                .notification((notification) => {
                    alert(notification.type);
                    console.log(notification);
                });

            console.log('Join "online" channel');
            echo.join('online')
                .here(users => console.log(users))
                .joining(user => console.log(`${user.name} is joining online channel.`))
                .leaving(user => console.log(`${user.name} is leaving online channel.`));

            echo.connector.socket.on('subscription_error', (channel, data) => {
                console.log('channel subscription error: ' + channel, data);
            });
        } catch (e) {
            console.log(e)
        }
    }

    render() {
        return <View>
            <Text>{this.state.user && this.state.user.name}</Text>
        </View>
    }
}

EchoServer.contextType = AuthContext;

export default EchoServer;
