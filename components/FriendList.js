import {StatusBar} from 'expo-status-bar';
import React from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import { StyleSheet, View} from 'react-native';
import { Container, Header, Title, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Badge, Icon } from 'native-base';
import FriendListItem from './FriendListItem';

export default function FriendList() {

    return (
        <Container>
            <Header>
                <Left/>
                <Body>
                    <Title>Ping Pong</Title>
                </Body>
                <Right>
                    <Button light>
                        <Icon name='ios-add-circle'/>
                        {/* <Text>Back</Text> */}
                    </Button>
                </Right>
            </Header>
            <Content>
            <List>
                <FriendListItem 
                    name="Baris"
                    notifications="1"
                    uri="https://cdn3.volusion.com/bvsxz.mbkne/v/vspfiles/photos/DB-663-WOOF-B-2T.jpg?v-cache=1565573525"
                    >

                </FriendListItem>
                <FriendListItem
                    name="Burak"
                    notifications="2"
                    uri="https://cdn3.volusion.com/bvsxz.mbkne/v/vspfiles/photos/DB-663-WOOF-B-2T.jpg?v-cache=1565573525"
                    >
                    
                </FriendListItem>
            </List>
            </Content>
        </Container>
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
