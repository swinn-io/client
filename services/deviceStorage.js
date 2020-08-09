import * as SecureStore from 'expo-secure-store';

export const deviceStorage = {
    
    async setToken(key, value) {
        try {
            SecureStore.setItemAsync(key, value);
            console.log('SecureStorage Key Saved');
        } catch (error) {
            console.log('SecureStorage Save Error: ' + error.message);
        }
    },
    async getToken(key) {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.log('SecureStorage Get Error: ' + error.message);
        }
        return null;
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

export default deviceStorage;