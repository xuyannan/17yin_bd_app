'use strict'

import React, {
  AsyncStorage
} from 'react-native';

import * as types from '../ActionTypes';

export function userLoginDone(params) {
  return dispatch => {
    dispatch({
      type: types.USER_LOGIN_DONE,
      user: params.user
    })
  }
};

export function userLogout(params) {
  return dispatch => {
    dispatch({
      type: types.USER_LOGOUT
    })
  }
};
