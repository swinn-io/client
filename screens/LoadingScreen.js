import React from 'react';
import { Box } from '@gluestack-ui/themed';
import { Loading } from '../components/common';

export default function LoadingScreen() {
  return (
    <Box flex={1}>
      <Loading />
    </Box>
  );
}
