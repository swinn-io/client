const SocketReducer = (socketState, action) => {
    try {
        switch(action.type) {
            case 'TEST_1': 
                console.log("TEST_1 Reducer => ", action.data)
                return {
                    socketState
                };
            case 'TEST_2':
                console.log("TEST_2 Reducer => ", action.data)
                return {
                    socketState
                };
            default:
                return socketState;
        }
    } catch (error) {
        console.log("Reducer Error", error)
    }
    
}

export default SocketReducer;