import React, {useState, useEffect, useContext} from 'react';
import {
    Container, Text, Content, Form, Item, Input, Left, Right,
    Button, Icon, List, ListItem,
    Thumbnail, Body, Footer, FooterTab, Fab
} from 'native-base';
import {StyleSheet} from 'react-native'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import {CustomHeader} from '../components/common'

import { MessageContext } from '../services/store/messageStore';

import { LocationComponent } from '../components/input';

export default function MessageScreen(props) {

    const {threadId, threadTitle} = props.route.params
    const [newMessage, setNewMessage] = useState("")
    const [active, setActive] = useState(false)

    const [messageState, dispatch] = useContext(MessageContext)
    useEffect(() => {
        // console.log("MESSAGE STATE CHANGED");
        // console.log("MESSAGE STATE MESSAGES: ", messageState.messages);
    }, [messageState])

    useEffect(() => {

        const parent = props.navigation.dangerouslyGetParent();

        //Hide Tab Bar
        parent.setOptions({
            tabBarVisible: false
        });

        retrieveMessage()

        //Unhide Tab Bar
        return () =>
            parent.setOptions({
                tabBarVisible: true
            });
    }, [])

    const retrieveMessage = async () => {

        try {
            console.log("ThreadId", threadId);
            const response = await fetchJson.GET(constants.getSingleMessage(threadId));
            const threadMessages = response.data.attributes.messages;

            let messages = [];
            threadMessages.forEach ((msg) => {

                // console.log("msg", msg)
                messages.push({
                    id: msg.id,
                    body: msg.attributes.body,
                    thread_id: msg.attributes.thread_id
                });
            })
            const payload = { [threadId]: messages }
            if(threadMessages.length > 0){
                dispatch({type: 'SET_MESSAGES', payload: payload});
            }
            else {
                setError("You don't have any messages yet");
            }

        } catch (error) {
            console.log("Message Retrieve Error:", error)
        }

    }

    const handleNewMessage = async () => {

        try {

            //generate random number between -100 and 100 for test purposes
            var ranNum1 = Math.ceil(Math.random() * 100) * (Math.round(Math.random()) ? 1 : -1)
            var ranNum2 = Math.ceil(Math.random() * 100) * (Math.round(Math.random()) ? 1 : -1)

            const newMessage = { body: [ranNum1, ranNum2] }

            const data = await fetchJson.POST(newMessage, constants.createNewMessage(threadId));

            try{
                await dispatch({ type: 'ADD_MESSAGES', data: data.data})
            }
            catch(err) {
                console.log("ERROR => ", err)
            }

        } catch (error) {
            console.log("Message Retrieve Error:", error)
        }
    }

    const renderRow = (message) => {

        //TO-DO parse messages

        return (
            <ListItem thumbnail
                // onPress={() => {

                // }}
            >
                <Left>
                    <Thumbnail
                        source={{uri: 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png'}}/>
                </Left>
                <Body>
                    <Text>{JSON.stringify(message.body)}</Text>
                    {/* <Text note>{message.attributes.body[1]}</Text> */}
                </Body>
            </ListItem>
        );
    }

    return (
        <Container>
            <CustomHeader isSub={true} threadTitle={threadTitle} props={props}/>
            <List
                dataArray={messageState.messages[threadId]}
                keyExtractor={message => message.id}
                renderRow={(message) => renderRow(message)}
            >
            </List>
            <Footer>
                <FooterTab>
                <Button style={{backgroundColor: '#F2786D'}}
                    onPress={handleNewMessage}
                >
                    <Icon style={{color: '#fff'}} name="cellular"/>
                    <Text style={{color: '#fff'}}>Random Numbers</Text>
                </Button>
                <LocationComponent threadId={threadId}/>
                </FooterTab>
            </Footer>
        </Container>
    );

}
