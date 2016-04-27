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


let api = new Yin17.Api(Config.API_ROOT);

export default class OrderList extends React.Component {
  state = {
    orders: []
  };

  static propTypes = {
    token: React.PropTypes.string.isRequired
  };

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      this.props.navigator.pop();
      return true;
    });
  };

  loadOrders (page = 1, callback, options) {
    api.loadOrdersByMerchant({
      token: this.props.token,
      page: page,
      merchant: this.props.merchant,
      onSuccess: (res) => {
        // console.log('orders:', orders);
        callback(res.orders, {
          allLoaded: res.orders.length === 0
        })
      },
      onError: (res) => {
        Alert.alert('提示','加载出错');
      }
    });
  };

  renderOrder (order) {
    console.log('order:', order);
    return (
      <Yin17.Order order={order}/>
    )
  };

  render () {
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: this.props.merchant.name}}
          rightButton={{title: ''}} />
        <View style={{flex: 1, padding: 8}}>
          <GiftedListView
          onFetch={this.loadOrders.bind(this)}
          rowView={this.renderOrder.bind(this)}
          />
        </View>
      </View>
    )
  };
};
