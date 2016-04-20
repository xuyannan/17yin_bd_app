'use strict'

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Alert,
  Navigator
} from 'react-native';

import GiftedListView from 'react-native-gifted-listview';
import Yin17 from 'react-native-17yin';
import Map from '../map/map.android';

export default class MerchantList extends React.Component {
  state = {
    loading: false,
    merchants: []
  };

  render () {
    let merchantNaviRenderScene = function (route, navigator) {
      switch (route.id) {
        case 'merchantList':
          return (
            <View style={{flex: 1}}>
              <View style={{flex: 1}}>
                <GiftedListView
                onFetch={this.loadMerchants.bind(this)}
                rowView={this.renderMerchant.bind(this)}
                />
              </View>
            </View>
          )
          break;
        case 'map':
          return (
            <View style={{flex: 1}}>
            <Map merchant={route.merchant} markers={route.markers} token={route.token} navigator={route.navigator}/>
            </View>
          )
          break;
        default:

      }
    };
    return (
      <Navigator ref="navigator"
        initialRoute={{id: 'merchantList', index: 0}}
        renderScene={(route, navigator) => merchantNaviRenderScene.apply(this, [route, navigator])}
      />
    );
  };

  loadMerchants (page = 1, callback, options) {
    fetch(`http://192.168.131.59:3000/api/v1/bd/merchants.json?per=20&page=${page}`, {
      headers: {
        'Authorization': 'Basic ' + this.props.token
      }
    }).then((response) => (response.json()))
    .then((responseData) => {
      this.setState({loading: false});
      if (typeof(responseData.data) === 'undefined') {
        Alert.alert('提示','加载出错')
      } else {
        // _this.setState({
        //   tasks: responseData.data.tasks
        // })
        callback(responseData.data, {
          allLoaded: responseData.data === 0
        })
      }
    }).done()
  };

  onNamePress (merchant) {
    console.log('MerchantName:', merchant.name);
  };

  openMap (merchant) {
    console.log('MerchantAddress:', merchant.address);
    let navigator = this.refs.navigator;
    let markers = [];
    if (merchant.coordinate === null) {
      markers.push({
        coordinate: 'null',
        merchantId: merchant.id,
        info: merchant.name,
        draggable: false,
        selected: true
      })
    } else {
      markers.push({
        coordinate: merchant.coordinate,
        merchantId: merchant.id,
        info: merchant.name,
        draggable: false,
        selected: true
      })
    }
    console.log('merchant.coordinate', markers);
    navigator.push({
      id: 'map',
      merchant: merchant,
      markers: markers,
      token: this.props.token,
      navigator: navigator
    })
  };

  renderMerchant(merchant) {
    return (
      <Yin17.Merchant merchant={merchant} onNamePress={() => this.onNamePress(merchant)} onAddressPress={() => this.openMap(merchant)}/>
    )
  };

}
