import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Container, Icon } from 'native-base';
import MessageStack from './MessageStack';
import ContactStack from './ContactStack';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const MainStack = ({ navigation }) => {
  return (
    <Tab.Navigator initialRouteName='home'>
      <Tab.Screen
        name='home'
        component={MessageStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ tintColor }) => (
            <Container>
              <Icon style={[{ color: tintColor }]} size={28} name={'home'} />
            </Container>
          ),
        }}
      />
      <Tab.Screen
        name='friends'
        component={ContactStack}
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({ tintColor }) => (
            <Container>
              <Icon style={[{ color: tintColor }]} size={28} name={'person'} />
            </Container>
          ),
        }}
      />
      <Tab.Screen
        name='settings'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ tintColor }) => (
            <Container>
              <Icon
                style={[{ color: tintColor }]}
                size={28}
                name={'settings'}
              />
            </Container>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

//export { BottomTabs }
export default MainStack;
