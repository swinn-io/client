const MessageReducer = (messageState, action) => {
    try {
        switch(action.type) {
            case 'SET_THREADS': 
                return {
                    ...messageState,
                    threads: action.payload
                };
            // case 'ADD_THREAD':
            //     //const foundThread =  messageState.threads.find(thd => thd.id === action.action.message.thread_id);
            //     const foundThread =  messageState.threads.find(thd => thd.id === action.action.id);
            //     //console.log("foundThread", foundThread)
            //     if (!foundThread) {
            //         console.log(`Action.action => ${action.action}`);
            //         return {
            //             ...messageState,
            //             messages: ([action.action]).concat(messageState.threads)
            //         };
            //     }
            //     else {
            //         console.log(`Thread with id ${action.action.id} already existed`);
            //         return messageState;
            //     }
            case 'ADD_THREAD_WITH_MESSAGE':
                let foundIndex = -1;
                const foundThread =  messageState.threads.find((thd, index) => {
                    if (thd.thread_id === action.action.message.thread_id) { foundIndex = index };
                    return thd.thread_id === action.action.message.thread_id
                });
                const thread_id = action.action.message.thread_id;
                const subject = action.action.message.thread.subject;
                const message_id = action.action.message.id;
                const message_body = action.action.message.body;
                const newMessageToSave = {
                    thread_id: thread_id,
                    subject: subject,
                    // threadMessages: []
                }
                console.log("NEW MESSAGE TO SAVE", newMessageToSave)

                if (!foundThread) {
                    console.log(`Action.action =>`, action.action);
                    return {
                        ...messageState,
                        messages: ([newMessageToSave]).concat(messageState.threads)
                    };
                }
                else {
                    console.log(`Thread with id ${action.action.message.thread_id} already existed`);

                    // TO DO Add Message to thread
                    // if(foundIndex > -1) {
                    //     let newThreadsArray = [...(messageState.threads)]
                    //     console.log("newThreadsArray", newThreadsArray)
                    //     const foundMessage =  newThreadsArray.find(msg => msg.message_id === action.action.message.id);
                    //     if(!foundMessage) {
                    //         newThreadsArray[foundIndex] = {
                    //             ...newThreadsArray[foundIndex], 
                    //             threadMessages: ([{message_id: message_id, message_body: message_body}]).concat(newThreadsArray[foundIndex].threadMessages ? newThreadsArray[foundIndex].threadMessages : [])
                    //         }
                    //         messageState.threads = newThreadsArray;
                    //         return {
                    //             ...messageState,
                    //             messages: ([newMessageToSave]).concat(messageState.threads)
                    //         };
                    //     }
                    //     else {
                    //         console.log(`Message with message id ${action.action.message.id} already existed`)
                    //     }
                    // }
                    
                    // else {

                    // }

                    // return {
                    //     ...messageState,
                    //     threads: ([newMessageToSave]).concat(messageState.threads)
                    // };
                    console.log("FOUND THREAD", foundThread);
                    return messageState;
                }


            default:
                return messageState;
        }
    } catch (error) {
        console.log("Reducer Error", error)
    }
    
}

export default MessageReducer;