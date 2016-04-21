'use strict'

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  AsyncStorage
} from 'react-native';

import Yin17 from 'react-native-17yin';

import LoginContainer from '../containers/loginContainer';

import TabNavigator from 'react-native-tab-navigator';
import  Icon from 'react-native-vector-icons/FontAwesome';

import Constants from '../constants';
import configureStore from '../store/configure-store';
import * as types from '../ActionTypes';

import userAction from '../actions/user';

import MerchantList from '../components/merchant/merchant.android';
import Setting from '../components/setting/setting.android';
import SearchOrder from '../components/order/searchOrder.android';
import dismissKeyboard from 'react-native-dismiss-keyboard';

const store = configureStore();

export default class App extends React.Component {

  state = {
    user: null,
    loaded: false,
    selectedTab: 'merchants',
  };

  // static authority = {
  //   deliveryman: true
  // };

  componentDidMount () {
    let _this = this;
    AsyncStorage.getItem(Constants.STORAGE_USER_KEY).then(function (res) {
      _this.setState({
        user: JSON.parse(res)
      })
    }).done();
    store.subscribe(function () {
      if (store.getState().user === null) {
        try {
          _this.setState({
            user: null
          })
        } catch(e) {}
      }
    });
  };

  render () {
    if (this.state.user !== null) {
      return (
        <TabNavigator ref="tabbar">
          <TabNavigator.Item
            selected={this.state.selectedTab === 'merchants'}
            title="我的商户"
            renderIcon={() => <Icon name="university" size={16}/>}
            renderSelectedIcon={() => <Icon name="university" size={16} color="#1182fe"/>}
            badgeText=""
            onPress={() => {dismissKeyboard(); this.setState({ selectedTab: 'merchants' })}}>
            <MerchantList token={this.state.user.token} />
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'orders'}
            title="订单查询"
            renderIcon={() => <Icon name="search" size={16}/>}
            renderSelectedIcon={() => <Icon name="search" size={16} color="#1182fe"/>}
            badgeText=""
            onPress={() => {dismissKeyboard(); this.setState({ selectedTab: 'orders' })}}>
            <SearchOrder token={this.state.user.token}/>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'balance'}
            title="绩效分"
            renderIcon={() => <Icon name="list-ol" size={16}/>}
            renderSelectedIcon={() => <Icon name="list-ol" size={16} color="#1182fe"/>}
            badgeText=""
            onPress={() => {dismissKeyboard(); this.setState({ selectedTab: 'balance' })}}>
            <View><Text>balance</Text></View>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'account'}
            title="设置"
            renderIcon={() => <Icon name="cogs" size={16}/>}
            renderSelectedIcon={() => <Icon name="cogs" size={16} color="#1182fe"/>}
            badgeText=""
            onPress={() => {dismissKeyboard(); this.setState({ selectedTab: 'account' })}}>
            <Setting/>
          </TabNavigator.Item>
        </TabNavigator>
      )
    } else {
      return (
        <LoginContainer loginSuccess={this.loginSuccess.bind(this)} loginFailed={this.loginFailed.bind(this)}/>
      )
    }
  };

  loginSuccess (user) {
    // let user = Object.assign({}, res);
    let authority = {
      bd: true
    };
    if (user && authority[user.state]) {
      AsyncStorage.setItem(Constants.STORAGE_USER_KEY, JSON.stringify(user))

      // let a =userAction.userLoginDone({
      //   user: user
      // })
      // a();
      // console.log('REDUX', store.getState());
      store.dispatch({type: types.USER_LOGIN_DONE, user: user});
      // console.log('REDUX', store.getState().user.user);
      this.setState({
        user: user
      })
    } else {
      Alert.alert('提示', 'sorry，您暂时没有访问权限');
    }
  };

  loginFailed (res) {
    if (res.message) {
      Alert.alert('提示', res.message);
    } else {
      Alert.alert('提示', '登录失败');
    }
  }
}
