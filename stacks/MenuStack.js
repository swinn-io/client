import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ProfileScreen from '../screens/ProfileScreen';
import MainStack from './MainStack';
import ContactStack from './ContactStack';

const Drawer = createDrawerNavigator();
const MenuStack = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={MainStack} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="Profile" component={ProfileScreen} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
        <Drawer.Screen name="QR Code" component={ContactStack} unmountOnBlur={true} options={{unmountOnBlur: true}}/>
    </Drawer.Navigator>
  );
}

export default MenuStack
//export { MenuStack }