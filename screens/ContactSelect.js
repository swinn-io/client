import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Box, ScrollView, Pressable, Text } from '@gluestack-ui/themed';
import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import { CustomHeader } from '../components/common';

export default function ContactSelect(props) {
  // console.log("PROPS => ", props)
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      let response = await fetchJson.GET(constants.getAllContacts());
      let contactsFromResponse = response.data;
      setContacts(contactsFromResponse);
    } catch (error) {
      console.log('Contact List Get Error', error.message);
    }
  };

  const handleNewContact = async (contact) => {
    try {
      // addSelectedUser([...users, contact])
      // console.log("SELECTED CONTACT => ", contact)
    } catch (error) {
      console.log('Handle New Contact - Error', error);
    }
  };

  return (
    <Box flex={1}>
      <CustomHeader isSub={true} props={props} />
      <ScrollView>
        {contacts.map((contact) => {
          let username = contact.attributes.name;
          let userId = contact.attributes.source.id;
          console.log('Contact => ', contact);
          return (
            <Pressable
              key={userId}
              p='$3'
              onPress={() => {
                handleNewContact(userId);
              }}
            >
              <Text>{username}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
