import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';

//Screen Imports
import LoadingScreen from './screens/LoadingScreen';

//Stack Imports
// import MenuStack from './stacks/MenuStack';
import MainStack from './stacks/MainStack';
// import BottomTabs from './stacks/BottomTabs';
import AuthStack from './stacks/AuthStack';

//Store Imports
import MessageStore from './services/store/messageStore';
import AuthStore from './services/store/authStore';
import EchoStore from './services/store/echoStore';

//Helper Functions Imports
import { isEmpty } from './services/helperFunctions';

import { GetUser, SignOut } from './services/userService';

import * as Linking from 'expo-linking';
import * as SplashScreen from 'expo-splash-screen';

const prefix1 = Linking.createURL('/');

const App = () => {
  const linking = {
    prefixes: [
      prefix1,
      //  prefix2
    ],
    config: {
      screens: {
        friends: {
          screens: {
            add: {
              path: '/friends/add/:id?',
              parse: {
                id: (id) => id,
              },
              stringify: {
                id: (id) => id.replace(/^user-/, ''),
              },
            },
          },
        },
      },
    },
  };

  const [user, setUser] = useState({});
  const [isAuthCompleted, setIsAuthCompleted] = useState(false);

  const handleAuth = async () => {
    if (isEmpty(user)) {
      GetUser()
        .then((founduser) => {
          // Only treat a restored session as authenticated if it has both a
          // token and a populated profile (userState.user.id is read across the
          // app). A stale user (token only, pre-profile-fetch) routes to login
          // instead of crashing the home screen.
          if (founduser && founduser.access_token && founduser.user?.id) {
            setUser(founduser);
          } else {
            setUser({ access_token: null });
          }
          setIsAuthCompleted(true);
        })
        .catch((error) => console.log('APP handle auth error', error.message));
    }
  };

  useEffect(() => {
    handleAuth();
  }, [user]);

  // SDK 50+ keeps the native splash up until explicitly hidden; hide it once
  // the initial auth check resolves so the app UI becomes visible.
  useEffect(() => {
    if (isAuthCompleted) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isAuthCompleted]);

  if (!isAuthCompleted) {
    return (
      <GluestackUIProvider config={config}>
        <LoadingScreen></LoadingScreen>
      </GluestackUIProvider>
    );
  } else {
    return (
      <GluestackUIProvider config={config}>
        <AuthStore user={[user, setUser]}>
          <EchoStore>
            <MessageStore>
              <NavigationContainer
                linking={linking}
                fallback={<LoadingScreen></LoadingScreen>}
              >
                {user.access_token && user.user?.id ? (
                  <MainStack />
                ) : (
                  <AuthStack />
                )}
              </NavigationContainer>
            </MessageStore>
          </EchoStore>
        </AuthStore>
      </GluestackUIProvider>
    );
  }
};

export default App;
