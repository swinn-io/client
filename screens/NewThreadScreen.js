import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  ScrollView,
  VStack,
  HStack,
  Input,
  InputField,
  Button,
  ButtonText,
  Text,
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { Modal } from 'react-native';

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import { CustomHeader } from '../components/common';
import ContactList from '../components/ContactList';

import { MessageContext } from '../services/store/messageStore';

export default function NewThreadScreen(props) {
  const { threadTitle } = props.route.params;
  const [newThread, setNewThread] = useState({});
  const [pageError, setPageError] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(false);
  const [names, setNames] = useState([]);

  const [messageState, dispatch] = useContext(MessageContext);

  useEffect(() => {
    const names = selectedUsers.map((user) => {
      return user['name'];
    });
    setNames(names.join(';'));
  }, [selectedUsers]);

  const handleNewThread = async () => {
    try {
      const messageToSend = {
        subject: newThread.subject,
        content: [newThread.content],
        recipients: (newThread.recipients = selectedUsers.map((user) => {
          return user['id'];
        })),
      };

      const response = await fetchJson.POST(
        messageToSend,
        constants.createNewThread()
      );

      await dispatch({ type: 'ADD_THREAD', data: response.data });
      setNewThread({});

      props.navigation.goBack();
    } catch (error) {
      console.log('Message Retrieve Error:', error);
      setPageError(error.message);
    }
  };

  const handleTextChange = (text, name) => {
    setNewThread({
      ...newThread,
      [name]: text.toString(),
    });
  };

  const selectContacts = () => {
    setModalVisibility(true);
  };

  const closeModal = () => {
    setModalVisibility(false);
  };

  return (
    <Box flex={1}>
      <CustomHeader isSub={true} threadTitle={threadTitle} props={props} />
      <ScrollView>
        <VStack space='md' p='$3'>
          <Input>
            <InputField
              placeholder='Subject'
              onChangeText={(text) => handleTextChange(text, 'subject')}
              value={newThread['subject']}
            />
          </Input>
          <Input>
            <InputField
              placeholder='Content'
              onChangeText={(text) => handleTextChange(text, 'content')}
              value={newThread['content']}
            />
          </Input>
          <Modal
            transparent={false}
            animationType={'slide'}
            visible={modalVisibility}
            onRequestClose={() => {
              setModalVisibility(false);
            }}
          >
            <ContactList
              users={selectedUsers}
              setSelectedUser={setSelectedUsers}
              closeModal={closeModal}
            />
          </Modal>
          <Text>{names ? `Selected users: ${names}` : ''}</Text>
          <Button onPress={selectContacts}>
            <ButtonText>Add/Remove Contacts</ButtonText>
            <Ionicons name='add' size={16} color='#fff' />
          </Button>
        </VStack>
      </ScrollView>
      <HStack>
        <Button action='positive' flex={1} onPress={handleNewThread}>
          <ButtonText color='#fff'>Create</ButtonText>
          <Ionicons name='send' color='#fff' size={16} />
        </Button>
      </HStack>
    </Box>
  );
}
