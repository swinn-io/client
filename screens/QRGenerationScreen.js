import React, { useState, useEffect, useContext } from 'react';
import { Box } from '@gluestack-ui/themed';
import { StyleSheet } from 'react-native';
import { CustomHeader } from '../components/common';

import { AuthContext } from '../services/store/authStore';

import QRCode from 'react-native-qrcode-svg';
import SocialShare from '../components/SocialShare';

export default function QRGenerationScreen(props) {
  const [contacts, setContacts] = useState([]);
  const [user, setUser] = useContext(AuthContext);
  const userid = user.user.id;
  const QRValue = `https://swinn.io/contact/${userid}`;

  useEffect(() => {
    console.log("I'm in QRGenerationScreen");
  }, []);
  return (
    <Box flex={1}>
      <CustomHeader threadTitle={'My QR Code'} props={props} />
      <Box style={styles.container}>
        <QRCode
          value={QRValue}
          size={240}
          color='black'
          //Background Color of the QR Code (Optional)
          backgroundColor='white'
          //Center Logo size  (Optional)
          logoSize={30}
          //Center Logo margin (Optional)
          logoMargin={2}
          //Center Logo radius (Optional)
          logoBorderRadius={15}
          //Center Logo background (Optional)
          logoBackgroundColor='blue'
        />
      </Box>
      <SocialShare />
    </Box>
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
});
