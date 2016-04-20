'use strict'

import * as types from '../ActionTypes'

const initialState = {
  loading: false,
  user:null
};

export default function user(state = initialState, action) {
  console.log('REDUX', action);
  switch (action.type) {
    case types.USER_LOGIN_DONE:
      return Object.assign({}, state, {loading: false, user: action.user});
      break;
    case types.USER_LOGOUT:
      return Object.assign({}, state, {loading: false, user: null});
      break;
    default:
      return state;

  }
};
