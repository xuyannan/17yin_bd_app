'use strict'

import * as types from '../ActionTypes';

export function fetchMerchant(params) {
  return dispatch => {
    dispatch({
      type: types.FETCH_MERCHANTS
    })
    fetch('http://192.168.130.155:3000/api/v1/deliveryman/orders', {
      headers: {
        'Authorization': 'Basic ' + params.token
      }
    })
    .then((response) => (response.json()))
    .then((responseData => {
      dispatch({
        type: types.RECIVED_MERCHANTS,
        merchants: responseData.data
      })
    }))
    .done();
  }

};
