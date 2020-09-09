
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import { Container, Icon } from 'native-base';
import MessageStack from './MessageStack';
//import ProfileScreen from '../screens/ProfileScreen';




const Tab = createBottomTabNavigator()
const BottomTabs = () => {
  return (
      <Tab.Navigator initialRouteName="Home">
          <Tab.Screen
              name="Home"
              component={MessageStack}
              options={{
                  tabBarIcon: ({ tintColor }) => (
                      <Container>
                          <Icon
                              style={[{ color: tintColor }]}
                              size={28}
                              name={'home'}
                          />
                      </Container>
                  ),
              }}
          />
          {/* <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                  tabBarIcon: ({ tintColor }) => (
                      <Container>
                          <Icon
                              style={[{ color: tintColor }]}
                              size={28}
                              name={'person'}
                          />
                      </Container>
                  ),
              }}
          /> */}
      </Tab.Navigator>
  )
}

//export { BottomTabs }
export default BottomTabs



