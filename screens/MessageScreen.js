import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  ScrollView,
  HStack,
  VStack,
  Avatar,
  AvatarImage,
  Text,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import { CustomHeader, Loading } from '../components/common';

import { MessageContext } from '../services/store/messageStore';

import { LocationComponent } from '../components/input';
import { BatteryComponent } from '../components/input/BatteryComponent';
import LoadingScreen from './LoadingScreen';

const MessageScreen = (props) => {
  const { threadId, threadTitle } = props.route.params;
  const [newMessage, setNewMessage] = useState('');
  const [active, setActive] = useState(false);

  const [messageState, dispatch] = useContext(MessageContext);
  useEffect(() => {
    // console.log("MESSAGE STATE CHANGED");
    // console.log("MESSAGE STATE MESSAGES: ", messageState.messages);
  }, [messageState]);

  useEffect(() => {
    retrieveMessage();
  }, []);

  const retrieveMessage = async () => {
    try {
      console.log('ThreadId', threadId);
      const response = await fetchJson.GET(
        constants.getSingleMessage(threadId)
      );

      setActive(true);

      const threadMessages = response.data.attributes.messages;

      let messages = [];
      threadMessages.forEach((msg) => {
        // console.log("msg", msg)
        messages.push({
          id: msg.id,
          body: msg.attributes.body,
          thread_id: msg.attributes.thread_id,
        });
      });
      const payload = { [threadId]: messages };
      if (threadMessages.length > 0) {
        dispatch({ type: 'SET_MESSAGES', payload: payload });
      } else {
        setError("You don't have any messages yet");
      }
    } catch (error) {
      console.log('Message Retrieve Error:', error);
    }
  };

  const handleNewMessage = async () => {
    try {
      //generate random number between -100 and 100 for test purposes
      var ranNum1 =
        Math.ceil(Math.random() * 100) * (Math.round(Math.random()) ? 1 : -1);
      var ranNum2 =
        Math.ceil(Math.random() * 100) * (Math.round(Math.random()) ? 1 : -1);

      const newMessage = { body: [ranNum1, ranNum2] };

      const data = await fetchJson.POST(
        newMessage,
        constants.createNewMessage(threadId)
      );

      try {
        await dispatch({ type: 'ADD_MESSAGES', data: data.data });
      } catch (err) {
        console.log('ERROR => ', err);
      }
    } catch (error) {
      console.log('Message Retrieve Error:', error);
    }
  };

  const renderRow = (message) => {
    //TO-DO parse messages
    return (
      <HStack alignItems='center' space='md' p='$2'>
        <Avatar>
          <AvatarImage
            source={{
              uri: 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png',
            }}
          />
        </Avatar>
        <VStack flex={1}>
          <Text>{JSON.stringify(message.body)}</Text>
        </VStack>
      </HStack>
    );
  };

  return (
    <Box flex={1}>
      <CustomHeader isSub={true} threadTitle={threadTitle} props={props} />
      {active ? (
        <Box flex={1}>
          <ScrollView flex={1}>
            {(messageState.messages[threadId] || []).map((message) => (
              <React.Fragment key={message.id}>
                {renderRow(message)}
              </React.Fragment>
            ))}
          </ScrollView>
          <HStack>
            <Button
              flex={1}
              style={{ backgroundColor: '#F2786D' }}
              onPress={handleNewMessage}
            >
              <Ionicons name='cellular' color='#fff' size={18} />
              <ButtonText color='#fff'> Random Numbers</ButtonText>
            </Button>
            <LocationComponent threadId={threadId} />
            <BatteryComponent threadId={threadId} />
          </HStack>
        </Box>
      ) : (
        <LoadingScreen></LoadingScreen>
      )}
    </Box>
  );
};

export default MessageScreen;
