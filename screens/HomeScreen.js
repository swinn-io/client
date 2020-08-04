import React, { Component} from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Text, Button}  from 'native-base';
import deviceStorage from '../services/deviceStorage';

import { AuthContext } from '../services/context';

export default function HomeScreen () {

    const { signOut } = React.useContext(AuthContext);

    const handleLogout = async () => {
        //SignOut comes from App.js Context
        signOut();
    }

    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
            <Button 
                style={{alignSelf:'center'}}
                onPress={handleLogout}
            >
                <Text>Logout</Text>
            </Button>
        </View>
    );
        
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
