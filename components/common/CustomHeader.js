import React, { useState, useContext } from 'react';
import { Box, HStack, Heading, Button } from '@gluestack-ui/themed';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { EchoContext } from '../../services/store/echoStore';

//Imported for testing
import * as Updates from 'expo-updates';

const CustomHeader = (route) => {
  const { isSub, threadTitle } = route;

  const [headerTitle] = useState(threadTitle ? threadTitle : 'Swinn');
  const [echoState] = useContext(EchoContext);

  return (
    <HStack
      alignItems='center'
      justifyContent='space-between'
      px='$3'
      py='$2'
      bg='$backgroundLight0'
    >
      <Box flexBasis='10%'>
        {isSub ? (
          <Button variant='link' onPress={() => route.props.navigation.goBack()}>
            <Ionicons name='chevron-back' size={24} />
          </Button>
        ) : null}
      </Box>
      <Box flexBasis='80%' alignItems='center'>
        <Heading>{headerTitle}</Heading>
      </Box>
      <Box flexBasis='10%' alignItems='flex-end'>
        <Button
          variant='link'
          onPress={() => {
            Updates.reloadAsync();
          }}
        >
          <FontAwesome5
            name={'circle'}
            solid
            style={{
              fontSize: 20,
              color: echoState.connectionStatus() === 'connected' ? 'green' : 'red',
            }}
          />
        </Button>
      </Box>
    </HStack>
  );
};

export { CustomHeader };
