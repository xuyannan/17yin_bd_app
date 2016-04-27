'use strict'
import React, {
  StyleSheet,
  Text,
  View,
  ListView,
  Button,
  Navigator,
  Alert,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import NavigationBar from 'react-native-navbar';

import Constants from '../../constants';
import yinStyles from '../../style/style.js';
import configureStore from '../../store/configure-store';
import * as actions from '../../actions/user';
const store = configureStore();
import { connect } from 'react-redux';

class Setting extends React.Component{
  propTypes: {
    user: PropTypes.object.isRequired
  };

  // state = {
  //   user: {name: ''}
  // };

  componentDidMount () {
    let _this = this;
    AsyncStorage.getItem(Constants.STORAGE_USER_KEY).then(function (res) {
      _this.setState({
        user: JSON.parse(res)
      })
    }).done();
  };

  render () {
    // const {user} = this.props;
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: '设置'}}
          rightButton={{title: ''}} />
        <View>
          <View style={yinStyles.menuItem}>
            <Text>Hello {this.props.user.user.name}</Text>
          </View>
          <TouchableHighlight onPress={this.logout.bind(this)} underlayColor='#eee' style={yinStyles.menuItem}>
            <Text><Icon name="sign-out" size={16}/> 退出当前账号</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  };

  logout () {
    const { dispatch } = this.props;
    Alert.alert('提示', '确定退出?',
    [
      {text: '确定', onPress: () => dispatch(actions.logout())},
      {text: '取消'}
    ]
    )
  };
};

function select(state) {
  return {
    user: state.user
  }
};
export default connect(select)(Setting);
