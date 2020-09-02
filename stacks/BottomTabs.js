
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MessageStack  from './MessageStack';
import ProfileScreen from '../screens/ProfileScreen';
import { Icon } from 'native-base';

const Tab = createBottomTabNavigator();
const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen
        name="Home"
        component={MessageStack}
        options={{
            tabBarIcon: ({tintColor}) =>  <Icon name="ios-home" size={24} color={tintColor}/>
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
            tabBarIcon: ({tintColor}) =>  <Icon name="ios-person" size={24} color={tintColor}/>
        }}
      />
    </Tab.Navigator>
  );
}

export { BottomTabs }



