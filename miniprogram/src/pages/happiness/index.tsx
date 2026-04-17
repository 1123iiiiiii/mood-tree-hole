import Taro from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { request } from '@/utils/request';
import './index.css';

export default function HappinessPage() {
  const [smallHappiness, setSmallHappiness] = useState<any[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await request('/smallHappy', 'GET');
      setSmallHappiness(res.smallHappies || []);
    } catch (error) {
      console.error('加载失败:', error);
    }
  };

  const addItem = async () => {
    if (!newItem.trim()) return;
    
    try {
      await request('/smallHappy', 'POST', {
        title: newItem,
        completed: false
      });
      setNewItem('');
      loadData();
      Taro.showToast({ title: '添加成功', icon: 'success' });
    } catch (error) {
      Taro.showToast({ title: '添加失败', icon: 'none' });
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      await request(`/smallHappy/${id}`, 'PUT', { completed: !completed });
      loadData();
    } catch (error) {
      Taro.showToast({ title: '更新失败', icon: 'none' });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await request(`/smallHappy/${id}`, 'DELETE');
      loadData();
    } catch (error) {
      Taro.showToast({ title: '删除失败', icon: 'none' });
    }
  };

  const completedCount = smallHappiness.filter(h => h.completed).length;

  return (
    <View className="page-container">
      <View className="header">
        <Text className="title">小确幸清单</Text>
        <Text className="subtitle">完成 {completedCount}/{smallHappiness.length}</Text>
      </View>

      <View className="add-section">
        <Input
          className="add-input"
          placeholder="添加新的小确幸..."
          value={newItem}
          onInput={(e) => setNewItem(e.detail.value)}
          onConfirm={addItem}
        />
      </View>

      <View className="happiness-list">
        {smallHappiness.map(item => (
          <Card key={item._id} className={`happiness-item ${item.completed ? 'completed' : ''}`}>
            <View 
              className="happiness-content"
              onClick={() => toggleComplete(item._id, item.completed)}
            >
              <View className={`checkbox ${item.completed ? 'checked' : ''}`}>
                {item.completed && '✓'}
              </View>
              <Text className="happiness-title">{item.title}</Text>
            </View>
            <Text 
              className="delete-btn"
              onClick={() => deleteItem(item._id)}
            >
              ×
            </Text>
          </Card>
        ))}
      </View>

      {smallHappiness.length === 0 && (
        <View className="empty-state">
          <Text className="empty-emoji">✨</Text>
          <Text className="empty-text">还没有小确幸</Text>
          <Text className="empty-hint">添加一些让你开心的小事吧</Text>
        </View>
      )}
    </View>
  );
}
