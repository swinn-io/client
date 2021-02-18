import React, { useEffect, useState, useMemo } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';

import { Icon, Container } from 'native-base';

//Screen Imports
import LoadingScreen from './screens/LoadingScreen';
//import { AuthContext, MessageContext } from './services/context';

import { AuthContext } from './services/context';

//Stack Imports
//import MessageStack from './stacks/MessageStack';
import MenuStack from './stacks/MenuStack';
//import BottomTabs from './stacks/BottomTabs';
import AuthStack from './stacks/AuthStack'
//import MainStack from './stacks/MainStack'

import deviceStorage from './services/deviceStorage';

import MessageStore from './services/messageStore';
import { Socket } from 'socket.io-client';

import SocketService from './services/socketService';






export default App = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState({});
    // const [socket, setSocket] = useState(null);

    const authContext = useMemo(() => ({
        signIn: async ( user ) => {
          try {
            if( !isEmpty( user )){
              await deviceStorage.saveUser(user);
              setUser(user);
            }
          } catch (error) {
            console.log("SignIn Error", error);
          }
        },
        signOut: async () => {
          try {
            await deviceStorage.removeUser();
            setUser({});
          } catch (error) {
            console.log("SignOut Error", error);
          }
        },
        getUser: async () => {
          try {
            let user = await deviceStorage.getUser()
            //When access_token is needed
            //console.log("USER", user);
            return user;
          } catch (error) {
            console.log("GetUser Error", error);
          }
        },
    }));

    const isEmpty = (obj) => {
      return Object.entries(obj).length === 0 && obj.constructor === Object;
    }

    const handleUser = async () => {
      try {
        const user = await deviceStorage.getUser();
        if ( user ) {
          setUser(user);
          SocketService.SetConnection(user);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("handleUser in APP.js", error);
      }
    }

    useEffect(() => {
      handleUser();
    }, []);


  const MyTheme = {
    dark: true,
    colors: {
      primary: 'rgb(255, 45, 85)',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: 'rgb(28, 28, 30)',
      border: 'rgb(199, 199, 204)',
      notification: 'rgb(255, 69, 58)',
    },
  };

if ( isLoading ){
  return (
    <LoadingScreen></LoadingScreen>
  );
}
else {
  return (
    <AuthContext.Provider value={authContext}>
      <MessageStore>
        <NavigationContainer>
        { user.access_token? 
          <MenuStack/>
        :
          <AuthStack/>
        }
        </NavigationContainer>
      </MessageStore>
    </AuthContext.Provider>
)
}
    


    
    
}

