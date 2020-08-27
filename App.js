import React, { useEffect, useCallback } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'native-base';

//Screen Imports
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';
import LoadingScreen from './screens/LoadingScreen';


import { AuthContext } from './services/context';
import deviceStorage from './services/deviceStorage';


const Stack = createStackNavigator();
const MyStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} />
      </Stack.Navigator>
    );
  }

const Tab = createBottomTabNavigator();
const BottomTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
            tabBarIcon: ({tintColor}) =>  <Icon name="ios-home" size={24} color={tintColor}/>
        }}
        />
        <Tab.Screen
        name="Home2"
        component={HomeScreen}
        options={{
            tabBarIcon: ({tintColor}) =>  <Icon name="ios-home" size={24} color={tintColor}/>
        }}
        />
    </Tab.Navigator>
  );
}

export default App = () => {

    const [isLoading, setIsLoading] = React.useState(true);
    const [userToken, setUserToken] = React.useState();

    const authContext = React.useMemo(() => ({
        signIn: ( token ) => {
          try {
            if(token){
              deviceStorage.saveToken("access_token", token);
              setUserToken(token);
            }
          } catch (error) {
            console.log("SignIn Error", error);
          }
        },
        signOut: () => {
          try {
            deviceStorage.removeToken("access_token");
            setUserToken(null);
          } catch (error) {
            console.log("SignOut Error", error);
          }
        },
    }));

    const handleAccessTokenState = async () => {
      try {
        const token = await deviceStorage.getToken("access_token");
        if ( token ) {
          setUserToken(token);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("handleAccessTokenState", error);
      }
    }

    useEffect(() => {
      handleAccessTokenState();
    }, []);


    if ( isLoading ){
      return (
        <LoadingScreen></LoadingScreen>
      );
    }
    else {
      if ( userToken ) {
        return (
            <AuthContext.Provider value={authContext}>
                <NavigationContainer>
                    <BottomTabs />
                </NavigationContainer>
            </AuthContext.Provider>
        ); 
      }
      else {
        return (
          <AuthContext.Provider value={authContext}>
              <AuthScreen></AuthScreen>
          </AuthContext.Provider>
        );
      }
    }


    
    
}
