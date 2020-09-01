import React, { useState } from 'react';
import { Container, Content, Button, Text, List, ListItem }  from 'native-base';
import { AuthContext } from '../services/context';
import { CustomHeader } from '../components/common'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

export default function HomeScreen (props) {

    const { getUser } = React.useContext(AuthContext);

    const [messages, setMessages] = useState([]);


    const renderRow = (message) => {
        return (
            <ListItem
                onPress={() => {
                    console.log("ID", message.id)
                    props.navigation.navigate("Message", {
                        messageId: message.id
                    });
                }}
            >
                <Text>{message.subject}</Text>
            </ListItem>
        );
      }

    const getMessages = async () => {
        try {
            let user = await getUser();

            if (user) {
                let messages = await fetchJson.GET(user, constants.getMessage());

                let msg = [];
                let threads = messages.data;
                threads.forEach ((thread) => {
                    msg.push({
                        id: thread.id,
                        subject: thread.attributes.subject
                    });
                })
                setMessages(msg);
            }
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
                    // renderRow={renderRow.bind()}>
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
                        <Text>You don't have any messages yet!</Text>
                        <Button
                            style={{alignSelf:'center'}}
                            onPress={getMessages}
                        >
                            <Text>Get Messages</Text>
                        </Button>
                </Content>
            </Container>
        );  
    }
       
}
