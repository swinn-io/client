// Hooks/UseUser.js

import React, { createContext, useContext, useEffect, useState } from 'react';
import deviceStorage from '../services/deviceStorage';

function getCurrentUser(accessToken) {
  if (accessToken  === 'awesomeAccessToken123456789') {
    return {
      name: 'Thomas',
    };
  }
}

 

const initialState = {
  user: {},
  accessToken: undefined,
};

const UserContext = createContext(initialState);

export function UserProvider({ children }) {

  const [accessToken, setAccessToken] = useState(deviceStorage.getToken('access_token'));
  const [user, setUser] = useState({});

  function handleAccessTokenChange() {

    if (!user.name && accessToken) {
        deviceStorage.saveToken('access_token', accessToken);
        const user = getCurrentUser(accessToken);
        setUser(user);
    } else if (!accessToken) {

      // Log Out
      deviceStorage.removeToken('access_token');
      setUser({});
    }

  }

  useEffect(() => {
    handleAccessTokenChange();
  }, [accessToken]);

 

  return (
    <UserContext.Provider value={{ user, accessToken, setAccessToken }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);