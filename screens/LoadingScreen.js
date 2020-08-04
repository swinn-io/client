import React, { Component } from 'react';
import { Container } from 'native-base';
import { Loading } from '../components/common';
import deviceStorage from '../services/deviceStorage';

export default class LoadingScreen extends Component {
    
    componentDidMount = async () => {
        try {
            const token = await deviceStorage.getToken();

            // Update the document title using the browser API 
            this.props.navigation.navigate(token ? "App" : "AuthScreen");
            
        }
        catch (error) {
            console.log('SecureStorage Error1: ' + error.message);
        }
    }

    render () {
        return (
            <Container>
                <Loading/>
            </Container>
        );
    }
}
