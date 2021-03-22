import React, { useState, useEffect, useContext } from 'react';
import { Container, Content, Button, Text, List, ListItem,
    Left, Right, Icon, Thumbnail, 
    Body, Spinner, Fab, View }  from 'native-base';
import { CustomHeader } from '../components/common'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

import { MessageContext } from '../services/store/messageStore';
import { EchoContext } from '../services/store/echoStore';
import { AuthContext } from '../services/store/authStore';

import { isEmpty } from '../services/helperFunctions';

export default function HomeScreen (props) {

    const [error, setError] = useState(false)
    const [messageState, dispatch] = useContext(MessageContext)
    const [userState] = useContext(AuthContext);
    const [echoState] = useContext(EchoContext);

    const [active, setActive] = useState(true)

    useEffect(() => {
        fetchMessages();
    }, [])

    useEffect(() => {
        // console.log("MESSAGE STATE THREADS: ", messageState.threads);
    }, [messageState])

    useEffect(() => {
        const channel = `App.Models.User.${userState.user.id}`;
        echoState
            .private(channel)
            .notification((notification) => {
                handleNewMessage(notification);
            });

        console.log('Join "online" channel');

        return () => {
            echoState.leave(channel);
            console.log("Leaving channel:", channel)
        }
    }, [])

    const refreshPage = () => {
        //If refresh is needed
        fetchMessages()
    }

    const handleNewMessage = async (notification) => {
        try {
            const notification_type = notification.type;
            console.log("-----NEW NOTIFICATION-----", notification);
            if (notification_type.includes("MessageCreated")) {
                await dispatch({ type: 'ADD_MESSAGES', data: notification.payload})
            }
            else if (notification_type.includes("ThreadCreated")){
                await dispatch({ type: 'ADD_THREAD', data: notification.payload})
            }
        } catch (e) {
           console.log("Error", e);
        }
    }

    const renderRow = (thread) => {
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
                msg.push({
                    thread_id: thread.id,
                    subject: thread.attributes.subject,
                    thread_attributes: thread.attributes
                });
            })
            if(threads.length > 0){
                await dispatch({type: 'SET_THREADS', payload: msg});
            }
            else {
                setError("You don't have any messages yet");
            }
        } catch (error) {
            console.log("Custom Warning - Home Screen:", error.message)
            setError(error.message);
        }
    }

    const createNewThread = async () => {
        try {
            setActive(!active)
            setError(false)
            props.navigation.navigate("NewThread", {
                threadTitle: "Create new thread",
            });
        }
        catch (error) {
            console.log("Error Home Screen - Create New Thread", error);
        }
    }

    return (
        <Container>
            <CustomHeader props={props}/>
            {messageState.threads.length >0 ?
                <Container>
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
                    <Fab
                    active={active}
                    direction="up"
                    containerStyle={{}}
                    style={{backgroundColor: '#5067FF'}}
                    position="bottomRight"
                    onPress={() => createNewThread()}
                >
                    <Icon name="add"/>
                </Fab>
                </Container>
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
