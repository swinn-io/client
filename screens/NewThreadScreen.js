import React, { useState, useEffect } from 'react';
import { Container, Text, Content, Form, Item, 
  Input, Left, Right, Button, Icon, List,
   ListItem, Thumbnail, Body, Footer, InputGroup, Picker, View}  from 'native-base';
import { StyleSheet, Modal } from 'react-native'

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
    const [modalVisibility, setModalVisibility] = useState(false)
    const [names, setNames] = useState()

    useEffect(() => {
      console.log("Selected Users Changed => ", selectedUsers)
      const names = selectedUsers.map((user) => {
        return user['name']
      })
      setNames(names.join(";"))
  }, [selectedUsers])

    const handleNewThread = async () => {
        try {
          //Convert content to array
          newThread.content = [newThread.content];
          newThread.recipients = selectedUsers.map((user) => {
            return user['id']
          });
          const response = await fetchJson.POST(newThread, constants.createNewThread());
          setNewThread({});
          props.navigation.goBack()



        } catch (error) {
            console.log("Message Retrieve Error:", error)
            setPageError(error.message);
        }

    }

    const handleTextChange = (text, name) => {

      setNewThread({
        ...newThread,
        [name]: text
      })

    }

    const selectContacts = () => {
      setModalVisibility(true);
    }

    const closeModal = () => {
      setModalVisibility(false) 
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
                <Modal 
                  transparent={false}
                  animationType={"slide"}
                  visible={modalVisibility}
                  onRequestClose={() => { setModalVisibility(false) }}
                >
                  <ContactList users={selectedUsers} setSelectedUser={setSelectedUsers} closeModal={closeModal} />
                  
                </Modal>
              </Item>
              <Item>
                <Text>{
                  (names) ? `Selected users: ${names}` : ''
                }</Text>
              </Item>
            </Form>
            <Button
                primary 
                block
                onPress={selectContacts}
              >
                <Text>Add Contacts</Text>
                <Icon name='add' />
            </Button>

            <Button primary
              block style={{width: '100%'}}
              onPress={handleNewThread}
            >
              <Text>Send</Text>
              <Icon name='send' />
            </Button>
      
          </Content>
        </Container>
      );
       
}
