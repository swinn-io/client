import React, {createContext, useState, useContext} from "react";
import Echo from "laravel-echo";
import socketio from 'socket.io-client';

import { AuthContext } from './authStore';
import constants from "../../constants/constants";

const EchoStore = ({children}) => {

    const [userState] = useContext(AuthContext);
    
    const echo = new Echo({
        broadcaster: 'socket.io',
        client: socketio,
        authEndpoint: constants.echoServer +  '/broadcasting/auth',
        host: constants.echoServer + ':' + constants.echoServerPort,
        auth: {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${userState.access_token}`,
            }
        },
    });

    const [echoState, setEchoState] = useState(echo)

    return (
        <EchoContext.Provider value={[echoState, setEchoState]}>
            {children}
        </EchoContext.Provider>
    )
}

export const EchoContext = createContext();
export default EchoStore;