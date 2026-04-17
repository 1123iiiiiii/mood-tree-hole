import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { request } from '@/utils/request';
import './index.css';

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  calm: '😌',
  anxious: '😰',
  sad: '😢',
  angry: '😠',
  fearful: '😨',
  surprised: '😲'
};

export default function HistoryPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await request('/mood', 'GET');
      setRecords(res.records || []);
    } catch (error) {
      console.error('加载历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await request(`/mood/${id}`, 'DELETE');
      Taro.showToast({ title: '删除成功', icon: 'success' });
      loadHistory();
    } catch (error) {
      Taro.showToast({ title: '删除失败', icon: 'none' });
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <View className="page-container">
      <View className="header">
        <Text className="title">历史记录</Text>
        <Text className="subtitle">共 {records.length} 条记录</Text>
      </View>

      {loading ? (
        <View className="loading">
          <Text>加载中...</Text>
        </View>
      ) : records.length === 0 ? (
        <View className="empty-state">
          <Text className="empty-emoji">📝</Text>
          <Text className="empty-text">暂无记录</Text>
          <Text className="empty-hint">开始记录你的心情吧</Text>
        </View>
      ) : (
        <View className="history-list">
          {records.map(record => (
            <Card key={record._id} className="history-item">
              <View className="record-header">
                <View className="mood-badge">
                  <Text className="mood-emoji">{MOOD_EMOJIS[record.mood] || '😊'}</Text>
                  <Text className="mood-intensity">{record.intensity}/10</Text>
                </View>
                <Text className="record-date">{formatDate(record.createdAt)}</Text>
              </View>
              
              {record.event && (
                <Text className="record-event">{record.event}</Text>
              )}
              
              {record.tags && record.tags.length > 0 && (
                <View className="record-tags">
                  {record.tags.map((tag: string) => (
                    <Text key={tag} className="tag">{tag}</Text>
                  ))}
                </View>
              )}
              
              <View 
                className="delete-btn"
                onClick={() => deleteRecord(record._id)}
              >
                删除
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}
