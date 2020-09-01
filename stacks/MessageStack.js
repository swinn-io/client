import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';

const MsgStack = createStackNavigator();
const MessageStack = () => {
    return (
      <MsgStack.Navigator
        screenOptions={{
          headerShown: "false"
        }}
      >
        <MsgStack.Screen name="Home" component={HomeScreen} />
        <MsgStack.Screen name="Message" component={MessageScreen} />
      </MsgStack.Navigator>
    );
  }

export default MessageStack