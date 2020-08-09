import {StatusBar} from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ActionSheet, Body, Button, Container, Header, Icon, Left, Right, Root, Tab, TabHeading, Tabs, Title, ScrollableTab, Subtitle } from 'native-base';
import LoginTab from "./tabs/LoginTab";
import PingedTab from "./tabs/PingedTab";
import ScanTab from "./tabs/ScanTab";
import ProfileTab from "./tabs/ProfileTab";

import deviceStorage from "./services/deviceStorage";
import constants from "./services/constants";

export default function App() {

    const [usertoken, setUsertoken] = useState(deviceStorage.getToken(constants.access_token));

    const login = async ( value ) => {
        await deviceStorage.setToken(constants.access_token, value);
        setUsertoken( value );
        console.log("Login Token => ", await deviceStorage.getToken(constants.access_token));
    }
    const getToken = async () => {
        console.log("Current Token => ", await deviceStorage.getToken(constants.access_token));
        return await deviceStorage.getToken(constants.access_token);
    }
    const logout = async () => {
        deviceStorage.removeToken(constants.access_token);
        setUsertoken( null );
        console.log("Logout Token => ", await deviceStorage.getToken(constants.access_token));
    }

    let BUTTONS = ["Settings", "Profile", "Mark as seen", "Cancel"];
    let DESTRUCTIVE_INDEX = 2;
    let CANCEL_INDEX = 3;

    return (
        <Container>
            <Root>
                <Header hasTabs>
                    <Left>

                    </Left>
                    <Body>
                        <Title>Ping Pong</Title>
                        {usertoken && <Subtitle>Last Ping 4 min.</Subtitle>}
                    </Body>
                    {   usertoken &&
                        <Right>
                            <Button transparent onPress={() =>
                                ActionSheet.show(
                                    {
                                        options: BUTTONS,
                                        cancelButtonIndex: CANCEL_INDEX,
                                        destructiveButtonIndex: DESTRUCTIVE_INDEX,
                                        title: "More Actions"
                                    },
                                    async buttonIndex => {
                                        switch (buttonIndex) {
                                            case 0:

                                                break;
                                            case 1:

                                                break;
                                            case 2:

                                                break;
                                            case 3:

                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                )}
                            >
                                <Icon name='dots-horizontal' type="MaterialCommunityIcons" style={styles.more} />
                            </Button>
                        </Right>
                    }
                    {
                        !usertoken && 
                        <Right></Right>
                    }
                </Header>
                { 
                    usertoken && 
                    <Tabs renderTabBar={()=> <ScrollableTab />}>
                        <Tab heading={ <TabHeading><Icon name="signal-cellular-2" type="MaterialCommunityIcons" /></TabHeading> }>
                            <PingedTab getToken={() => getToken()}/>
                        </Tab>
                        <Tab heading={ <TabHeading><Icon name="qrcode-scan" type="MaterialCommunityIcons" /></TabHeading> }>
                            <ScanTab getToken={() => getToken()}/>
                        </Tab>
                        <Tab heading={ <TabHeading><Icon name="account-circle" type="MaterialCommunityIcons" /></TabHeading> }>
                            <ProfileTab getToken={() => getToken()} logout={() => logout()}/>
                        </Tab>
                    </Tabs>
                }
                { 
                    !usertoken && 
                    <Tabs renderTabBar={()=> <ScrollableTab />}>
                        <Tab heading={ <TabHeading><Icon name="login" type="MaterialCommunityIcons" /></TabHeading> }>
                            <LoginTab login={(token) => login(token)}/>
                        </Tab>
                    </Tabs>
                }
                <StatusBar style="dark"/>
            </Root>
        </Container>
    );
}

const styles = StyleSheet.create({
    more: {
        color: 'black'
    },
    sos: {
        color: 'red'
    }
});
