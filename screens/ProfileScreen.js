import React, { Component, useContext } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';

import { CustomHeader } from '../components/common'
import { SignOut } from '../services/userService';
import { AuthContext } from '../services/store/authStore';

export default function ProfileScreen(props){

    const auth_context = useContext(AuthContext);
    const setUser = auth_context[1];

    const handleLogout = async () => {
        //SignOut comes from App.js Context
        SignOut();
        setUser({
          access_token: null
        })
    }

    return (
        <Container>
          <CustomHeader props={props}/>
          <Content>
            <ListItem icon
                onPress={handleLogout}
            >
              <Body>
                <Text>Logout</Text>
              </Body>
              <Right style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="ios-exit" />
              </Right>
            </ListItem>
          </Content>
        </Container>
      );
}
