'use strict'
import React from 'react-native';
import {Login} from 'react-native-17yin';
import {connect} from 'react-redux';

class LoginContainer extends React.Component{
  render () {
    return (
      <Login {...this.props} />
    )
  }
}

let  mapStateToProps = function(state){
  const {user} = state;
  return {
    user
  }
}

export default connect(mapStateToProps)(LoginContainer);
