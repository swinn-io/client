import React from 'react';
import { Content, Icon, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import {StyleSheet} from "react-native";
export default function PingedTab() {
    return (
        <Content>
            <List>
                <ListItem itemDivider>
                    <Text>A</Text>
                </ListItem>
                <ListItem avatar>
                    <Left>
                        <Thumbnail source={{ uri: 'https://via.placeholder.com/200x200' }} />
                    </Left>
                    <Body>
                        <Text>Aaron</Text>
                        <Text note>Doing what you like will always keep you happy . .</Text>
                    </Body>
                    <Right>
                        <Text note>3:43 pm</Text>
                        <Icon name='arrow-alt-circle-left' style={styles.pinged} type='FontAwesome5' />
                    </Right>
                </ListItem>
                <ListItem avatar>
                    <Left>
                        <Thumbnail source={{ uri: 'https://via.placeholder.com/200x200' }} />
                    </Left>
                    <Body>
                        <Text>Adam</Text>
                        <Text note>Doing what you like will always keep you happy . .</Text>
                    </Body>
                    <Right>
                        <Text note>3:43 pm</Text>
                        <Icon name='arrow-alt-circle-right' style={styles.ponged} type='FontAwesome5' />
                    </Right>
                </ListItem>
                <ListItem itemDivider>
                    <Text>B</Text>
                </ListItem>
                <ListItem avatar>
                    <Left>
                        <Thumbnail source={{ uri: 'https://via.placeholder.com/200x200' }} />
                    </Left>
                    <Body>
                        <Text>Baris</Text>
                        <Text note>Doing what you like will always keep you happy . .</Text>
                    </Body>
                    <Right>
                        <Text note>3:43 pm</Text>
                        <Icon name='arrow-alt-circle-right' style={styles.ponged} type='FontAwesome5' />
                    </Right>
                </ListItem>
                <ListItem avatar>
                    <Left>
                        <Thumbnail source={{ uri: 'https://via.placeholder.com/200x200' }} />
                    </Left>
                    <Body>
                        <Text>Burak</Text>
                        <Text note>Doing what you like will always keep you happy . .</Text>
                    </Body>
                    <Right>
                        <Text note>3:43 pm</Text>
                        <Icon name='arrow-alt-circle-left' style={styles.pinged} type='FontAwesome5' />
                    </Right>
                </ListItem>
            </List>
        </Content>
    );
}

const styles = StyleSheet.create({
    pinged: {
        color: 'orange',
    },
    ponged: {
        color: 'green',
    },
});
