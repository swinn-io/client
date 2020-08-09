import React from 'react';
import {Button, Content, Icon, ListItem, Left, Body, Right, Switch, Text, Thumbnail, Separator} from 'native-base';
import {StyleSheet} from "react-native";
export default function ProfileTab( props ) {
    return (
        <Content>
            <Thumbnail style={styles.logo} square source={{ uri: 'https://via.placeholder.com/200x200' }}/>
            <Text style={styles.logoText}>John Doe</Text>
            <Separator bordered />
            <ListItem icon>
                <Left>
                    <Button style={{ backgroundColor: "#FF9501" }}>
                        <Icon active name="access-point" type="MaterialCommunityIcons" />
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
                        <Icon active name="database" type='MaterialCommunityIcons' />
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
                        <Icon active name="lifebuoy" type='MaterialCommunityIcons' />
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
            <Separator bordered />
            <ListItem icon>
                <Left>
                    <Button style={{ backgroundColor: "#000000" }}>
                        <Icon active name="weather-night" type='MaterialCommunityIcons' />
                    </Button>
                </Left>
                <Body>
                    <Text>Dark Mode</Text>
                </Body>
                <Right>
                    <Switch value={false} />
                </Right>
            </ListItem>
            <ListItem icon>
                <Left>
                    <Button style={{ backgroundColor: "#007AFF" }}>
                        <Icon active name="information-outline" type='MaterialCommunityIcons' />
                    </Button>
                </Left>
                <Body>
                    <Text>About Ping Pong</Text>
                </Body>
                <Right />
            </ListItem>
            <ListItem icon>
                <Left>
                    <Button style={{ backgroundColor: "#007AFF" }}>
                        <Icon active name="share-variant" type='MaterialCommunityIcons' />
                    </Button>
                </Left>
                <Body>
                    <Text>Share Ping Pong</Text>
                </Body>
                <Right />
            </ListItem>
            <ListItem icon onPress={() => { props.logout(); }}>
                <Left>
                    <Button style={{ backgroundColor: "#007AFF" }}>
                        <Icon active name="logout" type='MaterialCommunityIcons' />
                    </Button>
                    
                </Left>
                <Body>
                    <Text>Logout</Text>
                </Body>
                <Right />
            </ListItem>
            <ListItem icon>
                <Left>
                    <Button style={{ backgroundColor: "red" }}>
                        <Icon active name="delete" type='MaterialCommunityIcons' />
                    </Button>
                </Left>
                <Body>
                    <Text>Delete my account</Text>
                </Body>
                <Right />
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
