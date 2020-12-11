import React, { useState, useEffect } from 'react';
import { StyleSheet, View} from 'react-native';
import { Container, Header, Title, Content, List,
    ListItem, Thumbnail, Text, Left, Body, Right,
    Button, Badge, Icon, Item, Picker, Footer } from 'native-base';
import ContactListItem from './ContactListItem';
import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

export default function ContactList( { users, setSelectedUser, closeModal} ) {


    const [contacts, setContacts] = useState([]);
    

    useEffect(() => {
        fetchContacts();
    }, [])

    const fetchContacts = async () => {
        try {
            let response = await fetchJson.GET(constants.getAllContacts());
            let contactsFromResponse = response.data;
            setContacts(contactsFromResponse);
        } catch (error) {
            console.log("Contact List Get Error", error.message);
        }
    }

    const handleClick = async (contact) => {
        try {
            //add if user doesn't exist
            if (!(users.filter(user => user.id === contact.id).length > 0)) {
                console.log(`Contact ${contact.name} has been added to list`);
                setSelectedUser([...users, contact])
            }
            //remove if user exists
            else {
                let listWithoutUser = users.filter(user => user.id !== contact.id)
                setSelectedUser(listWithoutUser);
            }

        } catch (error) {
            console.log("Handle New Contact - Error", error)
        }
    }

    const closeContactModal = () => {
        closeModal();
    }

    const cancelSelectionModal = () => {
        setSelectedUser([]);
        closeModal();
    }
    
    return (

        <Content>
        <List>
        {
            (contacts).map((contact) => {
                let username = contact.attributes.name;
                let userId = contact.attributes.source.id;
                console.log("Contact => ", contact)
                return (
                    <ListItem
                        noIndent
                        button
                        key={userId}
                        style={{
                            flex: 1,
                            width: "100%",
                            backgroundColor: (users.filter(user => user.id === userId).length > 0) ? '#99EDC3' : undefined,
                        }}
                        onPress={() => {
                            handleClick({
                                id: userId,
                                name: username
                            })
                        }
                    }
                    >
                        <Text>{username}</Text>
                    </ListItem>
                )})
            }
        </List>
        <View>
            <Button 
                full
                primary
                onPress={closeContactModal}
            >
                <Text>Ok</Text>
            </Button>

            <Button 
                full
                danger
                onPress={cancelSelectionModal}
            >
                <Text>Remove and go back</Text>
            </Button>
        </View>
        </Content>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {

    }
});
