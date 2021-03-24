import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../screens/ProfileScreen';
import MainStack from './MainStack';
import ContactStack from './ContactStack';

const Drawer = createDrawerNavigator();
const MenuStack = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={MainStack} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="QR Code" component={ContactStack} />
    </Drawer.Navigator>
  );
}

export default MenuStack
//export { MenuStack }