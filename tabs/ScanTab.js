import React, { useState, useEffect } from 'react';
import {Body, Button, Content, Icon, Left, ListItem, Right, Separator, Switch, Text} from 'native-base';
import { Dimensions, StyleSheet, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import QRCode from "react-native-qrcode-svg";

export default function ScanTab() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(data);
        setIsEnabled(false);
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    let section = () => {
        let screenWidth = Dimensions.get("window").width;
        let logoFromFile = require('../assets/favicon.png');
        return isEnabled ?
            (
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
                    style={StyleSheet.absoluteFillObject}
                />
            )
            :
            (
                <QRCode
                    value="Address URI to ping current user"
                    size={screenWidth-70}
                    logo={logoFromFile}
                    logoSize={50}
                    style={{
                        alignSelf: 'stretch',
                        textAlign: 'center',
                    }}
                />
            )
    }

    return (
        <Content style={{
            flex: 1,
            flexDirection: 'column',
        }}>
            <ListItem style={{marginLeft: 0}}>
                <Body>
                    <Text>Scan Mode</Text>
                </Body>
                <Right>
                    <Switch value={isEnabled} onValueChange={toggleSwitch} />
                </Right>
            </ListItem>
            {scanned &&
                <ListItem style={{marginLeft: 0}} onPress={() => setScanned(false)}>
                    <Body>
                        <Text>Scan Again</Text>
                    </Body>
                </ListItem>
            }
            <Text>{scanned}</Text>
            <View style={{
                marginLeft: 30,
                marginRight: 30,
                borderWidth: 5,
                borderColor: '#cccccc',
                flex: 1,
                aspectRatio: 1,
            }}>
                {section(scanned)}
            </View>
        </Content>
    );
}


const styles = StyleSheet.create({
    QRCode: {
        flex: 1,
    },
});
