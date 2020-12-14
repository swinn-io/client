import React, { useState, useEffect } from 'react';
import { StyleSheet, View} from 'react-native';
import { Container, Header, Title, Content, List,
    ListItem, Thumbnail, Text, Left, Body, Right,
    Button, Badge, Icon, Item, Picker, CheckBox } from 'native-base';
import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import { CustomHeader } from '../components/common'

export default function ContactSelect( props ) {

    // console.log("PROPS => ", props)
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
            // addSelectedUser([...users, contact])
            // console.log("SELECTED CONTACT => ", contact)
        } catch (error) {
            console.log("Handle New Contact - Error", error)
        }
    }
    
    return (
        <Container>
          <CustomHeader isSub={true} props={props}/>
          <Content>
            {
                (contacts).map((contact) => {
                    
                    let username = contact.attributes.name;
                    let userId = contact.attributes.source.id;
                    console.log("Contact => ", contact)
                    return (
                        <ListItem button onPress={() => {handleNewContact (userId)}}
                            key = { userId }
                            label = { username }
                            value = { userId }
                        >
                            <CheckBox checked={false} />
                            <Body>
                                <Text>{username}</Text>
                            </Body>
                        </ListItem>
                    )
                })
            }
          </Content>
        </Container>
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
