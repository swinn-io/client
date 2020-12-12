import React, { useState } from 'react';
import { StyleSheet, View} from 'react-native';
import {  ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon } from 'native-base';

export default function ContactListItem(contact) {

    return (
        <ListItem>
            {/* <Text>{contact}</Text> */}
        </ListItem>
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
