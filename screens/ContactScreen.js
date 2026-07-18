import React, { useState, useEffect, useContext } from 'react';
import { Box, ScrollView, Text } from '@gluestack-ui/themed';
import { CustomHeader } from '../components/common';

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

import { MessageContext } from '../services/store/messageStore';
import { EchoContext } from '../services/store/echoStore';
import { AuthContext } from '../services/store/authStore';

import { isEmpty } from '../services/helperFunctions';
import QRCode from 'react-native-qrcode-svg';
import { useIsFocused } from '@react-navigation/native';

export default function ContactScreen({ navigation }) {
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useContext(AuthContext);
  const userid = user.user.id;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused === true) {
      fetchContacts();
    }
    return () => {
      setContacts([]);
    };
  }, [isFocused]);

  const fetchContacts = async () => {
    try {
      let response = await fetchJson.GET(constants.getAllContacts());
      let contactsFromResponse = response.data;
      setContacts(contactsFromResponse);
    } catch (error) {
      console.log('Contact List Get Error', error.message);
    }
  };

  const openQRReader = () => {
    navigation.navigate('QRReader');
  };

  return (
    <Box flex={1}>
      <CustomHeader threadTitle={'My Contacts'} navigation={navigation} />
      <ScrollView>
        {contacts.map((contact) => {
          let username = contact.attributes.name;
          let userId = contact.attributes.source.id;
          return (
            <Box key={userId} p='$3'>
              <Text>{username}</Text>
            </Box>
          );
        })}
      </ScrollView>
    </Box>
  );
}
