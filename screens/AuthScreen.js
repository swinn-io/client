import { StatusBar } from 'expo-status-bar';
import React, { useContext, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Box, Button, ButtonText } from '@gluestack-ui/themed';
import constants from '../constants/constants';
import config from '../config/env';

import { AuthContext } from '../services/store/authStore';
import { SignIn, GetProfile } from '../services/userService';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: constants.authorizationEndpoint(),
  tokenEndpoint: constants.tokenEndpoint(),
  revocationEndpoint: constants.revocationEndpoint(),
};

export default function AuthScreen() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: config.auth.clientId,
      scopes: ['*'],
      // Use the app's own scheme with a path so the token redirect is an
      // absolute deep link (e.g. swinn://oauthredirect) the OS hands back to
      // the app — a bare `exp://` was being resolved as a relative URL on the
      // API host, producing https://swinn.me/exp: (404).
      redirectUri: makeRedirectUri({ scheme: 'swinn', path: 'oauthredirect' }),
    },
    discovery
  );

  const auth_context = useContext(AuthContext);
  const setUser = auth_context[1];

  useEffect(() => {
    try {
      if (response !== null) {
        if (response?.type === 'success') {
          const { code } = response.params;
        } else {
          console.log('Unsuccessful login');
        }
      } else {
        console.log('Null response');
      }
    } catch (error) {
      console.log('Response error:', error);
    }
  }, [response]);

  const handleSignup = async () => {
    try {
      promptAsync().then(async (res) => {
        try {
          let user = res.params;
          if (user.access_token) {
            console.log('Logged in.');
            // Persist the token first so GetProfile can authenticate,
            // then fetch the profile and store the full { token, user } shape
            // the app expects (userState.user.id).
            await SignIn(user);
            const profile = await GetProfile();
            const fullUser = { ...user, user: profile };
            await SignIn(fullUser);
            setUser(fullUser);
          }
        } catch (e) {
          console.error(e);
        }
      });
    } catch (error) {
      console.log('Handle Login Error', error);
    }
  };

  return (
    <Box flex={1} justifyContent='center'>
      <Button alignSelf='center' onPress={handleSignup}>
        <ButtonText>Login</ButtonText>
      </Button>
      <StatusBar style='auto' />
    </Box>
  );
}
