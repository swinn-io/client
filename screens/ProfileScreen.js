import React, { useContext } from 'react';
import { Box, ScrollView, HStack, Text, Pressable } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';

import { CustomHeader } from '../components/common';
import { SignOut } from '../services/userService';
import { AuthContext } from '../services/store/authStore';

export default function ProfileScreen(props) {
  const auth_context = useContext(AuthContext);
  const setUser = auth_context[1];

  const handleLogout = async () => {
    //SignOut comes from App.js Context
    SignOut();
    setUser({
      access_token: null,
    });
  };

  return (
    <Box flex={1}>
      <CustomHeader props={props} />
      <ScrollView>
        <Pressable onPress={handleLogout}>
          <HStack alignItems='center' justifyContent='space-between' p='$3'>
            <Text>Logout</Text>
            <Box bg='#007AFF' p='$2' borderRadius='$sm'>
              <Ionicons name='exit' size={20} color='#fff' />
            </Box>
          </HStack>
        </Pressable>
      </ScrollView>
    </Box>
  );
}
