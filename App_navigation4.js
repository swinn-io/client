import React, { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Badge, Icon } from 'native-base';
import FriendList from './components/FriendList';


import { NavigationContainer } from '@react-navigation/native';

//Screen imports
//Auth Stack
import AuthScreen from './screens/AuthScreen';

//App Stack
import HomeScreen from './screens/HomeScreen';
import LoadingScreen from './screens/LoadingScreen';


//Navigation imports
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

// const AppContainer = createStackNavigator({
//     default: createBottomTabNavigator(
//       {
//         Home: {
//           screen: HomeScreen,
//           navigationOptions: {
//             tabBarIcon: ({tintColor}) =>  <Icon name="ios-home" size={24} color={tintColor}/>
//           }
//         },
//       },
//       {
//         defaultNavigationOptions: {
//           tabBarOnPress: ({navigation, defaultHandler}) => {
//             defaultHandler();
//           }
//         },
//         tabBarOptions: {
//           activeTintColor: "#161F3D",
//           inactiveTintColor: "#B8B8C4",
//         }
//       }
//     )
//   },
//   {
//     mode: "modal",
//     headerMode: "none"
//   });
  
//   const AuthStack = createStackNavigator({
//     //signup: AuthScreen,
//     signup: {
//         screen: AuthScreen, 
//         navigationOptions: {
//             headerShown: false,
//         },
//     }
//   })
  
//   export default createAppContainer (
//     createSwitchNavigator (
//       {
//         Loading: LoadingScreen,
//         App: AppContainer,
//         Auth: AuthStack
//       },
//       {
//         initialRouteName: "Loading"
//       }
//     )
//  )

  export default function App() {
    return (
    //   <NavigationContainer>
    //     <AuthStack.Navigator>{AuthScreen}</AuthStack.Navigator>
    //     <AppContainer.Navigator>{HomeScreen}</AppContainer.Navigator>
    //   </NavigationContainer>
    return <NavigationContainer>{/*...*/}</NavigationContainer>;
    );
  }
  
  