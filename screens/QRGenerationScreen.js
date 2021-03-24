import React, { useState, useEffect, useContext } from 'react';
import { Container, Content, Button, Text, List, ListItem,
    Left, Right, Icon, Thumbnail, 
    Body, Spinner, Fab, View }  from 'native-base';
import { StyleSheet } from 'react-native';
import { CustomHeader } from '../components/common'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';

import { MessageContext } from '../services/store/messageStore';
import { EchoContext } from '../services/store/echoStore';
import { AuthContext } from '../services/store/authStore';

import { isEmpty } from '../services/helperFunctions';
import QRCode from 'react-native-qrcode-svg';

export default function QRGenerationScreen (props) {

    const [contacts, setContacts] = useState([]);
    const [user, setUser] = useContext(AuthContext);
    const userid = user.user.id;
    const QRValue = `https://swinn.io/${userid}`;

    return (
        <Container>
          <CustomHeader threadTitle={"My QR Code"} props={props}/>
          <Container style={styles.container}>
            <QRCode
                value={QRValue}
                size={360}
                color="black"
                //Background Color of the QR Code (Optional)
                backgroundColor="white"
                //   logo={{
                //     url:
                //       '',
                //   }}
                //Center Logo size  (Optional)
                logoSize={30}
                //Center Logo margin (Optional)
                logoMargin={2}
                //Center Logo radius (Optional)
                logoBorderRadius={15}
                //Center Logo background (Optional)
                logoBackgroundColor="blue"
            />
          </Container>
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
    }
})
