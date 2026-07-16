import React, { createContext, useState, useContext } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';

import { AuthContext } from './authStore';
import config from '../../config/env';

// laravel-echo's Pusher/Reverb connector expects a global Pusher (no window in RN).
global.Pusher = Pusher;

const EchoStore = ({ children }) => {
  const [userState] = useContext(AuthContext);

  // Construct the Echo instance once (lazy init), not on every render.
  const [echoState, setEchoState] = useState(() => {
    const echo = new Echo({
      broadcaster: 'reverb',
      key: config.reverb.key,
      wsHost: config.reverb.host,
      wsPort: config.reverb.port,
      wssPort: config.reverb.port,
      forceTLS: config.reverb.forceTLS,
      enabledTransports: ['ws', 'wss'],
      disableStats: true,
      authEndpoint: `${config.api.root}/broadcasting/auth`,
      auth: {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${userState.access_token}`,
        },
      },
    });

    const conn = echo.connector?.pusher?.connection;
    if (conn) {
      conn.bind('connected', () => console.log('[reverb] connected', echo.socketId()));
      conn.bind('error', (err) => console.log('[reverb] error', err));
      conn.bind('unavailable', () => console.log('[reverb] unavailable'));
      conn.bind('disconnected', () => console.log('[reverb] disconnected'));
    }

    return echo;
  });

  return (
    <EchoContext.Provider value={[echoState, setEchoState]}>
      {children}
    </EchoContext.Provider>
  );
};

export const EchoContext = createContext();
export default EchoStore;
