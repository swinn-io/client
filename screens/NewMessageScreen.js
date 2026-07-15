import React, { useState } from 'react';
import {
  Box,
  ScrollView,
  VStack,
  Input,
  InputField,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import { CustomHeader } from '../components/common';

export default function NewMessageScreen(props) {
  const { messageId } = props.route.params;
  const [newMessage, setNewMessage] = useState({});

  const handleNewMessage = async () => {
    try {
      //await fetchJson.POST(newMessage, constants.createNewMessage(messageId));
    } catch (error) {
      console.log('Message Retrieve Error:', error);
    }
  };

  const items = [{ name: 'Subject' }, { name: 'Content1' }, { name: 'Content2' }];
  const handleTextChange = (text, name) => {
    setNewMessage({
      ...newMessage,
      [name]: text,
    });
  };

  return (
    <Box flex={1}>
      <CustomHeader isSub={true} props={props} />
      <ScrollView>
        <VStack space='md' p='$3'>
          {items.map((item, index) => (
            <Input key={index}>
              <InputField
                placeholder={item.name}
                onChangeText={(text) => handleTextChange(text, item.name)}
                value={newMessage[item.name]}
              />
            </Input>
          ))}
          <Button
            alignSelf='flex-start'
            width='95%'
            onPress={handleNewMessage}
          >
            <ButtonText>Send</ButtonText>
            <Ionicons name='send' size={16} color='#fff' />
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}
