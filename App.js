import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';

//Screen Imports
import LoadingScreen from './screens/LoadingScreen';

import { AuthStack, BottomTabs } from './stacks'
import { AuthContext } from './services/context';

import deviceStorage from './services/deviceStorage';

export default App = () => {

    const [isLoading, setIsLoading] = React.useState(true);
    const [user, setUser] = React.useState({});

    const authContext = React.useMemo(() => ({
        signIn: async ( user ) => {
          try {
            if( !isEmpty( user )){
              await deviceStorage.saveUser(user);
              setUser(user);
            }
          } catch (error) {
            console.log("SignIn Error", error);
          }
        },
        signOut: async () => {
          try {
            await deviceStorage.removeUser();
            setUser({});
          } catch (error) {
            console.log("SignOut Error", error);
          }
        },
        getUser: async () => {
          try {
            let user = await deviceStorage.getUser()
            return user;
          } catch (error) {
            console.log("GetUser Error", error);
          }
        },
    }));

    const isEmpty = (obj) => {
      return Object.entries(obj).length === 0 && obj.constructor === Object;
    }

    const handleUser = async () => {
      try {
        const user = await deviceStorage.getUser();
        if ( user ) {
          setUser(user);
        }
        setIsLoading(false);
      } catch (error) {
        console.log("handleUser", error);
      }
    }

    useEffect(() => {
      handleUser();
    }, []);


    if ( isLoading ){
      return (
        <LoadingScreen></LoadingScreen>
      );
    }
    else {
      if ( user.access_token ) {
        return (
          <AuthContext.Provider value={authContext}>
              <NavigationContainer>
                  <BottomTabs />
              </NavigationContainer>
          </AuthContext.Provider>
        ); 
      }
      else {
        return (
          <AuthContext.Provider value={authContext}>
            <NavigationContainer>
              <AuthStack/>
            </NavigationContainer>
          </AuthContext.Provider>
        );
      }
    }


    
    
}
