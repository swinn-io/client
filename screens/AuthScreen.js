import {StatusBar} from 'expo-status-bar';
import React, { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import { StyleSheet, View} from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Badge, Icon } from 'native-base';
import deviceStorage from '../services/deviceStorage';


import { AuthContext } from '../services/context';

WebBrowser.maybeCompleteAuthSession();


// Endpoint
const discovery = {
    authorizationEndpoint: 'http://192.168.1.103/login',
    tokenEndpoint: 'http://192.168.1.103/oauth/token',
    revocationEndpoint: 'http://192.168.1.103/oauth/revoke',
};

export default function AuthScreen() {

    const [request, response, promptAsync] = useAuthRequest(
        {
            clientId: '',
            scopes: [],
            redirectUri: makeRedirectUri({
                native: 'exp://redirect',
                useProxy: false
            }),
        },
        discovery
    );

    const { signIn } = React.useContext(AuthContext);

    React.useEffect(() => {
        if(response !== null) {
            if (response?.type === 'success') {
                const {code} = response.params;
            }
        }
    }, [response]);


    const handleLogin = async () => {
        //SignIn comes from App.js Context
        signIn();
    }

    return (
        <View style={styles.container}>
            <Text>Ping Pong Application</Text>
            <Button 
                style={{alignSelf:'center'}}
                onPress={handleLogin}
            >
                <Text>Login</Text>
            </Button>
            <Button
                disabled={!request}
                title="Login"
                onPress={() => {
                    promptAsync().then((r) => console.log(r));
                }}
            />
            {response && <Text>Hello {response.params.callback.name}!</Text>}
            <StatusBar style="auto"/>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
