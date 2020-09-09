import React from 'react';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';


function SetTitle(title) {
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

  const { isSub, messageTitle } = route
   
   return (
    <Header noShadow >
        <Left style={styles.headerLeft}>
          {isSub? 
            <Button transparent
              onPress={() => route.props.navigation.goBack()}
            >
                <Icon name="ios-arrow-back" />
            </Button>
            :
            <Button transparent
              onPress={() => {
                try {
                  route.props.navigation.openDrawer()
                } catch (error) {
                  console.log(error.message)
                }
              }}
            >
              <Icon name="menu" />
            </Button>
          }
        </Left>
        {SetTitle(messageTitle)}
        <Right style={styles.headerRight}/>
    </Header>
  );

    
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