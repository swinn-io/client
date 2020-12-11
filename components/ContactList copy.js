import React, { useState, useEffect } from 'react';
import { StyleSheet, View} from 'react-native';
import { Container, Header, Title, Content, List,
    ListItem, Thumbnail, Text, Left, Body, Right,
    Button, Badge, Icon, Item, Picker } from 'native-base';
import ContactListItem from './ContactListItem';
import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

export default function ContactList( { users, addSelectedUser} ) {


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

    const handleNewContact = async (contact) => {
        try {
            addSelectedUser([...users, contact])
        } catch (error) {
            console.log("Handle New Contact - Error", error)
        }
    }
    
    return (
        // <Picker
        //     // mode="popup"
        //     iosIcon={<Icon name="arrow-down" />}
        //     style={{ width: "85%"}}
        //     placeholder="Select participant(s)"
        //     placeholderStyle={{ color: "#bfc6ea" }}
        //     placeholderIconColor="#007aff"
        //     selectedValue={ contacts }
        //     onValueChange={ contact => handleNewContact(contact) }
        // >
        //     {
        //         (contacts).map((contact) => {
                    
        //             let username = contact.attributes.name;
        //             let userId = contact.attributes.source.id;
        //             console.log("Contact => ", contact)
        //             return (
        //                 <Picker.Item
        //                     key = { userId }
        //                     label = { username }
        //                     value = { userId }
        //                 />
        //             )
        //         })
        //     }
        // </Picker>
        <List>
            <ListItem>
            <Text>Simon Mignolet</Text>
            </ListItem>
            <ListItem>
            <Text>Nathaniel Clyne</Text>
            </ListItem>
            <ListItem>
            <Text>Dejan Lovren</Text>
            </ListItem>
        </List>
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
