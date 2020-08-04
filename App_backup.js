import {StatusBar} from 'expo-status-bar';
import React, { Component } from 'react';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, useAuthRequest} from 'expo-auth-session';
import { StyleSheet } from 'react-native';
import { Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Badge } from 'native-base';
import FriendList from './components/FriendList';
import { Loading } from './components/common';


//Screen imports
import Auth from './screens/AuthScreen';
import LoggedIn from './screens/LoggedIn';


//Navigation imports
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
    authorizationEndpoint: 'http://192.168.1.103/login',
    tokenEndpoint: 'http://192.168.1.103/oauth/token',
    revocationEndpoint: 'http://192.168.1.103/oauth/revoke',
};



export default class App extends Component {

    // const [request, response, promptAsync] = useAuthRequest(
    //     {
    //         clientId: '',
    //         scopes: [],
    //         redirectUri: makeRedirectUri({
    //             native: 'exp://redirect',
    //             useProxy: false
    //         }),
    //     },
    //     discovery
    // );

    // React.useEffect(() => {
    //     if(response !== null) {
    //         if (response?.type === 'success') {
    //             const {code} = response.params;
    //         }
    //     }
    // }, [response]);



    constructor() {
      super();
      this.state = {
        token: '',
      }
    }
  
    render() {
       if (!this.state.token) {
        return (
          <Auth />
        );
      } else if (this.state.token) {
        return (
          <LoggedIn />
        );
      }
    }
  }



// export default function App() {
    

//     return (
//         // <View style={styles.container}>
//         //     <Text>Ping Pong Application</Text>
//         //     <Button
//         //         disabled={!request}
//         //         title="Login"
//         //         onPress={() => {
//         //             promptAsync().then((r) => console.log(r));
//         //         }}
//         //     />
//         //     {response && <Text>Hello {response.params.callback.name}!</Text>}
//         //     <StatusBar style="auto"/>
//         // </View>
//         // <FriendList>
//         //     {/* <Loading size={'large'} /> */}
//         // </FriendList>

        
//     );
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
