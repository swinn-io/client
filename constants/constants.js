module.exports = {

    //Root
    root: 'https://swinn.io',
    //Echo
    echoServer: 'https://swinn.io',
    echoServerPort: '6001',
    //Secret
    secret: 'secret',

    //Auth
    authorizationEndpoint(){return this.root + '/login'},
    tokenEndpoint(){return this.root + '/oauth/token'},
    revocationEndpoint(){return this.root + '/oauth/revoke'},

    //User
    contactUserEndpoint(){return this.root + '/api/user'},
    profileEndpoint(){return this.root + '/api/user/me'},
    userEndpoint(id){return `${this.root}/api/user/${id}`},

    //Message
    getSingleMessage(id){return this.root + `/api/message/${id}`},
    createNewMessage(id){return this.root + `/api/message/${id}`},


    //Thread
    getAllMessages(){return this.root + '/api/message'},
    createNewThread(){return this.root + `/api/message`},

    //Contacts
    getAllContacts(){return this.root + `/api/contact`},
    getSingleContact(){return this.root + `/api/contact/${id}`},
    addContact(user_id){return this.root + `/api/contact/${user_id}`}


    
}
