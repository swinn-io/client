import React, { Component, useContext, useEffect, useState } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';

import { CustomHeader } from '../components/common'
import { SignOut } from '../services/userService';
import { AuthContext } from '../services/store/authStore';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import fetchJson from '../services/fetchJson';
import constants from '../constants/constants';

export default function ContactHandleScreen(props){

    const {type, data} = props.route.params

    const [screenMessage, setScreenMessage] = useState("")
    const addContact = async () => {
      try {

          const user_id = data
          const newMessage = { body: {user_id: data} }
          const response = await fetchJson.POST(newMessage, constants.addContact(user_id))
          console.log("Response.data: ", response.data)

          props.navigation.navigate("Contacts");


          console.log(`Data: ${data} AND Type: ${type}`)

          
      } catch (error) {
          console.log("ContactHandleScreen", error)
          setScreenMessage(error.message);
      }
  }


    useFocusEffect(
      React.useCallback(() => {
        
        addContact();
  
        return () => {
          // Do something when the screen is unfocused
          // Useful for cleanup functions
        };
      }, [])
    );

    return (
        <Container>
          <CustomHeader props={props}/>
          <Content>
              <Body>
                <Text>{screenMessage}</Text>
              </Body>
          </Content>
        </Container>
      );
}
