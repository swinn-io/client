import React, {useState, useEffect} from 'react';
import {
    Container, Text, Content, Form, Item, Input, Left, Right,
    Button, Icon, List, ListItem,
    Thumbnail, Body, Footer, Fab
} from 'native-base';
import {StyleSheet} from 'react-native'

import constants from '../constants/constants';
import fetchJson from '../services/fetchJson';
import {CustomHeader} from '../components/common'

export default function MessageScreen(props) {

    const {messageId, messageTitle} = props.route.params
    const [newMessage, setNewMessage] = useState("")
    const [messageHistory, setMessageHistory] = useState([])
    const [active, setActive] = useState(false)
    useEffect(() => {

        const parent = props.navigation.dangerouslyGetParent();

        //Hide Tab Bar
        parent.setOptions({
            tabBarVisible: false
        });

        retrieveMessage()

        //Unhide Tab Bar
        return () =>
            parent.setOptions({
                tabBarVisible: true
            });
    }, [])

    const retrieveMessage = async () => {

        try {
            let messageHistory = await fetchJson.GET(constants.getSingleMessage(messageId));
            setMessageHistory(messageHistory.data.attributes.messages);
        } catch (error) {
            console.log("Message Retrieve Error:", error)
        }

    }

    const handleNewMessage = async () => {

        try {
            //await fetchJson.POST(constants.getSingleMessage(messageId));

            setNewMessage("");
        } catch (error) {
            console.log("Message Retrieve Error:", error)
        }
    }

    const renderRow = (message) => {

        //TO-DO parse messages

        return (
            <ListItem thumbnail
                // onPress={() => {

                // }}
            >
                <Left>
                    <Thumbnail
                        source={{uri: 'https://www.pngitem.com/pimgs/m/581-5813504_avatar-dummy-png-transparent-png.png'}}/>
                </Left>
                <Body>
                    <Text>{JSON.stringify(message.attributes.body)}</Text>
                    {/* <Text note>{message.attributes.body[1]}</Text> */}
                </Body>
            </ListItem>
        );
    }

    return (
        <Container>
            <CustomHeader isSub={true} messageTitle={messageTitle} props={props}/>
            <List
                dataArray={messageHistory}
                keyExtractor={messageHistory => messageHistory.id}
                renderRow={(message) => renderRow(message)}
            >
            </List>
            {/* <Footer style={styles.bottom}>
                <Item>
                    <Input
                        placeholder='Write a message'
                        onChangeText={text => setNewMessage(text)}
                        value={newMessage}
                    />
                    <Button
                        onPress={handleNewMessage}
                    >
                        <Icon name='send' />
                    </Button>
                </Item>
            </Footer> */}
            <Fab
                active={active}
                direction="up"
                containerStyle={{}}
                style={{backgroundColor: '#5067FF'}}
                position="bottomRight"
                onPress={() => setActive(!active)}
            >
                <Icon name="add"/>
                <Button style={{backgroundColor: '#F2786D'}}>
                    <Icon name="cellular"/>
                </Button>
                <Button style={{backgroundColor: '#4B58A6'}}>
                    <Icon name="compass"/>
                </Button>
            </Fab>
        </Container>
    );

}


const styles = StyleSheet.create({
    bottom: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
