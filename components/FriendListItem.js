import React from 'react';
import {
  HStack,
  VStack,
  Avatar,
  AvatarImage,
  Text,
  Button,
} from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';

export default function FriendListItem(props) {
  return (
    <HStack alignItems='center' space='md' p='$2'>
      <Avatar>
        <AvatarImage source={{ uri: props.uri }} />
      </Avatar>
      <VStack flex={1}>
        <Text>{props.name}</Text>
      </VStack>
      <Button>
        <Ionicons name='navigate' size={20} color='#fff' />
      </Button>
    </HStack>
  );
}
