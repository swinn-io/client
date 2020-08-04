import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon } from 'native-base';

//Screen Imports
import HomeScreen from './screens/HomeScreen';
import AuthScreen from './screens/AuthScreen';


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
    </Tab.Navigator>
  );
}

export default App = () => {

    const [isLoading, setIsLoading] = React.useState(false);
    const [userToken, setUserToken] = React.useState(null);

    const dummyToken = "a1b2c3d4"
    const authContext = React.useMemo(() => ({
        signIn: () => {
            setUserToken(dummyToken)
            //deviceStorage.saveToken("access_token", dummyToken);
        },
        signOut: () => {
            setUserToken(null);
        },
    }));

    if ( userToken ) {
        return (
            <AuthContext.Provider value={authContext}>
                <NavigationContainer>
                    <BottomTabs />
                </NavigationContainer>
            </AuthContext.Provider>
        ); 
    }

    return (
        // <NavigationContainer>
        //     <MyStack />
        // </NavigationContainer>
        <AuthContext.Provider value={authContext}>
            <AuthScreen></AuthScreen>
        </AuthContext.Provider>
    );
    
}
