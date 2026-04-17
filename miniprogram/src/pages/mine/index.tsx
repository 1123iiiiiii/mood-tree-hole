import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { Card } from '@/components/Card';
import './index.css';

export default function MinePage() {
  const handleExport = () => {
    Taro.showToast({ title: '导出功能开发中', icon: 'none' });
  };

  const handleAbout = () => {
    Taro.showModal({
      title: '关于心情树洞',
      content: '心情树洞 v2.0\n\n一款智能心理分析心情记录应用\n\n基于React + Node.js + DeepSeek AI',
      showCancel: false
    });
  };

  return (
    <View className="page-container">
      <View className="user-header">
        <View className="avatar">
          <Text className="avatar-text">🌟</Text>
        </View>
        <Text className="username">心情记录者</Text>
        <Text className="user-hint">记录生活，关爱心灵</Text>
      </View>

      <Card className="menu-card">
        <View className="menu-item" onClick={handleExport}>
          <Text className="menu-icon">📤</Text>
          <Text className="menu-text">导出数据</Text>
          <Text className="menu-arrow">›</Text>
        </View>
        <View className="menu-item" onClick={handleAbout}>
          <Text className="menu-icon">ℹ️</Text>
          <Text className="menu-text">关于应用</Text>
          <Text className="menu-arrow">›</Text>
        </View>
      </Card>

      <View className="app-info">
        <Text className="app-version">心情树洞 v2.0</Text>
        <Text className="app-tech">React + Node.js + DeepSeek AI</Text>
      </View>
    </View>
  );
}
