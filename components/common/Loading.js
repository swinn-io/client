import React from 'react';
import { Box, Spinner } from '@gluestack-ui/themed';

const Loading = ({ size }) => {
  return (
    <Box flex={1} justifyContent='center' alignItems='center'>
      <Spinner size={size} />
    </Box>
  );
};

export { Loading };
