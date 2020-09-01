import React, { Component } from 'react';
import { Container, Header, Content, Button, ListItem, Text, Icon, Left, Body, Right, Switch } from 'native-base';

import { AuthContext } from '../services/context';
import { CustomHeader } from '../components/common'

export default function ProfileScreen(){

    const { signOut } = React.useContext(AuthContext);

    const handleLogout = async () => {
        //SignOut comes from App.js Context
        signOut();
    }

    return (
        <Container>
          <CustomHeader/>
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
