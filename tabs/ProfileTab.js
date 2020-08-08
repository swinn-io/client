import React from 'react';
import {Button, Content, Icon, ListItem, Left, Body, Right, Switch, Text, Thumbnail, Separator} from 'native-base';
import {StyleSheet} from "react-native";
export default function ProfileTab() {
    return (
        <Content>
            <Thumbnail style={styles.logo} source={{ uri: 'https://via.placeholder.com/200x200' }}/>
            <Text style={styles.logoText}>John Doe</Text>
            <Separator bordered>
                <Text>Customize</Text>
            </Separator>
            <ListItem icon>
                <Left>
                    <Button style={{ backgroundColor: "#FF9501" }}>
                        <Icon active name="plug" type='FontAwesome5' />
                    </Button>
                </Left>
                <Body>
                    <Text>Discovery</Text>
                </Body>
                <Right>
                    <Switch value={true} />
                </Right>
            </ListItem>
            <ListItem icon>
                <Left>
                    <Button style={{ backgroundColor: "#007AFF" }}>
                        <Icon active name="database" type='FontAwesome5' />
                    </Button>
                </Left>
                <Body>
                    <Text>Data Types</Text>
                </Body>
                <Right>
                    <Text>All</Text>
                    <Icon active name="arrow-forward" />
                </Right>
            </ListItem>
            <ListItem icon>
                <Left>
                    <Button style={{ backgroundColor: "#007AFF" }}>
                        <Icon active name="life-ring" type='FontAwesome5' />
                    </Button>
                </Left>
                <Body>
                    <Text>S.O.S. Contacts</Text>
                </Body>
                <Right>
                    <Text>5 People</Text>
                    <Icon active name="arrow-forward" />
                </Right>
            </ListItem>
        </Content>
    );
}

const styles = StyleSheet.create({
    logo: {
        height: 110,
        width: 110,
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: 5,
    },
    logoText: {
        fontSize: 20,
        color: '#005984',
        textAlign: 'center',
        paddingTop: 10,
        paddingBottom: 10
    }
});
