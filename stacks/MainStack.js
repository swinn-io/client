import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import MessageStack from './MessageStack';
import ContactStack from './ContactStack';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const MainStack = ({ navigation }) => {
  return (
    <Tab.Navigator initialRouteName='home'>
      <Tab.Screen
        name='home'
        component={MessageStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} size={size} name='home' />
          ),
        }}
      />
      <Tab.Screen
        name='friends'
        component={ContactStack}
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} size={size} name='person' />
          ),
        }}
      />
      <Tab.Screen
        name='settings'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons color={color} size={size} name='settings' />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainStack;
