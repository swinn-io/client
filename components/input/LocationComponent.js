import React, { useEffect, useContext } from 'react';
import { Button, Icon, Text } from 'native-base';
import * as Location from 'expo-location';

import constants from '../../constants/constants';
import fetchJson from '../../services/fetchJson';

import { MessageContext } from '../../services/messageStore';

let sendLocation = async (props, dispatch) => {
    const hasLocationServicesEnabled = await Location.hasServicesEnabledAsync();

    if (!hasLocationServicesEnabled){
        //TO-DO: Handle location services enabling
        //Location.requestPermissionsAsync()

        alert("Please enable your location services")
        return
    }
    try {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied')
            return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const newMessage = { body: [location] }
        
        const data = await fetchJson.POST(newMessage, constants.createNewMessage(props.threadId))
        // console.log("DATA => ", data)
        

        try{
            // console.log("DATA TO SAVE => ", data.data)
            await dispatch({ type: 'ADD_MESSAGES', data: data.data})
        }
        catch(err) {
            console.log("ERROR => ", err)
        }
        
        // await dispatch({ type: 'ADD_MESSAGES', action: data})
        // console.log("MESSAGE DISPATCHED");
        
    }
    catch (error) {
        console.log("Location Component - findCurrentLocationAsync Error:", error)
    }
}

const LocationComponent = (props) => {

    const [messageState, dispatch] = useContext(MessageContext)

    return (
        <Button 
            style={{backgroundColor: '#4B58A6'}}
            onPress={() => sendLocation(props, dispatch)}
        >
            <Icon style={{color: '#fff'}} name="compass"/>
            <Text style={{color: '#fff'}}>Location</Text>
        </Button>
    );
}

export { LocationComponent };