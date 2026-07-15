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
  Spinner,
  Fab,
  Pressable,
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { CustomHeader } from '../components/common';

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

import { MessageContext } from '../services/store/messageStore';
import { EchoContext } from '../services/store/echoStore';
import { AuthContext } from '../services/store/authStore';

import { isEmpty } from '../services/helperFunctions';

export default function HomeScreen(props) {
  const [error, setError] = useState(false);
  const [messageState, dispatch] = useContext(MessageContext);
  const [userState] = useContext(AuthContext);
  const [echoState] = useContext(EchoContext);

  const [active, setActive] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    // console.log("MESSAGE STATE THREADS: ", messageState.threads);
  }, [messageState]);

  useEffect(() => {
    const channel = `App.Models.User.${userState.user.id}`;
    echoState.private(channel).notification((notification) => {
      handleNewMessage(notification);
    });

    console.log('Join "online" channel');

    return () => {
      echoState.leave(channel);
      console.log('Leaving channel:', channel);
    };
  }, []);

  const refreshPage = () => {
    //If refresh is needed
    fetchMessages();
  };

  const handleNewMessage = async (notification) => {
    try {
      const notification_type = notification.type;
      console.log('-----NEW NOTIFICATION-----', notification);
      if (notification_type.includes('MessageCreated')) {
        await dispatch({ type: 'ADD_MESSAGES', data: notification.payload });
      } else if (notification_type.includes('ThreadCreated')) {
        await dispatch({ type: 'ADD_THREAD', data: notification.payload });
      }
    } catch (e) {
      console.log('Error', e);
    }
  };

  const renderRow = (thread) => {
    return (
      <Pressable
        onPress={() => {
          props.navigation.navigate('Message', {
            threadId: thread.thread_id,
            threadTitle: thread.subject,
            // onGoBack: refreshPage()
          });
        }}
      >
        <HStack alignItems='center' space='md' p='$2'>
          <Avatar>
            <AvatarImage
              source={{
                uri: 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png',
              }}
            />
          </Avatar>
          <VStack flex={1}>
            <Text>{thread.subject}</Text>
            <Text size='sm' numberOfLines={1}>
              {thread.thread_id}
            </Text>
          </VStack>
          <Button variant='link'>
            <Ionicons name='arrow-forward' size={20} />
          </Button>
        </HStack>
      </Pressable>
    );
  };

  const fetchMessages = async () => {
    try {
      setError(false);
      let response = await fetchJson.GET(constants.getAllMessages());
      let msg = [];
      let threads = response.data;
      threads.forEach((thread) => {
        msg.push({
          thread_id: thread.id,
          subject: thread.attributes.subject,
          thread_attributes: thread.attributes,
        });
      });
      if (threads.length > 0) {
        await dispatch({ type: 'SET_THREADS', payload: msg });
      } else {
        setError("You don't have any messages yet");
      }
    } catch (error) {
      console.log('Custom Warning - Home Screen:', error.message);
      setError(error.message);
    }
  };

  const createNewThread = async () => {
    try {
      setActive(!active);
      setError(false);
      props.navigation.navigate('NewThread', {
        threadTitle: 'Create new thread',
      });
    } catch (error) {
      console.log('Error Home Screen - Create New Thread', error);
    }
  };

  return (
    <Box flex={1}>
      <CustomHeader props={props} />
      {messageState.threads.length > 0 ? (
        <Box flex={1}>
          <ScrollView>
            {messageState.threads.map((message) => (
              <React.Fragment key={message.thread_id}>
                {renderRow(message)}
              </React.Fragment>
            ))}
          </ScrollView>
          <Fab
            bottom='$4'
            right='$4'
            bg='#5067FF'
            onPress={() => createNewThread()}
          >
            <Ionicons name='add' size={24} color='#fff' />
          </Fab>
        </Box>
      ) : (
        <Box flex={1} alignItems='center' justifyContent='center' bg='#fff'>
          {error ? <Text> {error} </Text> : <Spinner />}
        </Box>
      )}
    </Box>
  );
}
