import React from 'react';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';

function SetTitle(title) {

  //console.log("ROUTE=>", route)
  if(title){
    return (
      <Body style={styles.headerBody}>
        <Title>{title}</Title>
      </Body>
    )
  }
  return (
    <Body style={styles.headerBody}>
      <Title>Ping Pong</Title>
    </Body>
  );
}

const CustomHeader = (route) => {

  //console.log("CUSTOM HEADER ROUTE =>", route.messageTitle)

  const { isSub, messageTitle } = route
   if (isSub){
    return (
      <Header noShadow >
          <Left style={styles.headerLeft}>
            <Button transparent
              onPress={() => {
                console.log(route.props.navigation.goBack())
              }}
            >
                <Icon name="ios-arrow-back" />
            </Button>
          </Left>
          {SetTitle(messageTitle)}
          <Right style={styles.headerRight}/>
      </Header>
    );
   }
   else {
    return (
      <Header noShadow>
          <Left>
            <Button transparent>
                <Icon name="menu" />
            </Button>
          </Left>
          {SetTitle(messageTitle)}
          <Right/>
      </Header>
    );
   }
    
};

const styles = {
  headerContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems:'center'
  },
  headerLeft: {
    flex:'10%'
  },
  headerRight: {
    flex:'10%'
  },
  headerBody: {
    flex:'80%'
  },
};

export { CustomHeader };