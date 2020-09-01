import React, { useState } from 'react';
import { Container, Text, Content }  from 'native-base';
import { CustomHeader } from '../components/common'

export default function MessageScreen (props) {

    const { messageId } = props.route.params

    return (
        <Container>
            <CustomHeader/>
            <Content>
                <Text>
                    { messageId }
                </Text>
            </Content>
        </Container>
    );  
       
}
