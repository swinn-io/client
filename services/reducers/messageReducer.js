const MessageReducer = (messageState, action) => {
    try {
        switch(action.type) {
            case null:
                return messageState;
            case 'SET_THREADS': 
                return {
                    ...messageState,
                    threads: action.payload
                };
            case 'ADD_THREAD':
                return AddThread(messageState, action);
            case 'SET_MESSAGES':
                return {
                    ...messageState,
                    messages: action.payload
                };
            case 'ADD_MESSAGES':
                return AddMessage(messageState, action);
                
            default:
                return messageState;
        }
    } catch (error) {
        console.log("Reducer Error", error)
    }
    
}

const AddMessage = (messageState, action) => {
    const add_message_data = action.data;
    const msg_id = add_message_data.id;
    const thd_id = add_message_data.attributes.thread_id;
    const msg_body = add_message_data.attributes.body;

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
}

const AddThread = (messageState, action) => {

    const thread_id = action.data.id;
    const thread_subject = action.data.attributes.subject;
    const thread_attributes = action.data.attributes;

    let tempThreadArray = messageState.threads;

    const foundThread =  tempThreadArray.find(thd => thd.thread_id === thread_id);

    const newThreadToSave = {
        thread_id: thread_id,
        subject: thread_subject,
        thread_attributes: thread_attributes
    }

    if (!foundThread) {
        tempThreadArray.unshift(newThreadToSave);
    }

    return {
        ...messageState,
        threads: tempThreadArray
    };
}

export default MessageReducer;