module.exports = {

    //Root
    root: 'http://192.168.1.38',

    //Secret
    secret: 'secret',

    //Auth
    authorizationEndpoint(){return this.root + '/login'},
    tokenEndpoint(){return this.root + '/oauth/token'},
    revocationEndpoint(){return this.root + '/oauth/revoke'},

    //Message
    getAllMessages(){return this.root + '/api/message'},
    getSingleMessage(id){return this.root + `/api/message/${id}`},
    
}