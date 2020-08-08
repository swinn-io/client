import {StatusBar} from 'expo-status-bar';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import {StyleSheet, Text} from 'react-native';
import { Body, Button, Container, Header, Icon, Left, Right, Tab, TabHeading, Tabs, Title, ScrollableTab, Subtitle } from 'native-base';
import LoginTab from "./tabs/LoginTab";
import PingedTab from "./tabs/PingedTab";
import ScanTab from "./tabs/ScanTab";
import ProfileTab from "./tabs/ProfileTab";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
    authorizationEndpoint: 'http://192.168.1.103/login',
    tokenEndpoint: 'http://192.168.1.103/oauth/token',
    revocationEndpoint: 'http://192.168.1.103/oauth/revoke',
};

export default function App() {
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
        <Container>
            <Header hasTabs>
                <Left />
                <Body>
                    <Title>Ping Pong</Title>
                    <Subtitle>Last Ping 4 min.</Subtitle>
                </Body>
                <Right>
                    <Button transparent>
                        <Icon name='dots-horizontal' type="MaterialCommunityIcons" />
                    </Button>
                </Right>
            </Header>
            <Tabs renderTabBar={()=> <ScrollableTab />}>
                <Tab heading={ <TabHeading><Icon name="login" type="MaterialCommunityIcons" /></TabHeading> }>
                    <LoginTab />
                </Tab>
                <Tab heading={ <TabHeading><Icon name="signal-cellular-2" type="MaterialCommunityIcons" /></TabHeading> }>
                    <PingedTab />
                </Tab>
                <Tab heading={ <TabHeading><Icon name="qrcode-scan" type="MaterialCommunityIcons" /></TabHeading> }>
                    <ScanTab />
                </Tab>
                <Tab heading={ <TabHeading><Icon name="account-circle" type="MaterialCommunityIcons" /></TabHeading> }>
                    <ProfileTab />
                </Tab>
            </Tabs>
            <StatusBar style="dark"/>
        </Container>
    );
}

const styles = StyleSheet.create({

});
