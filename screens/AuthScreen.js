import {StatusBar} from 'expo-status-bar';
import React, { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import { Container, Header, Content, Button, Text } from 'native-base';
import constants from '../constants/constants';

import { AuthContext } from '../services/context';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: constants.authorizationEndpoint(),
    tokenEndpoint: constants.tokenEndpoint(),
    revocationEndpoint: constants.revocationEndpoint()
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

    const handleSignup = async () => {

        try {
            promptAsync()
            .then((res) => {
                const grantType = "client_credentials";
                const { id, secret, redirect } = res.params.callback.client;

                return {
                    grant_type: grantType,
                    id,
                    secret,
                    redirect
                }
            })
            .then(async (data) => {
                try {
                    if (data.secret){
                        let resp = await fetch(discovery.tokenEndpoint, {
                            method: 'POST',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                grant_type: data.grant_type,
                                client_id: data.id,
                                client_secret: data.secret,
                                redirect_uri: data.redirect
                            }),
                        });

                        resp = await resp.json();
                        const { token_type, expires_in, access_token } = resp;
                        const { grant_type, id, secret, redirect } = data
                        const User = {
                            grant_type,
                            client_id: id,
                            client_secret: secret,
                            redirect_uri: redirect,
                            token_type,
                            expires_in,
                            access_token,
                        }
                        //console.log( User );
                        signIn( User );
                    }
                }
                catch (e) {
                    console.error(e);
                }
            })
            .catch((err) => console.log(err));
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
