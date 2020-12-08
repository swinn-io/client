import React, { useState, useEffect } from 'react';
import { Container, Text, Content, Form, Item, 
  Input, Left, Right, Button, Icon, List,
   ListItem, Thumbnail, Body, Footer, InputGroup, Picker}  from 'native-base';
import { StyleSheet } from 'react-native'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import { CustomHeader } from '../components/common'
import ContactList from '../components/ContactList';

export default function NewThreadScreen (props) {

    const { threadTitle } = props.route.params
    console.log("TITLE", threadTitle)
    const [newThread, setNewThread] = useState({})
    const [pageError, setPageError] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])

    useEffect(() => {
      console.log("Selected Users Changed => ", selectedUsers)
  }, [selectedUsers])

    const handleNewThread = async () => {
        try {
          //Convert content to array
          newThread.content = [newThread.content];
          newThread.recipients = selectedUsers;
          const response = await fetchJson.POST(newThread, constants.createNewThread());
          
          console.log("RESPONSE => ", response)
          // //Go back to home page
          
          // console.log("NEW THREAD => ", newThread)
          setNewThread({});
          props.navigation.goBack()



        } catch (error) {
            console.log("Message Retrieve Error:", error)
            console.log(error.message);
            setPageError(error.message);
        }

    }

    const handleTextChange = (text, name) => {

      setNewThread({
        ...newThread,
        [name]: text
      })

    }

    return (
        <Container>
          <CustomHeader isSub={true} threadTitle={threadTitle} props={props}/>
          <Content>
            <Form>
              <Item>
                <Input 
                  placeholder="Subject" 
                  name="subject"
                  onChangeText={(text) => handleTextChange(text, "subject")}
                  value={newThread["subject"]}
                  />
              </Item>
              <Item>
                <Input 
                  placeholder="Content" 
                  name="content"
                  onChangeText={(text) => handleTextChange(text, "content")}
                  value={newThread["content"]}
                />
              </Item>
              <Item picker>
                <ContactList users={selectedUsers} addSelectedUser={setSelectedUsers}>

                </ContactList>
              </Item>
              <Item>
                <Button primary style={{alignSelf: 'flex-start', width: '95%'}}
                          onPress={handleNewThread}
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
