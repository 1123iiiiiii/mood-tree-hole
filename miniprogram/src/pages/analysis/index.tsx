import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { MoodCurveChart, MoodPieChart, MoodHeatmap, NeedRadarChart } from '@/components/charts/MoodCharts';
import { Card } from '@/components/Card';
import { request } from '@/utils/request';
import './index.css';

const TIME_PRESETS = [
  { value: 'today', label: '今天' },
  { value: 'week', label: '本周' },
  { value: 'month', label: '本月' },
  { value: 'quarter', label: '本季' },
  { value: 'year', label: '本年' }
];

export default function AnalysisPage() {
  const [selectedPreset, setSelectedPreset] = useState('week');
  const [records, setRecords] = useState<any[]>([]);
  const [smallHappiness, setSmallHappiness] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRecords: 0,
    avgIntensity: 0,
    positiveRate: 0,
    streakDays: 0
  });

  useEffect(() => {
    loadData();
  }, [selectedPreset]);

  const loadData = async () => {
    try {
      const [moodRes, happyRes] = await Promise.all([
        request('/mood', 'GET'),
        request('/smallHappy', 'GET')
      ]);
      
      setRecords(moodRes.records || []);
      setSmallHappiness(happyRes.smallHappies || []);
      
      if (moodRes.records) {
        const totalRecords = moodRes.records.length;
        const avgIntensity = moodRes.records.reduce((sum: number, r: any) => sum + r.intensity, 0) / (totalRecords || 1);
        const positiveRecords = moodRes.records.filter((r: any) => ['happy', 'calm'].includes(r.mood)).length;
        const positiveRate = (positiveRecords / totalRecords) * 100;
        
        setStats({
          totalRecords,
          avgIntensity: avgIntensity.toFixed(1),
          positiveRate: positiveRate.toFixed(0),
          streakDays: calculateStreak(moodRes.records)
        });
      }
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  const calculateStreak = (records: any[]) => {
    if (!records || records.length === 0) return 0;
    
    const today = new Date().toDateString();
    let streak = 0;
    let currentDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toDateString();
      const hasRecord = records.some((r: any) => 
        new Date(r.createdAt).toDateString() === dateStr
      );
      
      if (hasRecord) {
        streak++;
      } else if (i > 0) {
        break;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  const getTimeRange = () => {
    const now = new Date();
    const ranges: Record<string, { start: Date; end: Date }> = {
      today: { start: new Date(now.setHours(0, 0, 0, 0)), end: new Date() },
      week: { start: new Date(now.setDate(now.getDate() - 7)), end: new Date() },
      month: { start: new Date(now.setMonth(now.getMonth() - 1)), end: new Date() },
      quarter: { start: new Date(now.setMonth(now.getMonth() - 3)), end: new Date() },
      year: { start: new Date(now.setFullYear(now.getFullYear() - 1)), end: new Date() }
    };
    return ranges[selectedPreset] || ranges.week;
  };

  const filteredRecords = records.filter((r: any) => {
    const range = getTimeRange();
    const recordDate = new Date(r.createdAt);
    return recordDate >= range.start && recordDate <= range.end;
  });

  return (
    <View className="page-container">
      <View className="time-selector">
        {TIME_PRESETS.map(preset => (
          <View
            key={preset.value}
            className={`time-preset ${selectedPreset === preset.value ? 'active' : ''}`}
            onClick={() => setSelectedPreset(preset.value)}
          >
            {preset.label}
          </View>
        ))}
      </View>

      <View className="stats-grid">
        <Card className="stat-card">
          <Text className="stat-value">{stats.totalRecords}</Text>
          <Text className="stat-label">记录总数</Text>
        </Card>
        <Card className="stat-card">
          <Text className="stat-value">{stats.avgIntensity}</Text>
          <Text className="stat-label">平均强度</Text>
        </Card>
        <Card className="stat-card">
          <Text className="stat-value">{stats.positiveRate}%</Text>
          <Text className="stat-label">正向情绪</Text>
        </Card>
        <Card className="stat-card">
          <Text className="stat-value">{stats.streakDays}</Text>
          <Text className="stat-label">连续天数</Text>
        </Card>
      </View>

      <Card>
        <Text className="section-title">心情曲线</Text>
        <MoodCurveChart records={filteredRecords} />
      </Card>

      <Card>
        <Text className="section-title">情绪分布</Text>
        <MoodPieChart records={filteredRecords} />
      </Card>

      <Card>
        <Text className="section-title">时段分析</Text>
        <MoodHeatmap records={filteredRecords} />
      </Card>
    </View>
  );
}
