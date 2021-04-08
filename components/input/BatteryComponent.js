import React, {useContext, useState, useEffect } from 'react';
import * as Battery from 'expo-battery';
import {Button, Icon, Text} from 'native-base';

import {MessageContext} from '../../services/store/messageStore';
import fetchJson from "../../services/fetchJson";
import constants from "../../constants/constants";

let batteryColor = (level) => {
    let round = batteryPercentage(level);
    if(round > 80) return '#05F240';
    else if(round > 60) return '#04D939';
    else if(round > 40) return '#03A62C';
    else if(round > 20) return '#02731E';

    return '#0D0D0D';
}

let batteryPercentage = (level) => {
    return Math.round(level * 100)
}

const BatteryComponent = (props) => {

    const [messageState, dispatch] = useContext(MessageContext);
    let [battery, setBattery] = useState(0);
    let [color, setColor] = useState('#0D0D0D');
    let _subscription;

    let sendBattery = async (props, dispatch) => {
        try {
            const newMessage = { body: {battery: battery} }
            const data = await fetchJson.POST(newMessage, constants.createNewMessage(props.threadId))

            try {
                await dispatch({ type: 'ADD_MESSAGES', data: data.data})
            }
            catch(err) {
                console.log("BATTERY COMPONENT ERROR => ", err)
            }
        } catch (error) {
            console.log("Battery Component - getBatteryLevelAsync Error:", error)
        }
    }

    useEffect(() => {
        const _subscribe = async () => {
            let batteryLevel = await Battery.getBatteryLevelAsync();
            setColor(batteryColor(batteryLevel))
            setBattery(batteryPercentage(batteryLevel));

            _subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
                setColor(batteryColor(batteryLevel))
                setBattery(batteryPercentage(batteryLevel));
                console.log('batteryLevel changed!', battery);
            });
        }
        function _unsubscribe() {
            this._subscription && this._subscription.remove();
            this._subscription = null;
        }

        _subscribe().then(() => {
            console.log('Battery Level subscribed.')
        });
        return function() {
            _unsubscribe()
            console.log('Battery Level unsubscribed.')
        }
    }, []);

    return (
        <Button 
            style={{backgroundColor: color}}
            onPress={() => sendBattery(props, dispatch)}
        >
            <Icon style={{color: '#fff'}} name="compass"/>
            <Text style={{color: '#fff'}}>Battery {battery}%</Text>
        </Button>
    );
}

export { BatteryComponent };
