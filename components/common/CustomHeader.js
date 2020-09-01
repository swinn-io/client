import React from 'react';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';

const CustomHeader = () => {
    return (
        <Header noShadow>
            <Left>
                <Button transparent>
                    <Icon name="menu" />
                </Button>
            </Left>
            <Body>
                <Title>Ping Pong</Title>
            </Body>
            <Right/>
        </Header>
      );
};

const styles = {
  headerContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems:'center'
  }
};

export { CustomHeader };