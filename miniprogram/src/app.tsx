import Taro from '@tarojs/taro';
import '@tarojs/taro/css';

import './app.css';

class App extends Taro.Component {
  config = {
    pages: [
      'pages/record/index',
      'pages/happiness/index',
      'pages/analysis/index',
      'pages/history/index',
      'pages/mine/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#6366f1',
      navigationBarTitleText: '心情树洞',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: '#9ca3af',
      selectedColor: '#6366f1',
      backgroundColor: '#ffffff',
      borderStyle: 'black',
      list: [
        {
          pagePath: 'pages/record/index',
          text: '记录',
          iconPath: 'assets/tab-record.png',
          selectedIconPath: 'assets/tab-record-active.png'
        },
        {
          pagePath: 'pages/happiness/index',
          text: '小确幸',
          iconPath: 'assets/tab-happiness.png',
          selectedIconPath: 'assets/tab-happiness-active.png'
        },
        {
          pagePath: 'pages/analysis/index',
          text: '分析',
          iconPath: 'assets/tab-analysis.png',
          selectedIconPath: 'assets/tab-analysis-active.png'
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: 'assets/tab-mine.png',
          selectedIconPath: 'assets/tab-mine-active.png'
        }
      ]
    },
    style: 'v2',
    sitemapLocation: 'sitemap.json'
  };

  render() {
    return this.props.children;
  }
}

export default App;
