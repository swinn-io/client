import React, { useEffect, useState } from 'react';
import deviceStorage from './deviceStorage';
import { isEmpty } from './helperFunctions'

export const GetUser = async () => {
    try {
        let user = await deviceStorage.getUser()
        //When access_token is needed
        // console.log("USER SERVICE - USER", user);
        return user;
      } catch (error) {
        console.log("GetUser Error", error);
      }
}

export const SignIn = async ( user ) => {
    try {
      if( !isEmpty( user )){
        await deviceStorage.saveUser(user);
      }
    } catch (error) {
      console.log("SignIn Error", error);
    }
}

export const SignOut = async () => {
    try {
      await deviceStorage.removeUser();
    } catch (error) {
      console.log("SignOut Error", error);
    }
}