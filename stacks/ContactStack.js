import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import ContactScreen from '../screens/ContactScreen';
import QRReaderScreen from '../screens/QRReaderScreen';


const Stack = createStackNavigator();
const ContactStack = () => { 
    return (
    <Stack.Navigator>
        <Stack.Screen
            name="Contact"
            component={ContactScreen}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen 
            name="QRReader" 
            component={QRReaderScreen} 
        />
    </Stack.Navigator>
    );
  }

export default ContactStack