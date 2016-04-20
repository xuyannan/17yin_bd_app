'use strict'

import * as types from '../ActionTypes'

const initialState = {
  loading: false,
  merchants: []
};

export default function merchant(state = initialState, action) {
  switch (action.type) {
    case types.FETCH_MERCHANTS:
      return Object.assign({}, state, {loading: true});
      break;
    case types.RECIVED_MERCHANTS:
      return Object.assign({}, state, {
        loading: false,
        merchants: action.merchants
      })
      break;
    default:
      return state;

  }
};
