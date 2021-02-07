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
                console.log("ADD_THREAD => ", action.data)
                // console.log("1 = >>", action.data.attributes)
                // console.log("2 = >>", action.data.attributes.messages[0])

                const thread_id = action.data.id; //It gets notification id from notification instead of thread_id. Must fix!!!!
                const thread_subject = action.data.attributes.subject; //It cannot collect subject from notification, because notification object doesn't have subject. Must fix!!!!

                console.log("THREAD ID => ", thread_id)
                console.log("THREAD SUBJECT => ", thread_subject)


                let tempThreadArray = messageState.threads;

                const foundThread =  tempThreadArray.find(thd => thd.thread_id === thread_id);

                const newThreadToSave = {
                    thread_id: thread_id,
                    subject: thread_subject
                }
                if (!foundThread) {
                    tempThreadArray.unshift(newThreadToSave);
                }

                return {
                    ...messageState,
                    threads: tempThreadArray
                };
            case 'SET_MESSAGES':
                return {
                    ...messageState,
                    messages: action.payload
                };
            case 'ADD_MESSAGES':

                const add_message_data = action.data;
                const msg_id = add_message_data.id;
                const thd_id = add_message_data.attributes.thread_id;
                const msg_body = add_message_data.attributes.body;

                // console.log("add_message_data", add_message_data)

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