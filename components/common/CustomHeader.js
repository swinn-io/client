import React from 'react';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';
import EchoServer from "../EchoServer";


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
      <Title>Swinn</Title>
    </Body>
  );
}

const CustomHeader = (route) => {

  const { isSub, threadTitle } = route
   
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
                  console.log("Custom Header Error" , error.message)
                }
              }}
            >
              <Icon name="menu" />
            </Button>
          }
        </Left>
        {SetTitle(threadTitle)}
        <Right style={styles.headerRight}>
            <EchoServer user={route.user} />
        </Right>
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
