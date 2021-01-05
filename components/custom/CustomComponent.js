
import React, { useState } from 'react';
// import { Button, Icon, Text } from 'native-base';
import * as NativeBase from 'native-base';
import * as Location from 'expo-location';

import * as ReactNative from 'react-native'

import constants from '../../constants/constants';
import fetchJson from '../../services/fetchJson';




let dummyJson = {
    name: "Mood",
    icon: "sunny",
    type: "Button",
    onPress: (modalVisibility, setModalVisibility) => {

        console.log("MODAL VISIBILITY BEFORE => ", modalVisibility)
        setModalVisibility(!modalVisibility)
        console.log("MODAL VISIBILITY AFTER => ", modalVisibility)

    },
    style: {
        backgroundColor: 'green'
    },
    needsModal: true,
    modalTransparent: false,
    modalAnimationType: "slide",
    modalVisible: false,
    modalComponents: {
        type: "Slider",
        minimumValue: 0,
        maximumValue: 100,
        step: 50,
        style: {
            position:"relative",
            width: 250, 
            height: 100,
            backgroundColor: '#FFF',
            justifyContent: 'center',
            alignSelf: 'center',
        },
        onChange: (value, setDataToSend) => {
            console.log("ON CHANGE => ", value)
            setDataToSend(value);
        },
        onInputComplete: async (dataToSend, threadId, setModalVisibility) => {

            try{
                await fetchJson.POST({ body: [{mood: [dataToSend]}] }, constants.createNewMessage(threadId));
                setModalVisibility(false)
            }
            catch (error) {
                console.log("Custom Component - onChange Error:", error)
            }
            
        },
    }
}

const CustomComponent = (props) => {
    
    const ParentComponent = NativeBase[dummyJson.type];
    const [modalVisibility, setModalVisibility] = useState(false);
    const [dataToSend, setDataToSend] = useState(dummyJson.modalComponents.minimumValue);

    const CustomModal = ReactNative["Modal"];
    const ModalComponent = ReactNative[dummyJson.modalComponents.type]

    return (
        <ParentComponent
            style={dummyJson.style}
            onPress={() => dummyJson.onPress(modalVisibility, setModalVisibility)}
        >
            <NativeBase.Icon style={{color: '#fff'}} name={dummyJson.icon}/>
            <NativeBase.Text style={{color: '#fff'}}>{dummyJson.name}</NativeBase.Text>
            

        { dummyJson.needsModal? 
          <CustomModal  
            // transparent={modal.transparent}
            // animationType={modal.animationType}
            // visible={modal.visible}
            transparent={false}
            animationType={dummyJson.modalAnimationType}
            visible={
                // false
                modalVisibility
                
            }
            // onRequestClose={() => { setModal({...modal, visible: true}) }}
          >
              <ModalComponent 
                style={dummyJson.modalComponents.style}
                minimumValue={dummyJson.modalComponents.minimumValue}
                maximumValue={dummyJson.modalComponents.maximumValue}
                onValueChange={
                    (value) => dummyJson.modalComponents.onChange(value, setDataToSend)
                }
                onSlidingComplete={
                    () => dummyJson.modalComponents.onInputComplete(dataToSend, props.threadId, setModalVisibility)
                }
                value={dataToSend}
              >
                  <ReactNative.Text style={{marginTop: 50}}>{dataToSend}</ReactNative.Text>

              </ModalComponent>
          </CustomModal>
        :
          null
        }
        </ParentComponent>
    );
}

export { CustomComponent };