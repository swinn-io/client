import * as React from 'react';
import Echo from 'laravel-echo';
import socketio from 'socket.io-client';
import constants from '../constants/constants';
import {Button} from "native-base";
import { AuthContext } from '../services/context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ICONS = {
    online: 'satellite-dish',
    offline: 'plug'
}
const COLORS = {
    online: 'green',
    offline: 'red'
}

class EchoServer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isConnected: false,
            status: 1,
            icon: ICONS.offline,
            color: COLORS.offline,
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
                        this.setState({
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

    render() {
        return (
            <Button transparent>
                <FontAwesome5 name={this.state.icon} style={{fontSize:20, color: this.state.color}} />
            </Button>
        )
    }
}

EchoServer.contextType = AuthContext;

export default EchoServer;
