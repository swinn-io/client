import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ScrollView,
  VStack,
  Pressable,
  Text,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

export default function ContactList({ users, setSelectedUser, closeModal }) {
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

  const handleClick = async (contact) => {
    try {
      //add if user doesn't exist
      if (!(users.filter((user) => user.id === contact.id).length > 0)) {
        // console.log(`Contact ${contact.name} has been added to list`);
        setSelectedUser([...users, contact]);
      }
      //remove if user exists
      else {
        let listWithoutUser = users.filter((user) => user.id !== contact.id);
        setSelectedUser(listWithoutUser);
      }
    } catch (error) {
      console.log('Handle New Contact - Error', error);
    }
  };

  const closeContactModal = () => {
    closeModal();
  };

  const cancelSelectionModal = () => {
    setSelectedUser([]);
    closeModal();
  };

  return (
    <ScrollView>
      <VStack>
        {contacts.map((contact) => {
          let username = contact.attributes.name;
          let userId = contact.attributes.source.id;
          return (
            <Pressable
              key={userId}
              style={{
                flex: 1,
                width: '100%',
                backgroundColor:
                  users.filter((user) => user.id === userId).length > 0
                    ? '#99EDC3'
                    : undefined,
              }}
              onPress={() => {
                handleClick({
                  id: userId,
                  name: username,
                });
              }}
            >
              <Text p='$3'>{username}</Text>
            </Pressable>
          );
        })}
      </VStack>
      <View>
        <Button onPress={closeContactModal}>
          <ButtonText>Ok</ButtonText>
        </Button>

        <Button action='negative' onPress={cancelSelectionModal}>
          <ButtonText>Remove all and go back</ButtonText>
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {},
});
