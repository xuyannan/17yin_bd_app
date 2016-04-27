'use strict'

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  PropTypes
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
import Rank from '../components/rank/rank.android';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import * as actions from '../actions/user';
import { connect } from 'react-redux';

const store = configureStore();

class App extends React.Component {

  state = {
    user: null,
    loaded: false,
    selectedTab: 'merchants',
  };

  componentDidMount () {
    const { dispatch } = this.props;
    let _this = this;
    AsyncStorage.getItem(Constants.STORAGE_USER_KEY).then(function (res) {
      console.log('local user: ', res);
      if (res !== null) {
        dispatch(actions.userLoginDone({
          user: JSON.parse(res)
        }))
      }

    }).done();
  };

  componentWillReceiveProps(nextProps) {
    console.log('nextProps', nextProps);
  };

  render () {
    const { dispatch, user } = this.props;
    console.log('app user', user);
    // this.setState({
    //   user: user
    // });
    console.log('user', user);
    if (user.user !== null) {
      return (
        <TabNavigator ref="tabbar">
          <TabNavigator.Item
            selected={this.state.selectedTab === 'merchants'}
            title="我的商户"
            renderIcon={() => <Icon name="university" size={16}/>}
            renderSelectedIcon={() => <Icon name="university" size={16} color="#1182fe"/>}
            badgeText=""
            onPress={() => {dismissKeyboard(); this.setState({ selectedTab: 'merchants' })}}>
            <MerchantList token={user.user.token} />
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'orders'}
            title="订单查询"
            renderIcon={() => <Icon name="search" size={16}/>}
            renderSelectedIcon={() => <Icon name="search" size={16} color="#1182fe"/>}
            badgeText=""
            onPress={() => {dismissKeyboard(); this.setState({ selectedTab: 'orders' })}}>
            <SearchOrder token={user.user.token}/>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'balance'}
            title="绩效排行"
            renderIcon={() => <Icon name="list-ol" size={16}/>}
            renderSelectedIcon={() => <Icon name="list-ol" size={16} color="#1182fe"/>}
            badgeText=""
            onPress={() => {dismissKeyboard(); this.setState({ selectedTab: 'balance' })}}>
            <Rank token={user.user.token}/>
          </TabNavigator.Item>

          <TabNavigator.Item
            selected={this.state.selectedTab === 'account'}
            title="设置"
            renderIcon={() => <Icon name="cogs" size={16}/>}
            renderSelectedIcon={() => <Icon name="cogs" size={16} color="#1182fe"/>}
            badgeText=""
            onPress={() => {dismissKeyboard(); this.setState({ selectedTab: 'account' })}}>
            <Setting user={user.user}/>
          </TabNavigator.Item>
        </TabNavigator>
      )
    } else {
      return (
        <LoginContainer/>
      )
    }
  };

  login () {
    const { dispatch } = this.props;
    dispatch(actions.login({
      mobile: '13331279132',
      password: '111111'
    }))
  };

  // loginSuccess (user) {
  //   let authority = {
  //     bd: true
  //   };
  //   if (user && authority[user.state]) {
  //     store.dispatch(actions.userLoginDone({
  //       user: user
  //     }));
  //   } else {
  //     Alert.alert('提示', 'sorry，您暂时没有访问权限');
  //   }
  // };
  //
  // loginFailed (res) {
  //   if (res.message) {
  //     Alert.alert('提示', res.message);
  //   } else {
  //     Alert.alert('提示', '登录失败');
  //   }
  // }
};

App.propTypes = {
  user: PropTypes.object.isRequired
};

function select(state) {
  return {
    user: state.user
  }
};
export default connect(select)(App);
