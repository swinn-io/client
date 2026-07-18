import React, { useContext } from 'react';
import { StyleSheet, Share } from 'react-native';
import { Box, Button, ButtonText } from '@gluestack-ui/themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { AuthContext } from '../services/store/authStore';

export default function SocialShare() {
  const [user, setUser] = useContext(AuthContext);
  const userid = user.user.id;
  const QRValue = `https://swinn.io/contact/${userid}`;

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
    <Box style={styles.container}>
      <Button variant='link' onPress={shareMessage} style={styles.buttonStyle}>
        <ButtonText style={styles.buttonTextStyle}>Share Via...</ButtonText>
        <FontAwesome5 name='upload' size={16} />
      </Button>
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
  buttonStyle: {
    justifyContent: 'center',
    marginTop: 15,
    padding: 10,
    width: '100%',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
});
