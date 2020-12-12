const MessageReducer = (messageState, action) => {
    try {
        switch(action.type) {
            case 'SET_THREADS': 

                //let threads 
                return {
                    ...messageState,
                    threads: action.payload
                };
            case 'ADD_THREAD':
                const foundThread =  messageState.threads.find(thd => thd.thread_id === action.action.message.thread_id);
                const thread_id = action.action.message.thread_id;
                const thread_subject = action.action.message.thread.subject;
                const newThreadToSave = {
                    thread_id: thread_id,
                    subject: thread_subject
                }
                if (!foundThread) {
                    return {
                        ...messageState,
                        threads: ([newThreadToSave]).concat(messageState.threads)
                    };
                }
                else {
                    // console.log(`Thread with id ${action.action.message.thread_id} already existed`);
                    return messageState;
                }
            case 'SET_MESSAGES':
                return {
                    ...messageState,
                    messages: action.payload
                };
            case 'ADD_MESSAGES':
                // console.log("ADD_MESSAGES", action.action);
                const thd_id = action.action.message.thread_id;
                const msg_id = action.action.message.id;
                const msg_body = action.action.message.body;

                let tempArray = messageState.messages;
                const newMessageToSave = {
                    id: msg_id,
                    body: msg_body,
                    thread_id: thd_id,
                }
                if(thd_id in tempArray) {
                    
                    const foundMessage =  tempArray[thd_id].find(msg => msg.id === msg_id);
                    if(!foundMessage) { tempArray[thd_id].unshift(newMessageToSave); }
                }
                return {
                    ...messageState,
                    messages: tempArray
                };
                
            default:
                return messageState;
        }
    } catch (error) {
        console.log("Reducer Error", error)
    }
    
}

export default MessageReducer;