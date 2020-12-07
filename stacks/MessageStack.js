import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import MessageScreen from '../screens/MessageScreen';
import NewMessageScreen from '../screens/NewMessageScreen';
import NewThreadScreen from '../screens/NewThreadScreen';

const MsgStack = createStackNavigator();
const MessageStack = () => { 
    return (
      <MsgStack.Navigator>
        <MsgStack.Screen 
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <MsgStack.Screen 
          name="Message" 
          component={MessageScreen}
          options={{
            headerShown: false,
          }}
        />
        <MsgStack.Screen 
          name="NewMessage" 
          component={NewMessageScreen}
          options={{
            headerShown: false,
          }}
        />
        <MsgStack.Screen 
          name="NewThread" 
          component={NewThreadScreen}
          options={{
            headerShown: false,
          }}
        />
      </MsgStack.Navigator>
    );
  }

export default MessageStack
//export { MessageStack }
              