'use strict'

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Alert,
  Navigator,
  BackAndroid
} from 'react-native';

import GiftedListView from 'react-native-gifted-listview';
import Yin17 from 'react-native-17yin';
import NavigationBar from 'react-native-navbar';
import Config from '../../config';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import OrderListByMerchant from './orderListByMerchant';


let api = new Yin17.Api(Config.API_ROOT);

export default class OrderList extends React.Component {
  state = {
    orders: []
  };

  static propTypes = {
    token: React.PropTypes.string.isRequired
  };

  componentDidMount () {
    // BackAndroid.addEventListener('hardwareBackPress', () => {
    //   this.props.navigator.pop();
    //   return true;
    // });
  };

  loadOrders (page = 1, callback, options) {
    api.loadMyOrders({
      token: this.props.token,
      page: page,
      merchant: this.props.merchant,
      onSuccess: (orders) => {
        // console.log('orders:', orders);
        callback(orders, {
          allLoaded: orders.length === 0
        })
      },
      onError: (res) => {
        Alert.alert('提示','加载出错');
      }
    });
  };

  onOrderNamePress(order) {
    dismissKeyboard();
    let navigator = this.refs.navigator;
    navigator.push({
      id: 'ordersByMerchant',
      merchant: order.user,
      token: this.props.token,
      navigator: navigator
    })
  };

  renderOrder (order) {

    return (
      <Yin17.Order order={order} onNamePress={() => this.onOrderNamePress(order)}/>
    )
  };

  render () {
    let naviRenderScene = function (route, navigator) {
      switch (route.id) {
        case 'orderList':
          return (
            <View style={{flex: 1}}>
              <NavigationBar
                title={{title: '商户订单'}}
                rightButton={{title: ''}} />
              <View style={{flex: 1, padding: 8}}>
                <GiftedListView
                onFetch={this.loadOrders.bind(this)}
                rowView={this.renderOrder.bind(this)}
                />
              </View>
            </View>
          )
          break;
        case 'ordersByMerchant':
          return (
            <OrderListByMerchant merchant={route.merchant} token={route.token} navigator={route.navigator}/>
          )
          break;

        default:

      }
    };
    return (
      <Navigator ref="navigator"
        initialRoute={{id: 'orderList', index: 0}}
        renderScene={(route, navigator) => naviRenderScene.apply(this, [route, navigator])}
      />
    );
  };
};
