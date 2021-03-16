import React, {createContext, useReducer} from "react";
import MessageReducer from '../reducers/messageReducer'

const initialState = {
    threads: [],
    messages: []
}

const MessageStore = ({children}) => {
    const [messageState, dispatch] = useReducer(MessageReducer, initialState);
    return (
        <MessageContext.Provider value={[messageState, dispatch]}>
            {children}
        </MessageContext.Provider>
    )
}

export const MessageContext = createContext(initialState);
export default MessageStore;