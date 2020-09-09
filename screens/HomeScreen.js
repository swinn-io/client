import React, { useState, useEffect } from 'react';
import { Container, Content, Button, Text, List, ListItem,
    Left, Right, Icon, Thumbnail, 
    Body, Spinner, Fab, View }  from 'native-base';
import { CustomHeader } from '../components/common'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

export default function HomeScreen (props) {

    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(false)
    
    useEffect(() => {
        getMessages()
    }, [])

    const refreshPage = () => {

        //If refresh is needed
        setMessages([])
        getMessages()
    }

    const renderRow = (message) => {

        return (
            <ListItem thumbnail
                onPress={() => {
                    props.navigation.navigate("Message", {
                        messageId: message.id,
                        messageTitle: message.subject,
                        onGoBack: refreshPage()
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
            setError(false)
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
            console.log("HomeScreen GetMessages Error", error.message);
            setError(error.message)
        }
    }

    return (
        <Container>
            <CustomHeader props={props}/>
            { messages.length>0?
                <List
                    dataArray={messages}
                    keyExtractor={message => message.id}
                    renderRow={(message)=>renderRow(message)}
                    // refreshControl={
                    //     <RefreshControl
                    //         onRefresh={getMessages}
                    //         refreshing={refreshing}
                    //         progressBackgroundColor={'#fff'}
                    //     />}
                >
                </List>
                :
                <Content contentContainerStyle={{
                    flex: 1,
                    backgroundColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center'
                    }}>
                        {error ? <Text> {error} </Text>:<Spinner/>}
                </Content>
            }
        </Container>
      );

       
}
