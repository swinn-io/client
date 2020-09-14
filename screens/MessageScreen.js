import React, { useState, useEffect } from 'react';
import { Container, Text, Content, Form, Item, Input, Left, Right, 
    Button, Icon, List, ListItem, 
    Thumbnail, Body, Footer, Fab}  from 'native-base';
import { StyleSheet } from 'react-native'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import { CustomHeader } from '../components/common'

export default function MessageScreen (props) {

    const { messageId, messageTitle } = props.route.params
    const [newMessage, setNewMessage] = useState("")
    const [messageHistory, setMessageHistory] = useState([])

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
            let messageHistory = await fetchJson.GET(constants.getSingleMessage(messageId));
            setMessageHistory(messageHistory.data.attributes.messages);
        } catch (error) {
            console.log("Message Retrieve Error:", error)
        }

    }

    const handleNewMessage = async () => {

        try {
            //await fetchJson.POST(constants.getSingleMessage(messageId));
            
            setNewMessage("");
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
                    <Thumbnail source={{ uri: 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png' }} />
                </Left>
                <Body>
                    <Text>{JSON.stringify(message.attributes.body)}</Text>
                    {/* <Text note>{message.attributes.body[1]}</Text> */}
                </Body>
            </ListItem>
        );
      }

    return (
        <Container>
            <CustomHeader isSub={true} messageTitle={messageTitle} props={props}/>
            <List
                dataArray={messageHistory}
                keyExtractor={messageHistory => messageHistory.id}
                renderRow={(message)=>renderRow(message)}
            >
            </List>
            {/* <Footer style={styles.bottom}>
                <Item>
                    <Input
                        placeholder='Write a message'
                        onChangeText={text => setNewMessage(text)}
                        value={newMessage}
                    />
                    <Button
                        onPress={handleNewMessage}
                    >
                        <Icon name='send' />
                    </Button>
                </Item>
            </Footer> */}
            <Fab
                active={true}
                direction="up"
                containerStyle={{ }}
                style={{ backgroundColor: '#5067FF' }}
                position="bottomRight"
                onPress={()=> {
                    props.navigation.navigate("NewMessage", {
                        messageId: messageId,
                    });
                }}
                // onPress={() => this.setState({ active: !this.state.active })}
                >
                <Icon name="add" />
                {/* //If more screen is needed */}
                {/* <Button style={{ backgroundColor: '#34A34F' }}>
                <Icon name="logo-whatsapp" />
                </Button>
                <Button style={{ backgroundColor: '#3B5998' }}>
                <Icon name="logo-facebook" />
                </Button>
                <Button disabled style={{ backgroundColor: '#DD5144' }}>
                <Icon name="mail" />
                </Button> */}
            </Fab>
        </Container>
    );  
       
}


const styles = StyleSheet.create({
    bottom: {
        width: '100%', 
        justifyContent: 'center', 
        alignItems: 'center',
    }
  })
