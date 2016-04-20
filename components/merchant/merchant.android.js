'use strict'

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import GiftedListView from 'react-native-gifted-listview';
import Yin17 from 'react-native-17yin';

export default class MerchantList extends React.Component {
  state = {
    loading: false,
    merchants: []
  };

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <GiftedListView
          onFetch={this.loadMerchants.bind(this)}
          rowView={this.renderMerchant.bind(this)}
          />
        </View>
      </View>
    );

  };

  loadMerchants (page = 1, callback, options) {
    fetch(`http://192.168.130.155:3000/api/v1/deliveryman/orders?per=20&page=${page}`, {
      headers: {
        'Authorization': 'Basic ' + this.props.token
      }
    }).then((response) => (response.json()))
    .then((responseData) => {
      this.setState({loading: false});
      console.log('merchants:', responseData.data.tasks.length);
      if (typeof(responseData.data.tasks) === 'undefined') {
        Alert.alert('提示','加载出错')
      } else {
        // _this.setState({
        //   tasks: responseData.data.tasks
        // })
        callback(responseData.data.tasks, {
          allLoaded: responseData.data.tasks.length === 0
        })
      }
    }).done()
  };

  renderMerchant(merchant) {
    return (
      <Yin17.Merchant merchant={merchant.merchant}/>
    )
  };
}
