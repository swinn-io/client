import * as React from 'react';
import { Button, Icon, Text } from 'native-base';
import * as Location from 'expo-location';

import constants from '../../constants/constants';
import fetchJson from '../../services/fetchJson';

const sendLocationBAK = async () => {

    try {
        const isLocationServicesEnabled = await Location.hasServicesEnabledAsync();
        if (isLocationServicesEnabled) {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== 'granted') {
                // setErrorMsg('Permission to access location was denied');
                alert('Permission to access location was denied')
                return;
            }
            else {
                let location = await Location.getCurrentPositionAsync({});
                const newMessage = { body: [location] }
                console.log("PROPS", threadId);
                // await fetchJson.POST(newMessage, constants.createNewMessage(threadId));
            }
        }
        else {
            //Location.requestPermissionsAsync()
            alert("I'm in else")
            //Ask user to enable location services
        }

    } catch (error) {
        console.log("Location Component Error:", error)
    }
}

const sendLocation = async (props) => {
    const hasLocationServicesEnabled = await Location.hasServicesEnabledAsync();
    if (!hasLocationServicesEnabled){
        //TO-DO: Handle location services enabling
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
        await fetchJson.POST(newMessage, constants.createNewMessage(props.threadId));
        
    }
    catch (error) {
        console.log("Location Component - findCurrentLocationAsync Error:", error)
    }
}

const LocationComponent = (props) => {
    return (
        <Button 
            style={{backgroundColor: '#4B58A6'}}
            onPress={() => sendLocation(props)}
        >
            <Icon style={{color: '#fff'}} name="compass"/>
            <Text style={{color: '#fff'}}>Location</Text>
        </Button>
    );
}

export { LocationComponent };