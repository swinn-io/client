import React, { useState, useEffect, useContext } from 'react';
import { Container, Text, Content, Form, Item, 
  Input, Left, Right, Button, Icon, List,
   ListItem, Thumbnail, Body, Footer, FooterTab, InputGroup, Picker, View}  from 'native-base';
import { StyleSheet, Modal } from 'react-native'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import { CustomHeader } from '../components/common'
import ContactList from '../components/ContactList';


import { MessageContext } from '../services/store/messageStore';



export default function NewThreadScreen (props) {

    const { threadTitle } = props.route.params
    // console.log("TITLE", threadTitle)
    const [newThread, setNewThread] = useState({})
    const [pageError, setPageError] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [modalVisibility, setModalVisibility] = useState(false)
    const [names, setNames] = useState([])

    const [messageState, dispatch] = useContext(MessageContext)

    useEffect(() => {
      // console.log("Selected Users Changed => ", selectedUsers)
      const names = selectedUsers.map((user) => {
        return user['name']
      })
      setNames(names.join(";"))
  }, [selectedUsers])

    const handleNewThread = async () => {
        try {
          const messageToSend = {
            subject: newThread.subject,
            content: [newThread.content],
            recipients: newThread.recipients = selectedUsers.map((user) => {
              return user['id']
            })
          }
          
          const response = await fetchJson.POST(messageToSend, constants.createNewThread());

          await dispatch({ type: 'ADD_THREAD', data: response.data})
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
        [name]: text.toString()
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
                  full
                  onPress={selectContacts}
                >
                  <Text>Add/Remove Contacts</Text>
                  <Icon name='add' />
              </Button>
          </Content>
          <Footer>
            <FooterTab>
              <Button
                success
                full
                style={{width: '100%', color: '#fff'}}
                onPress={handleNewThread}
              >
                <Text style={{color: "#fff"}}>Create</Text>
                <Icon style={{color: "#fff"}}name='send' />
              </Button>
            </FooterTab>
          </Footer>
        </Container>
      );
       
}
