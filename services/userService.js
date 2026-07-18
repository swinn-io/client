import React, { useEffect, useState } from 'react';
import deviceStorage from './deviceStorage';
import fetchJson from './fetchJson';
import constants from '../constants/constants';
import { isEmpty } from './helperFunctions';

// Fetches the authenticated user's profile (/api/user/me).
// Requires the access_token to already be persisted (fetchJson reads it
// from secure storage). Returns the JSON:API resource ({ id, attributes, ... }).
export const GetProfile = async () => {
  try {
    let response = await fetchJson.GET(constants.profileEndpoint());
    return response?.data;
  } catch (error) {
    console.log('GetProfile Error', error.message);
    return undefined;
  }
};

export const GetUser = async () => {
  try {
    let user = await deviceStorage.getUser();
    //When access_token is needed
    //console.log('USER SERVICE - USER', user);
    return user;
  } catch (error) {
    console.log('GetUser Error', error);
  }
};

export const SignIn = async (user) => {
  try {
    if (!isEmpty(user)) {
      await deviceStorage.saveUser(user);
    }
  } catch (error) {
    console.log('SignIn Error', error);
  }
};

export const SignOut = async () => {
  try {
    await deviceStorage.removeUser();
  } catch (error) {
    console.log('SignOut Error', error);
  }
};
