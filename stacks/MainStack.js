import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './BottomTabs';


const Stack = createStackNavigator();
const MainStack = () => { 
    return (
    <Stack.Navigator>
        <Stack.Screen
            name="Home"
            component={BottomTabs}
            options={{
                headerShown: false,
            }}
        />
        {/* <Stack.Screen name="Profile" component={ProfileScreen} /> */}
    </Stack.Navigator>
    );
  }

export default MainStack        
//export { BottomTabs }