const config = require('../config/env').default;

module.exports = {
  //Root
  root: config.api.root,
  //Echo (kept for backward compat; echoStore now uses config.reverb directly)
  echoServer: config.reverb.host,
  echoServerPort: String(config.reverb.port),
  //Secret
  secret: 'secret',

  //Auth
  authorizationEndpoint() {
    return this.root + '/login';
  },
  tokenEndpoint() {
    return this.root + '/oauth/token';
  },
  revocationEndpoint() {
    return this.root + '/oauth/revoke';
  },

  //User
  contactUserEndpoint() {
    return this.root + '/api/user';
  },
  profileEndpoint() {
    return this.root + '/api/user/me';
  },
  userEndpoint(id) {
    return `${this.root}/api/user/${id}`;
  },

  //Message
  getSingleMessage(id) {
    return this.root + `/api/message/${id}`;
  },
  createNewMessage(id) {
    return this.root + `/api/message/${id}`;
  },

  //Thread
  getAllMessages() {
    return this.root + '/api/message';
  },
  createNewThread() {
    return this.root + `/api/message`;
  },

  //Contacts
  getAllContacts() {
    return this.root + `/api/contact`;
  },
  getSingleContact(id) {
    return this.root + `/api/contact/${id}`;
  },
  addSingleContact(id) {
    return this.root + `/api/contact/${id}`;
  },
};
