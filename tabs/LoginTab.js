import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import {Button, StyleSheet, Text, View} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
    authorizationEndpoint: 'http://192.168.1.103/login',
    tokenEndpoint: 'http://192.168.1.103/oauth/token',
    revocationEndpoint: 'http://192.168.1.103/oauth/revoke',
};

export default function LoginTab() {
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

    React.useEffect(() => {
        if(response !== null) {
            if (response?.type === 'success') {
                const {code} = response.params;
            }
        }
    }, [response]);

    return (
        <View style={styles.container}>
            <Text>Ping Pong Application</Text>
            <Button
                disabled={!request}
                title="Login"
                onPress={() => {
                    promptAsync().then((r) => console.log(r));
                }}
            />
            {response && <Text>Hello {response.params.callback.name}!</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
