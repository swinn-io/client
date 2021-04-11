import React from 'react';
import { Container, Icon } from 'native-base';
import ContactScreen from '../screens/ContactScreen';
import QRReaderScreen from '../screens/QRReaderScreen';
import QRGenerationScreen from '../screens/QRGenerationScreen';
import ContactHandleScreen from '../screens/ContactHandleScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();

const TabsToHide = [
    "CHandle"
]

const ContactStack = () => { 
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarButton: TabsToHide.includes(route.name)
                ? () => {
                    return null;
                    }
                : undefined,
            })}
        >
            <Tab.Screen
                name="Contacts"
                component={ContactScreen}
                options={{
                    headerShown: false,
                    unmountOnBlur: true,
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
                name="QR Scanner" 
                component={QRReaderScreen}
                options={{
                    headerShown: false,
                    unmountOnBlur: true,
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
                name="Your QR Code" 
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
            <Tab.Screen
                name="CHandle" 
                component={ContactHandleScreen} 
                options={{
                    headerShown: false,
                    unmountOnBlur: true,
                }}
            />

        </Tab.Navigator>
    );
  }

export default ContactStack