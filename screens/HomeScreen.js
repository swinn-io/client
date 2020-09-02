import React, { useState, useEffect } from 'react';
import { Container, Content, Button, Text, List, ListItem, Left, Right, Icon, Thumbnail, Body, Spinner }  from 'native-base';
import { AuthContext } from '../services/context';
import { CustomHeader } from '../components/common'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

export default function HomeScreen (props) {

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        getMessages()
    }, [])

    const renderRow = (message) => {

        console.log("MESSAGE-----------", message);

        return (
            <ListItem thumbnail
                onPress={() => {
                    props.navigation.navigate("Message", {
                        messageId: message.id,
                        messageTitle: message.subject
                    });
                }}
            >
                <Left>
                    <Thumbnail source={{ uri: 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png' }} />
                </Left>
                <Body>
                    <Text>{message.subject}</Text>
                    <Text note numberOfLines={1}>Chat text</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Icon numberOfLines={1} name="arrow-forward" />
                    </Button>
                </Right>
            </ListItem>
        );
      }

    const getMessages = async () => {
        try {
            let messages = await fetchJson.GET(constants.getAllMessages());

            let msg = [];
            let threads = messages.data;
            threads.forEach ((thread) => {
                msg.push({
                    id: thread.id,
                    subject: thread.attributes.subject
                });
            })
            setMessages(msg);
        } catch (error) {
            console.log("HomeScreen GetMessages Error", error);
        }
    }
    
    if (messages.length > 0){
        return (
            <Container>
                <CustomHeader/>
                <List
                    dataArray={messages}
                    keyExtractor={message => message.id}
                    renderRow={(message)=>renderRow(message)}>
                </List>
            </Container>
        );
    }
    else {
        return (
            <Container>
                <CustomHeader/>
                <Content contentContainerStyle={{
                    flex: 1,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center'
                    }}>
                        {/* <Text>You don't have any messages yet!</Text> */}
                        <Spinner/>
                </Content>
            </Container>
        );  
    }
       
}
