const MessageReducer = (messageState, action) => {
    try {

        console.log("ACTION TYPE", action.type);
        switch(action.type) {
            case 'SET_MESSAGES': 
                return {
                    ...messageState,
                    messages: action.payload
                };
            case 'ADD_MESSAGE':
                console.log("PAYLOAD: ", action.action)
                return {
                    ...messageState,
                    messages: messageState.messages.concat(action.action)
                };
            default:
                return messageState;
        }
    } catch (error) {
        console.log("Reducer Error", error)
    }
    
}

export default MessageReducer;