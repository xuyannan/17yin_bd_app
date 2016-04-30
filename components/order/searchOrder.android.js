'use strict'

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Alert,
  Navigator,
  BackAndroid,
  ListView,
  TextInput
} from 'react-native';

import Yin17 from 'react-native-17yin';
import NavigationBar from 'react-native-navbar';
import Config from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import yinStyles from '../../style/style';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import OrderListByMerchant from './orderListByMerchant';
let api = new Yin17.Api(Config.API_ROOT);

export default class SearchOrder extends React.Component {
  state = {
    searchResult: new ListView.DataSource({
        rowHasChanged: (row1, row2) => {row1 !== row2}
      }),
    searchResultObject: [],
    loading: false
  };
  renderResult () {
    if (this.state.loading) {
      return (
        <View style={yinStyles.centered}><Text><Icon name="refresh" size={16}/> 加载中，请稍候</Text></View>
      )
    } else if(this.state.searchResultObject.length === 0) {
      return (
        <View style={yinStyles.centered}><Text><Icon name="search" size={16}/> 没有找到结果</Text></View>
      )
    } else {
      return (
        <ListView style={{padding: 8}}
          dataSource={this.state.searchResult}
          renderRow={this.renderOrder.bind(this)}/>
      )
    }
  };
  render () {
    let naviRenderScene = function (route, navigator) {
      switch (route.id) {
        case 'orderList':
          return (
            <View style={yinStyles.container}>
              <NavigationBar
                title={{title: '订单查询'}}
                rightButton={{title: ''}} />
              <TextInput
                onChangeText={(text) => {
                  this.setState({query: text});
                  if (text.length >= 10) {
                    this.searchOrders();
                  }
                }}
                value={this.state.query}
                placeholder="输入完整订单号查询"
                placeholderTextColor="#ccc"
              ></TextInput>
              {this.renderResult.apply(this)}
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

  searchOrders () {
    this.setState({
      loading: true
    });
    api.searchOrder({
      query: this.state.query,
      token: this.props.token,
      onSuccess: (res) => {
        this.setState({
          searchResult: (new ListView.DataSource({ rowHasChanged: (row1, row2) => {row1 !== row2} })).cloneWithRows(res),
          searchResultObject: res,
          loading: false
        })
      },
      onError: (res) => {
        Alert.alert('提示','加载出错');
        this.setState({
          loading: false
        });
      }
    });
  }
};
