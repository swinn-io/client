import React from 'react';
import { Container, Icon } from 'native-base';
import ContactScreen from '../screens/ContactScreen';
import QRReaderScreen from '../screens/QRReaderScreen';
import QRGenerationScreen from '../screens/QRGenerationScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// const Tab = createBottomTabNavigator();
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
          tabBarIcon: ({ tintColor }) => (
            <Container>
              <Icon
                style={[{ color: tintColor }]}
                size={28}
                name={'contacts'}
              />
            </Container>
          ),
        }}
      />
      <Tab.Screen
        name='add'
        component={QRReaderScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'QR Reader',
          tabBarIcon: ({ tintColor }) => (
            <Container>
              <MaterialCommunityIcons
                style={[{ color: tintColor }]}
                size={28}
                name={'qrcode-scan'}
              />
            </Container>
          ),
        }}
      />
      <Tab.Screen
        name='share'
        component={QRGenerationScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Your QR Code',
          tabBarIcon: ({ tintColor }) => (
            <Container>
              <MaterialCommunityIcons
                style={[{ color: tintColor }]}
                size={28}
                name={'qrcode'}
              />
            </Container>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default ContactStack;
