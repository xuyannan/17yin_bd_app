'use strict'

import React, {
  AsyncStorage,
  Alert,
} from 'react-native';

import Yin17 from 'react-native-17yin';
import config from '../config';

import * as types from '../ActionTypes';
import Constants from '../constants';

let api = new Yin17.Api(config.API_ROOT);

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

export function hasLocalUser(params) {
  return dispatch => {
    dispatch({
      type: types.USER_LOGIN_DONE,
      user: params.user
    })
  }
};

export function login(params) {
  return dispatch => {
    api.login({
      mobile: params.mobile,
      password: params.password,
      authority: 'bd',
      onSuccess: (user) => {
        AsyncStorage.setItem(Constants.STORAGE_USER_KEY, JSON.stringify(user)).then((error, res) => {
          if (!error) {
            dispatch(userLoginDone({
              user: user
            }))
          }
        })

      },
      onError: (res) => {
        Alert.alert('提示', res.message ? res.message : '登录失败，请确认您的手机和密码正确');
      }
    })
  }
};

export function logout(params) {
  return dispatch => {
    AsyncStorage.removeItem(Constants.STORAGE_USER_KEY).then((error, res) => {
      console.log('退出成功');
      if (!error) {
        dispatch({
          type: types.USER_LOGOUT
        })
      }
    });
  }
}
