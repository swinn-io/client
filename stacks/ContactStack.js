import React from 'react';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import ContactScreen from '../screens/ContactScreen';
import QRReaderScreen from '../screens/QRReaderScreen';
import QRGenerationScreen from '../screens/QRGenerationScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();

const ContactStack = ({ navigation }) => {
  return (
    <Tab.Navigator tabBarPosition='bottom'>
      <Tab.Screen
        name='contacts'
        component={ContactScreen}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: ({ color }) => (
            <MaterialIcons color={color} size={28} name='contacts' />
          ),
        }}
      />
      <Tab.Screen
        name='add'
        component={QRReaderScreen}
        options={{
          tabBarLabel: 'QR Reader',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons color={color} size={28} name='qrcode-scan' />
          ),
        }}
      />
      <Tab.Screen
        name='share'
        component={QRGenerationScreen}
        options={{
          tabBarLabel: 'Your QR Code',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons color={color} size={28} name='qrcode' />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ContactStack;
