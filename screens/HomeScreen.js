import React, { useState, useEffect, useContext } from 'react';
import { Container, Content, Button, Text, List, ListItem,
    Left, Right, Icon, Thumbnail, 
    Body, Spinner, Fab, View }  from 'native-base';
import { CustomHeader } from '../components/common'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

import { MessageContext } from '../services/messageStore';

export default function HomeScreen (props) {

    const [error, setError] = useState(false)
    const [messageState, dispatch] = useContext(MessageContext)

    useEffect(() => {
        fetchMessages();
    }, [])

    useEffect(() => {
        console.log("MESSAGE STATE CHANGED");
        console.log("MESSAGE STATE: ", messageState.threads);
    }, [messageState])

    const refreshPage = () => {

        //If refresh is needed
        fetchMessages()
    }

    const renderRow = (thread) => {
        // console.log("THREAD", thread)
        return (
            <ListItem thumbnail
                onPress={() => {
                    props.navigation.navigate("Message", {
                        threadId: thread.thread_id,
                        threadTitle: thread.subject,
                        // onGoBack: refreshPage()
                    });
                }}
            >
                <Left>
                    <Thumbnail source={{ uri: 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png' }} />
                </Left>
                <Body>
                    <Text>{thread.subject}</Text>
                    <Text note numberOfLines={1}>{thread.thread_id}</Text>
                </Body>
                <Right>
                    <Button transparent>
                        <Icon numberOfLines={1} name="arrow-forward" />
                    </Button>
                </Right>
            </ListItem>
        );
      }

    const fetchMessages = async () => {
        try {
            setError(false)
            let response = await fetchJson.GET(constants.getAllMessages());
            
            let msg = [];
            let threads = response.data
            threads.forEach ((thread) => {

                // console.log("THREAD", thread)
                msg.push({
                    thread_id: thread.id,
                    subject: thread.attributes.subject,
                    thread_messages: []
                });
            })

            if(threads.length > 0){
                dispatch({type: 'SET_THREADS', payload: msg});
            }
            else {
                setError("You don't have any messages yet");
            }
        } catch (error) {
            console.log("HomeScreen GetMessages Error", error.message);
            setError(error.message)
        }
    }

    return (
        <Container>
            <CustomHeader props={props}/>
            { messageState.threads.length >0?
                <List
                    dataArray={messageState.threads}
                    keyExtractor={message => message.thread_id}
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
