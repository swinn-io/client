import {StatusBar} from 'expo-status-bar';
import React, { Component, useContext, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import { Container, Header, Content, Button, Text } from 'native-base';
import constants from '../constants/constants';

import { AuthContext } from '../services/store/authStore';
import { SignIn } from '../services/userService';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: constants.authorizationEndpoint(),
    tokenEndpoint: constants.tokenEndpoint(),
    revocationEndpoint: constants.revocationEndpoint()
};

export default function AuthScreen() {

    const [request, response, promptAsync] = useAuthRequest(
        {
            scopes: ['*'],
            redirectUri: makeRedirectUri(),
        },
        discovery
    );

    const auth_context = useContext(AuthContext);
    const setUser = auth_context[1];

    useEffect(() => {
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

    const handleSignup = async () => {

        try {
            promptAsync()
            .then((res) => {
                try {
                    let user = res.params;
                    if (user.access_token){
                        console.log('Logged in.');
                        SignIn( user );
                        setUser(user);
                    }
                }
                catch (e) {
                    console.error(e);
                }
            })
        } catch (error) {
            console.log("Handle Login Error", error);
        }
    }

    return (
        <Container>
            <Content contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
                <Button
                    style={{alignSelf:'center'}}
                    onPress={handleSignup}
                >
                    <Text>Login</Text>
                </Button>
            </Content>
            <StatusBar style="auto"/>
        </Container>
    );

}
