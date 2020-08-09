import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import {Button, StyleSheet, Text, View} from 'react-native';
import constants from '../services/constants';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
    authorizationEndpoint: constants.authorizationEndpoint,
    tokenEndpoint: constants.tokenEndpoint,
    revocationEndpoint: constants.revocationEndpoint,
};

export default function LoginTab( props ) {

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
                    props.login('abc');
                    //promptAsync().then((r) => console.log(r));
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
