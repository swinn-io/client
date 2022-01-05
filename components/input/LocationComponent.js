import React, { useEffect, useContext } from 'react';
import { Button, Icon, Text } from 'native-base';
import * as Location from 'expo-location';

import constants from '../../constants/constants';
import fetchJson from '../../services/fetchJson';

import { MessageContext } from '../../services/store/messageStore';

let sendLocation = async (props, dispatch) => {
  const hasLocationServicesEnabled = await Location.hasServicesEnabledAsync();

  if (!hasLocationServicesEnabled) {
    //TO-DO: Handle location services enabling
    //Location.requestPermissionsAsync()

    alert('Please enable your location services');
    return;
  }
  try {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const newMessage = { body: [location] };

    const data = await fetchJson.POST(
      newMessage,
      constants.createNewMessage(props.threadId)
    );

    try {
      await dispatch({ type: 'ADD_MESSAGES', data: data.data });
    } catch (err) {
      console.log('LOCATION COMPONENT ERROR => ', err);
    }
  } catch (error) {
    console.log('Location Component - findCurrentLocationAsync Error:', error);
  }
};

const LocationComponent = (props) => {
  const [messageState, dispatch] = useContext(MessageContext);

  return (
    <Button
      style={{ backgroundColor: '#4B58A6' }}
      onPress={() => sendLocation(props, dispatch)}
    >
      <Icon style={{ color: '#fff' }} name='compass' />
      <Text style={{ color: '#fff' }}>Location</Text>
    </Button>
  );
};

export { LocationComponent };
