import React from 'react';
import { Box, VStack } from '@gluestack-ui/themed';
import FriendListItem from './FriendListItem';

export default function FriendList(items) {
  const data = Array.isArray(items?.data) ? items.data : [];
  return (
    <Box flex={1}>
      <VStack>
        {data.map((item) => (
          <FriendListItem key={item.id} {...item} />
        ))}
      </VStack>
    </Box>
  );
}
