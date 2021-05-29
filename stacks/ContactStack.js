import React from 'react';
import { Container, Icon } from 'native-base';
import ContactScreen from '../screens/ContactScreen';
import QRReaderScreen from '../screens/QRReaderScreen';
import QRGenerationScreen from '../screens/QRGenerationScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
const ContactStack = ({ navigation }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Contacts'
        component={ContactScreen}
        options={{
          headerShown: false,
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
        name='Add'
        component={QRReaderScreen}
        options={{
          headerShown: false,
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
        name='Your QR Code'
        component={QRGenerationScreen}
        options={{
          headerShown: false,
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
