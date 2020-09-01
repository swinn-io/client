import React from 'react';
import { StyleSheet, View} from 'react-native';
import { Container, Header, Title, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Badge, Icon, Item } from 'native-base';
import FriendListItem from './FriendListItem';

export default function FriendList( items ) {
    return (
        <Container>
            <List
                data={items}
                renderRow={(item) =>
                    <FriendListItem>
                        <Text>{item.id}</Text>
                    </FriendListItem>
                }>
            </List>
        </Container>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
