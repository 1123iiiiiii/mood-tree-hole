import { View, Text } from '@tarojs/components';
import './index.css';

interface Record {
  _id: string;
  mood: string;
  intensity: number;
  createdAt: string;
}

interface MoodCurveChartProps {
  records: Record[];
}

export default function MoodCurveChart({ records }: MoodCurveChartProps) {
  if (!records || records.length === 0) {
    return (
      <View className="chart-empty">
        <Text className="empty-text">暂无数据</Text>
      </View>
    );
  }

  const maxIntensity = 10;
  const chartHeight = 150;

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      happy: '😊', calm: '😌', anxious: '😰',
      sad: '😢', angry: '😠', fearful: '😨', surprised: '😲'
    };
    return emojis[mood] || '😊';
  };

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      happy: '#fbbf24', calm: '#34d399', anxious: '#f87171',
      sad: '#60a5fa', angry: '#f87171', fearful: '#a78bfa', surprised: '#fb923c'
    };
    return colors[mood] || '#6366f1';
  };

  return (
    <View className="mood-chart">
      <View className="chart-container">
        {records.slice(0, 7).map((record, index) => {
          const height = (record.intensity / maxIntensity) * chartHeight;
          const color = getMoodColor(record.mood);
          const emoji = getMoodEmoji(record.mood);
          const date = new Date(record.createdAt);
          const day = `${date.getMonth() + 1}/${date.getDate()}`;

          return (
            <View key={record._id} className="chart-bar-wrapper">
              <View 
                className="chart-bar" 
                style={{ 
                  height: `${height}px`,
                  backgroundColor: color
                }}
              >
                <Text className="bar-emoji">{emoji}</Text>
              </View>
              <Text className="bar-label">{day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

interface MoodPieChartProps {
  records: Record[];
}

export function MoodPieChart({ records }: MoodPieChartProps) {
  if (!records || records.length === 0) {
    return (
      <View className="chart-empty">
        <Text className="empty-text">暂无数据</Text>
      </View>
    );
  }

  const moodCounts: Record<string, number> = {};
  records.forEach(r => {
    moodCounts[r.mood] = (moodCounts[r.mood] || 0) + 1;
  });

  const total = records.length;
  const moodColors: Record<string, string> = {
    happy: '#fbbf24', calm: '#34d399', anxious: '#f87171',
    sad: '#60a5fa', angry: '#f87171', fearful: '#a78bfa', surprised: '#fb923c'
  };

  const moodLabels: Record<string, string> = {
    happy: '开心', calm: '平静', anxious: '焦虑',
    sad: '悲伤', angry: '愤怒', fearful: '恐惧', surprised: '惊讶'
  };

  return (
    <View className="mood-pie">
      {Object.entries(moodCounts).map(([mood, count]) => (
        <View key={mood} className="pie-item">
          <View className="pie-info">
            <View 
              className="pie-dot" 
              style={{ backgroundColor: moodColors[mood] }}
            />
            <Text className="pie-label">{moodLabels[mood] || mood}</Text>
          </View>
          <View className="pie-bar-wrapper">
            <View 
              className="pie-bar" 
              style={{ 
                width: `${(count / total) * 100}%`,
                backgroundColor: moodColors[mood]
              }}
            />
          </View>
          <Text className="pie-count">{count}次</Text>
        </View>
      ))}
    </View>
  );
}

interface MoodHeatmapProps {
  records: Record[];
}

export function MoodHeatmap({ records }: MoodHeatmapProps) {
  if (!records || records.length === 0) {
    return (
      <View className="chart-empty">
        <Text className="empty-text">暂无数据</Text>
      </View>
    );
  }

  const hourCounts: Record<number, number> = {};
  records.forEach(r => {
    const hour = new Date(r.createdAt).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const maxCount = Math.max(...Object.values(hourCounts), 1);

  return (
    <View className="mood-heatmap">
      <View className="heatmap-grid">
        {[6, 9, 12, 15, 18, 21].map(hour => {
          const count = hourCounts[hour] || 0;
          const intensity = count / maxCount;
          return (
            <View key={hour} className="heatmap-cell">
              <View 
                className="heatmap-block"
                style={{ opacity: 0.3 + intensity * 0.7 }}
              >
                <Text className="heatmap-time">{hour}:00</Text>
                <Text className="heatmap-count">{count}次</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
