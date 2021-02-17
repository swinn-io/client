import React, { useEffect, useState } from 'react';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';
import socketService from '../../services/socketService';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


const ICONS = {
  online: 'satellite-dish',
  offline: 'plug'
}
const COLORS = {
  online: 'green',
  offline: 'red'
}

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

function SetConnectionStatus(status){
  
  let statusSym;
  if(status){
    statusSym = {
      icon: ICONS.online,
      color: COLORS.online
    }
  }
  else {
    statusSym = {
      icon: ICONS.offline,
      color: COLORS.offline
    }
  }
  
  return <FontAwesome5 name={statusSym.icon} style={{fontSize:20, color: statusSym.color}} />
}

const CustomHeader = (route) => {

  const { isSub, threadTitle } = route
  let [connectionStatus, setConnectionStatus] = useState(false);

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
            { SetConnectionStatus(socketService.GetConnectionStatus()) }
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
