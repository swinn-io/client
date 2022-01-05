import React, { useEffect, useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { Icon, Container, Text } from 'native-base';

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

const prefix1 = Linking.makeUrl('/');

export default App = () => {
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
          if (founduser) {
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

  if (!isAuthCompleted) {
    return <LoadingScreen></LoadingScreen>;
  } else {
    return (
      <AuthStore user={[user, setUser]}>
        <EchoStore>
          <MessageStore>
            <NavigationContainer
              linking={linking}
              fallback={<LoadingScreen></LoadingScreen>}
            >
              {user.access_token ? <MainStack /> : <AuthStack />}
            </NavigationContainer>
          </MessageStore>
        </EchoStore>
      </AuthStore>
    );
  }
};
