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

export default class Setting extends React.Component{
  state = {
    user: {name: ''}
  };

  componentDidMount () {
    let _this = this;
    AsyncStorage.getItem(Constants.STORAGE_USER_KEY).then(function (res) {
      _this.setState({
        user: JSON.parse(res)
      })
    }).done();
  };

  render () {
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: '设置'}}
          rightButton={{title: ''}} />
        <View>
          <View style={yinStyles.menuItem}>
            <Text>Hello {this.state.user.name}</Text>
          </View>
          <TouchableHighlight onPress={this.logout.bind(this)} underlayColor='#eee' style={yinStyles.menuItem}>
            <Text><Icon name="sign-out" size={16}/> 退出当前账号</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  };

  logout () {
    let _logout = function () {
      AsyncStorage.removeItem(Constants.STORAGE_USER_KEY, (error, res) => {
        if (error) {
          Alert.alert('提示', '退出失败')
        } else {
          console.log('退出成功');
        }
      })
    };
    Alert.alert('提示', '确定退出?',
    [
      {text: '确定', onPress: () => _logout()},
      {text: '取消'}
    ]
    )
  };
};
