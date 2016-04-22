'use strict'
import React, {
  StyleSheet,
  View,
  Alert,
  WebView,
  Text,
  DeviceEventEmitter,
  BackAndroid
} from 'react-native';

import BaiduMap from 'react-native-baidumapkit-17yin';
import Yin17 from 'react-native-17yin';
import Config from '../../config';
import Icon from 'react-native-vector-icons/FontAwesome';

let api = new Yin17.Api(Config.API_ROOT);

export default class Map extends React.Component {
  state =  {
    markers: [],
    marker: {},
    marking: false,
    newCoordinate: null,
    processing: false,
    myLocation: null,
    startRequestLocation: false,
    trafficEnabled: false
  };

  componentWillMount () {
    let _this = this;

    DeviceEventEmitter.addListener('markerDragEnd', function(e: Event) {
      console.log('marker drag end', e);
      _this.setState({
        newCoordinate: e
      })
    });

    DeviceEventEmitter.addListener('markerDragEnd', function(e: Event) {
      console.log('marker drag end', e);
      _this.setState({
        newCoordinate: e
      })
    });

    DeviceEventEmitter.addListener('onGetMyLocation', function(e: Event) {
      console.log('get my location', e);
      _this.setState({
        myLocation: e,
        startRequestLocation: false
      })
    });
  };

  componentDidMount () {
    let merchant = this.props.merchant;
    let markers = this.props.markers;

    this.setState({
      // markers: merchant.coordinate ? [JSON.stringify(marker)] : null,
      markers: markers.map(function(marker) {return JSON.stringify(marker)}),
      merchant: merchant
    });
    BackAndroid.addEventListener('hardwareBackPress', () => {
      this.props.navigator.pop();
      return true;
    });
  };

  renderButtons  () {
    let _renderLocationButton = function () {
      if (this.state.startRequestLocation) {
        return (
          <View style={styles.buttonContainer}>
            <Icon.Button name="spinner" backgroundColor="#ccc">
              定位
            </Icon.Button>
          </View>
        )
      } else {
        return (
          <View style={styles.buttonContainer}>
            <Icon.Button name="crosshairs" backgroundColor="#157254" onPress={() => this.requestLocation()}>
              定位
            </Icon.Button>
          </View>
        )
      }
    };

    let _renderTrafficButton = function () {
      return (
        <View style={styles.buttonContainer}>
        <Icon.Button name="road" backgroundColor=  {this.state.trafficEnabled ? '#ccc' : '#157254'} onPress={() => this.setState({trafficEnabled: !this.state.trafficEnabled})}>
            {this.state.trafficEnabled ? '关路况' : '查路况'}
          </Icon.Button>
        </View>

      );
    };
    if (!this.state.marking) {
      return (
        <View style={styles.buttons}>
          {_renderLocationButton.apply(this)}
          {_renderTrafficButton.apply(this)}
          <View style={styles.buttonContainer}>
            <Icon.Button name="thumb-tack" backgroundColor="#1b809e" onPress={() => this.setMarkable.apply(this)}>
              标注位置
            </Icon.Button>
          </View>
        </View>
      )
    } else {
      return (

        <View style={styles.buttons}>
          {_renderLocationButton.apply(this)}
          {_renderTrafficButton.apply(this)}
          <View style={styles.buttonContainer}>
          <Icon.Button name="check" backgroundColor="#5cb85c" onPress={() => this.saveCoodinate.apply(this)}>
            保存
          </Icon.Button>
          </View>
          <View style={styles.buttonContainer}>
          <Icon.Button name="ban" backgroundColor="#d9534f" onPress={() => this.cancelMark()}>
            取消
          </Icon.Button>
          </View>
        </View>
      )
    }
  };

  dragEnd (event) {
    console.log(event);
  };

  onGetMyLocation (event) {
    console.log('Get My Location: ', event);
  };

  requestLocation () {
    if (this.state.startRequestLocation) {
      return false;
    }
    this.setState({
      startRequestLocation: true
    })
  };

  setMarkable () {
    let merchant = this.props.merchant;
    Alert.alert('提示', '长按红色位置图标2秒钟后即可拖动。拖动到正确位置后，点击"保存"即可');

    let markers = this.state.markers;
    this.setState({
      markers: markers.map(function(marker) {
        let _m = JSON.parse(marker);
        _m.draggable = _m.merchantId === merchant.id;
        return JSON.stringify(_m);
      }),
      marking: true
    });
  };

  cancelMark () {
    let markers = this.state.markers;
    this.setState({
      markers: markers.map(function(marker) {
        let _m = JSON.parse(marker);
        _m.draggable = false;
        return JSON.stringify(_m);
      }),
      marking: false
    });
  };

  saveCoodinate () {
    let _submit = function () {
      console.log('submit coordinate');
      this.setState({processing: true});
      api.updateMerchantCooridate({
        merchant: this.props.merchant,
        coordinate: this.state.newCoordinate,
        token: this.props.token,
        onError: (res) => {
          Alert.alert('提示', (res && res.message ? res.message + ',': '') + '请确认是否进行了标注？')
        },
        onSuccess: (res) => {
          let _markers = this.state.markers;
          let _this = this;
          this.setState({
            // marker: _marker,
            markers: _markers.map(function(marker) {
              if (marker.merchantId === _this.state.merchant.id) {
                marker.coordinate = _this.state.newCoordinate;
              }
              return marker;
            }),
            marking: false
          });
          let merchant = Object.assign({}, this.props.merchant);
          merchant.coordinate = res;
          this.setState({
            merchant: merchant
          });

          // store.dispatch({type: 'UPDATE_MERCHANT', merchant: _merchant});
          Alert.alert('提示', '标注成功');
        }
      });
    };


    if (this.state.processing) {
      return false;
    }
    console.log(this.state.newCoordinate, this.state.myLocation);
    if (this.state.newCoordinate == null && this.state.myLocation == null) {
      Alert.alert('提示', '无效的位置。请先在地图上标注。');
      return false;
    } else if (this.state.newCoordinate == null && this.state.myLocation != null) {

      Alert.alert('提示', '您没有进行拖动操作。直接将当前位置保存为门店位置？', [
        {
          text: '确认',
          onPress: (function() {
            console.log('state-: ', this.state);
            this.setState({
              newCoordinate: this.state.myLocation
            })
            _submit.apply(this);
          }).bind(this)
        },
        {
          text: '取消',
          style: 'cancel',
          onPress: function() {
            return false;
          }
        }
      ])
    } else if (this.state.newCoordinate != null) {
      _submit.apply(this);
    }
  };

  render () {
    return (
      <View style={{flex: 1}}>
        <View style={{padding: 4}}>
          <Text style={{fontSize: 18}}>{this.props.merchant.name}</Text>
          <Text>{this.props.merchant.address}</Text>
          <View style={styles.buttonContainer}>
            {this.renderButtons.apply(this)}
          </View>
        </View>
        <BaiduMap
          style={{flex: 1}}
          marker={this.state.markers}
          mode={1}
          locationEnabled={true}
          showZoomControls={false}
          startRequestLocation={this.state.startRequestLocation}
          trafficEnabled={this.state.trafficEnabled}
        />
      </View>
    )
  }
};

let styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  buttonContainer: {
    marginLeft: 8
  }
})
