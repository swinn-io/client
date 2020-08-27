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
    authorizationEndpoint: 'http://192.168.1.107/login',
    tokenEndpoint: 'http://192.168.1.107/oauth/token',
    revocationEndpoint: 'http://192.168.1.107/oauth/revoke',
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
        try {
            if(response !== null) {
                if (response?.type === 'success') {
                    const {code} = response.params;
                }
                else {
                    console.log("Unsuccessful login");
                }
            }
            else {
                console.log("Null response");
            }
        } catch (error) {
            console.log("Response error:", error);
        }
    }, [response]);


    const handleLogin = async () => {
        //SignIn comes from App.js Context
        try {
            promptAsync()
            .then((r) => {
                const User = {
                    name: r.params.callback.name,
                    token: r.params.callback.client.secret
                }
                signIn( User.token );
            })
            .catch((err) => console.log(err));
        } catch (error) {
            console.log("Handle Login Error", error);
        }
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
