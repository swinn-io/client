import React, { useEffect, useState, useContext } from 'react';
import { Container, Header, Left, Body, Right, Button, Title, Icon } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { EchoContext } from '../../services/store/echoStore';

const CustomHeader = (route) => {

  const { isSub, threadTitle } = route

  const [headerTitle] = useState(threadTitle ? threadTitle : "Swinn");
  const [echoState] = useContext(EchoContext);

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
        <Body style={styles.headerBody}>
          <Title>{headerTitle}</Title>
        </Body>
        <Right style={styles.headerRight}>
          <Button transparent>
              {/* <FontAwesome5 name={echoState.connector.socket.connected ? 'satellite-dish' : 'plug'} style={{ */}
              <FontAwesome5 name={'circle'} solid style={{
                  fontSize:20, 
                  color: echoState.connector.socket.connected ? 'green' : 'red'
              }} />
          </Button>
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
