'use strict'
import {combineReducers} from 'redux';
import merchant from './merchant';
import user from './user';

const rootReducer = combineReducers({
  merchant,
  user
});

export default rootReducer;
