import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import LoadingScreen from './LoadingScreen';
import fetchJson from '../services/fetchJson';
import constants from '../constants/constants';
import { useIsFocused } from '@react-navigation/native';

import { Box } from '@gluestack-ui/themed';

const QRReaderScreen = ({ navigation, route }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  const isFocused = useIsFocused();

  const handleAddContactByRouting = async (id) => {
    console.log(`Contact information has been provided via routing...`);
    await addContact(id);
  };

  useEffect(() => {
    if (isFocused === true) {
      console.log('isFocused ', isFocused);
      // console.log('PARAM INIT => ', route);
      if (route.params && route.params.id) {
        const id = route.params.id;
        handleAddContactByRouting(id);
      } else if (!permission?.granted) {
        requestPermission();
      }
    } else {
      console.log('isFocused ', isFocused);
    }

    return () => {
      setScanned(false);
    };
  }, [isFocused]);

  const addContact = async (id) => {
    try {
      //exp://127.0.0.1:19000/--/friends/add/123
      console.log(`Contact with ${id} will be added...`);
      const newUser = { body: [id] };

      //Send POST request to API in order to add friend
      //TO-DO: Make data fields optional for POST requests
      const response = await fetchJson.POST(
        newUser,
        constants.addSingleContact(id)
      );

      //clear route params
      delete route.params;
    } catch (error) {
      console.log(error.message);
    }

    await navigation.navigate('friends', {
      screen: 'contacts',
    });
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    addContact(data);
  };

  if (!permission) {
    return (
      <View>
        <LoadingScreen></LoadingScreen>
        <Text>Requesting for camera permission</Text>
      </View>
    );
  }
  if (!permission.granted) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Box style={styles.rescanContainer}>
          <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
        </Box>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  rescanContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    backgroundColor: 'transparent',
  },
});

export default QRReaderScreen;
