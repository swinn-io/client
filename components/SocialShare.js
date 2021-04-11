import React, { useState, useContext } from 'react';
import { StyleSheet, Share } from 'react-native';
import { Container, Button, Text } from 'native-base';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { AuthContext } from '../services/store/authStore';
import constants from '../constants/constants';

export default function SocialShare() {

    const [user, setUser] = useContext(AuthContext);
    const userid = user.user.id;
    const QRValue = constants.addContact(userid);

    const shareMessage = () => {
        // Here is the Share API
        Share.share({
        message: QRValue.toString(),
        })
        //after successful share return result
        .then((result) => console.log(result))
        //If any thing goes wrong it comes here
        .catch((errorMsg) => console.log(errorMsg));
    };

    return (
        <Container style={styles.container}>
            <Button iconLeft transparent primary
            onPress={shareMessage}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Share Via...</Text>
            <FontAwesome5 name='upload' />
            </Button>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: 10,
    },
    buttonStyle: {
        justifyContent: 'center',
        marginTop: 15,
        padding: 10,
        width: '100%'
    },
        buttonTextStyle: {
        color: '#fff',
        textAlign: 'center',
    }
});
