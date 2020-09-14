import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AuthScreen from '../screens/AuthScreen';

const AStack = createStackNavigator();
const AuthStack = () => {
    return (
      <AStack.Navigator
        screenOptions={{
            headerShown: false
        }}
      >
        <AStack.Screen name="Auth" component={AuthScreen} />
      </AStack.Navigator>
    );
  }

//export { AuthStack }
export default AuthStack



