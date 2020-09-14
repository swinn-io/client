import * as SecureStore from 'expo-secure-store';
import constants from '../constants/constants';

const deviceStorage = {
    
    async saveUser(user) {
        try {
            let stringifiedUser = JSON.stringify(user);
            await SecureStore.setItemAsync('user', stringifiedUser);
            // console.log('User stringified: ', stringifiedUser);
            console.log('SecureStrorage User Saved');
        } catch (error) {
            console.log('SecureStorage Save User Error: ' + error.message);
        }
    },
    async getUser() {
        try {
            let obtainedUser = await SecureStore.getItemAsync('user');
            let jsonUser = JSON.parse(obtainedUser);
            // console.log('User converted to JSON :', jsonUser);
            return jsonUser;
        } catch (error) {
            console.log('SecureStorage Get Error: ' + error.message);
        }
    },
    async removeUser() {
        try {
            await SecureStore.deleteItemAsync('user')
            console.log('SecureStorage User Deleted');
        } catch (error) {
            console.log('SecureStorage Delete Error: ' + error.message);
        }
    },

};

export default deviceStorage;