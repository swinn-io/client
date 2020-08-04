import * as SecureStore from 'expo-secure-store';

export const deviceStorage = {
    
    async saveToken(key, value) {
        try {
            SecureStore.setItemAsync(key, value);
            console.log('SecureStorage Key Saved');
        } catch (error) {
            console.log('SecureStorage Save Error: ' + error.message);
        }
    },
    async getToken() {
        try {
            return await SecureStore.getItemAsync('access_token');
        } catch (error) {
            console.log('SecureStorage Get Error: ' + error.message);
        }
    },
    async removeToken(key) {
        try {
            SecureStore.deleteItemAsync(key)
            console.log('SecureStorage Key Deleted');
        } catch (error) {
            console.log('SecureStorage Delete Error: ' + error.message);
        }
    },

};

//export default deviceStorage;