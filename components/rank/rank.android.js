'use strict'
import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Alert,
  Navigator,
  BackAndroid,
  ListView,
  TextInput,
  TouchableNativeFeedback
} from 'react-native';

import Yin17 from 'react-native-17yin';
import NavigationBar from 'react-native-navbar';
import Config from '../../config';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import yinStyles from '../../style/style';
let api = new Yin17.Api(Config.API_ROOT);

export default class Rank extends React.Component {
  state = {
    scores: [],
    date: moment().format('YYYY-MM-DD'),
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => {row1 !== row2}
    }),
    loading: false
  };

  componentWillMount () {
    this.goToDate(this.state.date);
  };

  goToDate (date) {
    this.setState({
      date: date,
      loading: true
    });
    api.bdScores({
      token: this.props.token,
      date: date,
      onSuccess: (res) => {
        res = res.sort(function(s1, s2) {
          return s2.score.score - s1.score.score;
        })
        this.setState({
          dataSource: (new ListView.DataSource({rowHasChanged: (row1, row2) => {row1 !== row2}})).cloneWithRows(res),
          loading: false
        })
      },
      onError: (res) => {
        console.log('error');
        this.setState({
          loading: false
        })
      }
    });
  };

  goToNextDate () {
    var date = moment(this.state.date).add(1, 'month').format('YYYY-MM-DD');
    this.goToDate(date);
  };

  goToPrevDate () {
    var date = moment(this.state.date).add(-1, 'month').format('YYYY-MM-DD');
    this.goToDate(date);
  };

  renderNavi () {
    return (
      <View style={styles.dateNavi}>
        <TouchableNativeFeedback onPress={this.goToPrevDate.bind(this)}><View><Icon name="chevron-left" size={32}/></View></TouchableNativeFeedback>
        <Text style={{fontSize: 32}}>{moment(this.state.date).format('YYYY-MM')}</Text>
        <TouchableNativeFeedback onPress={this.goToNextDate.bind(this)}><View><Icon name="chevron-right" size={32}/></View></TouchableNativeFeedback>
      </View>
    )
  }

  render () {
    if (this.state.loading) {
      return (
        <View style={yinStyles.container}>
          <NavigationBar
            title={{title: '绩效排行'}}
            rightButton={{title: ''}} />

          {this.renderNavi.apply(this)}

          <View style={yinStyles.centered}><Text><Icon name="refresh" size={16}/> 加载中，请稍候</Text></View>
        </View>

      )
    }
    return (
      <View style={yinStyles.container}>
        <NavigationBar
          title={{title: '绩效排行'}}
          rightButton={{title: ''}} />

        {this.renderNavi.apply(this)}

        <ListView style={{padding: 8}}
          dataSource={this.state.dataSource}
          renderRow={this.renderScore.bind(this)}/>
      </View>
    )
  };

  renderScore (score) {
    return (
      <View style={styles.score}>
        <View style={styles.scoreTitle}><Text style={styles.fontSize24}>{score.user.name}</Text><Text style={styles.fontSize24}>{score.score.score}</Text></View>
        <View><Text>新店首单：{score.score.first_order_by_new_merchant}</Text></View>
        <View><Text>老店首单：{score.score.first_order_by_old_merchant}</Text></View>
        <View><Text>完成订单：{score.score.order_mission_complated}</Text></View>
      </View>
    )
  };
};

var styles = StyleSheet.create({
  container: {flex: 1},
  dateNavi: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  score: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8
  },
  scoreTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  fontSize24: {
    fontSize: 24
  }
});
