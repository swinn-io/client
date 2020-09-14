import {StatusBar} from 'expo-status-bar';
import React, { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import { StyleSheet, View} from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon } from 'native-base';

export default function FriendListItem(props) {

    const [name, setName] = useState(props.name);
    const [notifications, setNotifications] = useState(props.notifications);
    const [uri, setUri] = useState(props.uri);

    return (
        <ListItem avatar>
            <Left>
                <Thumbnail source={{ uri: props.uri }} />
            </Left>
            <Body>
                <Text>{props.name}</Text>
                <Text note></Text>
                <Text note></Text>
            </Body>
            <Right>
            <Button active>
              <Icon active name="navigate" />
            </Button>
            </Right>
        </ListItem>
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
