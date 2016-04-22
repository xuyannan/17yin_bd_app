'use strict'

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Alert,
  Navigator,
  TextInput,
  ListView
} from 'react-native';

import GiftedListView from 'react-native-gifted-listview';
import Yin17 from 'react-native-17yin';
import Map from '../map/map.android';
import OrderList from '../order/orderList.android';
import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import Config from '../../config';
import yinStyles from '../../style/style';

let api = new Yin17.Api(Config.API_ROOT);

export default class MerchantList extends React.Component {
  state = {
    loading: false,
    merchants: [],
    query: '',
    searchResult: new ListView.DataSource({
        rowHasChanged: (row1, row2) => {row1 !== row2}
      }),
    searchResultObject: null
  };

  render () {
    let merchantNaviRenderScene = function (route, navigator) {
      switch (route.id) {
        case 'merchantList':
          return (
            <View style={yinStyles.container}>
              <NavigationBar
                title={{title: '我的商户'}}
                rightButton={{title: ''}} />
              <View>
                <TextInput
                  onChangeText={(text) => {
                    this.setState({query: text});
                    if (text.length > 0) {
                      this.searchMerchants();
                    }
                  }}
                  value={this.state.query}
                  placeholder="输入门店关键字查询"
                  placeholderTextColor="#ccc"
                ></TextInput>
              </View>
              <View style={{flex: 1}}>
                {this.renderList.bind(this)()}

              </View>
            </View>
          )
          break;
        case 'map':
          return (
            <Map merchant={route.merchant} markers={route.markers} token={route.token} navigator={route.navigator}/>
          )
          break;
        case 'orders':
          return (
            <View style={{flex: 1}}>
              <OrderList merchant={route.merchant} token={route.token} navigator={route.navigator}/>
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

  renderList () {
    if (this.state.query && this.state.query.length >= 1) {
      if (this.state.searchResultObject !== null) {
        return (
          <ListView
            dataSource={this.state.searchResult}
            renderRow={this.renderMerchant.bind(this)}/>
        )
      } else {
        return (
          <View><Text>无查询结果</Text></View>
        )
      }

    } else {
      return (
        <GiftedListView
        onFetch={this.loadAllMerchants.bind(this)}
        rowView={this.renderMerchant.bind(this)}
        />
      )
    }
  };

  searchMerchants () {
    api.searchMerchants({
      query: this.state.query,
      token: this.props.token,
      onSuccess: (res) => {
        this.setState({
          searchResult: (new ListView.DataSource({ rowHasChanged: (row1, row2) => {row1 !== row2} })).cloneWithRows(res),
          searchResultObject: res.length > 0 ? res : null
        })
      },
      onError: () => {
        Alert.alert('提示','加载出错');
      }
    });
  };

  loadAllMerchants (page = 1, callback, options) {
    api.loadMerchants({
      token: this.props.token,
      page: page,
      onSuccess: (res) => {
        callback(res, {
          allLoaded: res.length === 0
        })
      },
      onError: () => {
        Alert.alert('提示','加载出错')
      }
    });

  };

  onNamePress (merchant) {
    dismissKeyboard();
    let navigator = this.refs.navigator;
    navigator.push({
      id: 'orders',
      merchant: merchant,
      token: this.props.token,
      navigator: navigator
    })
  };

  openMap (merchant) {
    dismissKeyboard();
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
