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

export default class SearchOrder extends React.Component {
  state = {
    searchResult: new ListView.DataSource({
        rowHasChanged: (row1, row2) => {row1 !== row2}
      }),
    searchResultObject: null
  };
  render () {
    return (
      <View>
        <NavigationBar
          title={{title: '订单查询'}}
          rightButton={{title: ''}} />
        <TextInput
          onChangeText={(text) => {
            this.setState({query: text});
            if (text.length >= 4) {
              this.searchOrders();
            }
          }}
          value={this.state.query}
          placeholder="输入完整订单号查询"
          placeholderTextColor="#ccc"
        ></TextInput>
        <ListView style={{padding: 8}}
          dataSource={this.state.searchResult}
          renderRow={this.renderOrder.bind(this)}/>
      </View>
    )
  };

  renderOrder (order) {
    return (
      <Yin17.Order order={order}/>
    )
  };

  searchOrders () {
    fetch(`http://192.168.130.42:3000/api/v1/search/orders?per=10000&page=1`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + this.props.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
      ,
      body: JSON.stringify({
        q: this.state.query
      })
    }).then((response) => (response.json()))
    .then((responseData) => {
      this.setState({loading: false});
      console.log(responseData);
      responseData.data.map(function(order) {
        console.log(order.id);
      })
      if (typeof(responseData.data) === 'undefined') {
        Alert.alert('提示','加载出错')
      } else {
        this.setState({
          searchResult: (new ListView.DataSource({ rowHasChanged: (row1, row2) => {row1 !== row2} })).cloneWithRows(responseData.data),
          searchResultObject: responseData.data.length > 0 ? responseData.data : null
        })

      }
    }).done()
  }
};
