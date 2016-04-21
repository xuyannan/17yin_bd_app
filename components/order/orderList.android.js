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

export default class OrderList extends React.Component {
  state = {
    orders: []
  };

  static propTypes = {
    merchant: React.PropTypes.object.isRequired,
    token: React.PropTypes.string.isRequired
  };

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      this.props.navigator.pop();
      return true;
    });
  };

  loadOrders (page = 1, callback, options) {
    fetch(`http://192.168.130.42:3000/api/v1/bd/merchants/${this.props.merchant.id}/orders.json?per=20&page=${page}`, {
      headers: {
        'Authorization': 'Basic ' + this.props.token
      }
    }).then((response) => (response.json()))
    .then((responseData) => {
      this.setState({loading: false});
      console.log('Orders: ', responseData.data.orders);
      if (typeof(responseData.data) === 'undefined') {
        Alert.alert('提示','加载出错')
      } else {
        // _this.setState({
        //   tasks: responseData.data.tasks
        // })
        callback(responseData.data.orders, {
          allLoaded: responseData.data.orders.length === 0
        })
      }
    }).done()
  };

  renderOrder (order) {
    return (
      <Yin17.Order order={order}/>
    )
  };

  render () {
    return (
      <View style={{flex: 1}}>
        <NavigationBar
          title={{title: '订单'}}
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
