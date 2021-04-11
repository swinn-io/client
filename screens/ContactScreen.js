import React, { useState, useEffect, useContext } from 'react';
import { Container, Content, Button, Text, List, ListItem,
    Left, Right, Icon, Thumbnail, 
    Body, Spinner, Fab, View }  from 'native-base';
import { CustomHeader, Loading } from '../components/common'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

import { MessageContext } from '../services/store/messageStore';
import { EchoContext } from '../services/store/echoStore';
import { AuthContext } from '../services/store/authStore';

import { isEmpty } from '../services/helperFunctions';
import QRCode from 'react-native-qrcode-svg';

export default function ContactScreen (props) {

    const [contacts, setContacts] = useState([]);
    const [user, setUser] = useContext(AuthContext);
    const userid = user.user.id;
    

    useEffect(() => {

        fetchContacts();

        return () => {
            // Do something when the screen is unfocused
            // Useful for cleanup functions
            setContacts([]);
        };

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

    const openQRReader = () => {
        props.navigation.navigate("QRReader");
    }

    return (
        (contacts && contacts.length)?
        <Container>
          <CustomHeader threadTitle={"My Contacts"} props={props}/>
          <Content>
            {
                (contacts).map((contact) => {
                    
                    let username = contact.attributes.name;
                    let userId = contact.attributes.source.id;
                    return (
                        <ListItem
                            key = { userId }
                            label = { username }
                            value = { userId }
                        >
                            <Body>
                                <Text>{username}</Text>
                            </Body>
                        </ListItem>
                    )
                })
            }
          </Content>
            {/* <Fab
                direction="up"
                containerStyle={{}}
                style={{backgroundColor: '#5067FF'}}
                position="bottomRight"
                onPress={() => openQRReader()}
            >
                <Icon name="add"/>
            </Fab> */}
        </Container> :
        <Container>
            <Loading/>
        </Container>
    );

       
}
