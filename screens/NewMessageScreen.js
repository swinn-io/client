import React, { useState, useEffect } from 'react';
import { Container, Text, Content, Form, Item, Input, Left, Right, Button, Icon, List, ListItem, Thumbnail, Body, Footer}  from 'native-base';
import { StyleSheet } from 'react-native'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import { CustomHeader } from '../components/common'

export default function NewMessageScreen (props) {

    const { messageId } = props.route.params
    const [newMessage, setNewMessage] = useState({})

    const handleNewMessage = async () => {


        try {
            //await fetchJson.POST(newMessage, constants.createNewMessage(messageId));
            //console.log("newMessage", newMessage)
            //console.log("MESSAGE ID", messageId)
            // console.log("New Message Send Handle");
            // console.log("newMessage", newMessage);


        } catch (error) {
            console.log("Message Retrieve Error:", error)
        }

    }

    const items = [{ name: "Subject" }, { name: "Content1" }, { name: "Content2" }];
    const handleTextChange = (text, name) => {

      setNewMessage({
        ...newMessage,
        [name]: text
      })

    }


    return (
        <Container>
          <CustomHeader isSub={true} props={props}/>
          <Content>
            <Form>
              {items.map((item, index) => (
                  <Item>
                    <Input
                    key={index}
                    name={item.name}
                    placeholder={item.name}
                    onChangeText={(text) => handleTextChange(text, item.name)}
                    value={newMessage[item.name]}
                  />
                  </Item>
              ))}
              <Item>
                <Button primary style={{alignSelf: 'flex-start', width: '95%'}}
                          onPress={handleNewMessage}
                      >
                        <Text>Send</Text>
                        <Icon name='send' />
                </Button>
              </Item>
            </Form>
          </Content>
        </Container>
      );
       
}
