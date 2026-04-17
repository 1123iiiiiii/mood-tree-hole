import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, ReferenceDot, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { MoodRecord, MoodType, SmallHappy, SmallHappyRecord } from '@/types';
import { MOOD_COLORS, MOOD_LABELS } from '@/utils/helpers';

interface MoodCurveChartProps {
  records: MoodRecord[];
  smallHappyCompletions?: SmallHappyRecord[];
}

export const MoodCurveChart: React.FC<MoodCurveChartProps> = ({ records, smallHappyCompletions = [] }) => {
  const data = useMemo(() => {
    const grouped: Record<string, { intensity: number[]; date: string; moods: MoodType[] }> = {};
    
    records.forEach(record => {
      const date = new Date(record.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      if (!grouped[date]) {
        grouped[date] = { intensity: [], date, moods: [] };
      }
      grouped[date].intensity.push(record.intensity);
      grouped[date].moods.push(record.mood);
    });

    const smallHappyMap: Record<string, boolean> = {};
    smallHappyCompletions.forEach(record => {
      const date = new Date(record.completedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      smallHappyMap[date] = true;
    });

    return Object.values(grouped).map(({ date, intensity, moods }) => ({
      date,
      intensity: intensity.length > 0 ? (intensity.reduce((a, b) => a + b, 0) / intensity.length).toFixed(1) : 0,
      mood: moods[moods.length - 1] || 'calm',
      hasSmallHappy: smallHappyMap[date] || false
    }));
  }, [records, smallHappyCompletions]);

  const smallHappyDates = useMemo(() => {
    return smallHappyCompletions.map(r => 
      new Date(r.completedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    );
  }, [smallHappyCompletions]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          formatter={(value: number) => [value, '心情强度']}
        />
        <Line 
          type="monotone" 
          dataKey="intensity" 
          stroke="#6366f1" 
          strokeWidth={2}
          dot={{ fill: '#6366f1', strokeWidth: 2 }}
          activeDot={{ r: 6 }}
        />
        {smallHappyDates.map((date, idx) => {
          const point = data.find(d => d.date === date);
          if (point) {
            return (
              <ReferenceDot
                key={idx}
                x={point.date}
                y={parseFloat(point.intensity as unknown as string)}
                r={6}
                fill="#fbbf24"
                stroke="#f59e0b"
                strokeWidth={2}
              />
            );
          }
          return null;
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

interface MoodPieChartProps {
  records: MoodRecord[];
}

export const MoodPieChart: React.FC<MoodPieChartProps> = ({ records }) => {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    records.forEach(record => {
      counts[record.mood] = (counts[record.mood] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name: MOOD_LABELS[name as MoodType] || name,
        value,
        mood: name
      }))
      .sort((a, b) => b.value - a.value);
  }, [records]);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={3}
            dataKey="value"
            labelLine={true}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.mood as MoodType] || '#6366f1'} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string) => [`${value}次`, name]}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
          />
          <Legend 
            layout="horizontal" 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <span 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: MOOD_COLORS[item.mood as MoodType] || '#6366f1' }}
              />
              <span className="text-gray-600">{item.name}</span>
            </div>
            <span className="font-medium text-gray-800">{item.value}次</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface MoodHeatmapProps {
  records: MoodRecord[];
}

export const MoodHeatmap: React.FC<MoodHeatmapProps> = ({ records }) => {
  const { data, isToday } = useMemo(() => {
    const today = new Date().toDateString();
    const isTodayView = records.some(r => new Date(r.createdAt).toDateString() === today);

    if (isTodayView) {
      const hourlyData: Record<number, { intensity: number; count: number }> = {};
      records.forEach(record => {
        const hour = new Date(record.createdAt).getHours();
        if (!hourlyData[hour]) hourlyData[hour] = { intensity: 0, count: 0 };
        hourlyData[hour].intensity += record.intensity;
        hourlyData[hour].count += 1;
      });

      const hours = Object.keys(hourlyData).map(Number).sort((a, b) => a - b);
      return {
        data: hours.map(hour => ({
          time: `${hour}:00`,
          intensity: hourlyData[hour].count > 0
            ? (hourlyData[hour].intensity / hourlyData[hour].count).toFixed(1)
            : 0,
          mood: records.find(r => new Date(r.createdAt).getHours() === hour)?.mood || 'calm'
        })),
        isToday: true
      };
    }

    const dayData: Record<string, { intensity: number; count: number; mood: MoodType }> = {};
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    
    records.forEach(record => {
      const date = new Date(record.createdAt);
      const dayName = weekDays[date.getDay()];
      if (!dayData[dayName]) dayData[dayName] = { intensity: 0, count: 0, mood: record.mood };
      dayData[dayName].intensity += record.intensity;
      dayData[dayName].count += 1;
    });

    return {
      data: weekDays.map(day => ({
        time: day,
        intensity: dayData[day]?.count ? (dayData[day].intensity / dayData[day].count).toFixed(1) : 0,
        mood: dayData[day]?.mood || 'calm'
      })),
      isToday: false
    };
  }, [records]);

  const getColor = (intensity: number) => {
    const numIntensity = parseFloat(intensity as unknown as string);
    if (numIntensity <= 0) return '#f3f4f6';
    if (numIntensity <= 3) return '#fee2e2';
    if (numIntensity <= 5) return '#fef3c7';
    if (numIntensity <= 7) return '#d1fae5';
    return '#10b981';
  };

  if (isToday) {
    return (
      <div className="flex items-end justify-between gap-1 h-40">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full rounded-t-md transition-all"
              style={{ 
                height: `${(parseFloat(item.intensity as unknown as string) / 10) * 100}%`,
                backgroundColor: getColor(parseFloat(item.intensity as unknown as string))
              }}
            />
            <span className="text-xs text-gray-500 mt-1">{item.time}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-1">
      {data.map((item, index) => (
        <div key={index} className="text-center">
          <div 
            className="rounded-md aspect-square flex items-center justify-center text-xs font-medium"
            style={{ 
              backgroundColor: getColor(parseFloat(item.intensity as unknown as string)),
              color: parseFloat(item.intensity as unknown as string) > 5 ? '#fff' : '#374151'
            }}
          >
            {item.intensity}
          </div>
          <span className="text-xs text-gray-500 mt-1 block">{item.time}</span>
        </div>
      ))}
    </div>
  );
};

interface NeedRadarChartProps {
  needs: Record<string, number>;
}

export const NeedRadarChart: React.FC<NeedRadarChartProps> = ({ needs }) => {
  const data = useMemo(() => [
    { subject: '生理需求', value: needs.physiological, fullMark: 100 },
    { subject: '安全需求', value: needs.safety, fullMark: 100 },
    { subject: '社交需求', value: needs.social, fullMark: 100 },
    { subject: '尊重需求', value: needs.esteem, fullMark: 100 },
    { subject: '自我实现', value: needs.selfActualization, fullMark: 100 },
  ], [needs]);

  return (
    <ResponsiveContainer width="100%" height={250}>
      <RadarChart data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Radar name="需求满足度" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};

interface DefenseMechanismChartProps {
  mechanisms: Record<string, number>;
}

export const DefenseMechanismChart: React.FC<DefenseMechanismChartProps> = ({ mechanisms }) => {
  const data = useMemo(() => {
    const mechanismLabels: Record<string, string> = {
      sublimation: '升华',
      humor: '幽默',
      suppression: '压抑',
      rationalization: '合理化',
      projection: '投射',
      denial: '否认',
      regression: '退行'
    };

    return Object.entries(mechanisms)
      .map(([key, value]) => ({
        name: mechanismLabels[key] || key,
        value,
        level: value > 5 ? '高' : value > 2 ? '中' : '低'
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [mechanisms]);

  const getColor = (level: string) => {
    switch (level) {
      case '高': return '#10b981';
      case '中': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-2">
      {data.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">暂无足够的记录数据</p>
      ) : (
        data.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-16 text-sm">{item.name}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all"
                style={{ 
                  width: `${Math.min(item.value * 10, 100)}%`,
                  backgroundColor: getColor(item.level)
                }}
              />
            </div>
            <span className="w-12 text-sm text-right" style={{ color: getColor(item.level) }}>
              {item.level}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

interface GrowthTrackerProps {
  records: MoodRecord[];
  smallHappiness: SmallHappy[];
  smallHappyRecords?: SmallHappyRecord[];
}

export const GrowthTracker: React.FC<GrowthTrackerProps> = ({ records, smallHappiness, smallHappyRecords = [] }) => {
  const stats = useMemo(() => {
    if (records.length === 0) return null;

    const sortedRecords = [...records].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    const firstHalf = sortedRecords.slice(0, Math.floor(sortedRecords.length / 2));
    const secondHalf = sortedRecords.slice(Math.floor(sortedRecords.length / 2));

    const avgFirstHalf = firstHalf.reduce((sum, r) => sum + r.intensity, 0) / (firstHalf.length || 1);
    const avgSecondHalf = secondHalf.reduce((sum, r) => sum + r.intensity, 0) / (secondHalf.length || 1);

    const positiveFirst = firstHalf.filter(r => ['happy', 'calm'].includes(r.mood)).length / (firstHalf.length || 1);
    const positiveSecond = secondHalf.filter(r => ['happy', 'calm'].includes(r.mood)).length / (secondHalf.length || 1);

    const uniqueSmallHappinessIds = new Set(smallHappyRecords.map(r => r.smallHappyId));
    const happinessCompletionRate = smallHappiness.length > 0 
      ? (uniqueSmallHappinessIds.size / smallHappiness.length) * 100 
      : 0;

    const stabilityScore = secondHalf.length > 3 
      ? 100 - (Math.max(...secondHalf.map(r => r.intensity)) - Math.min(...secondHalf.map(r => r.intensity))) * 5
      : 50;

    return {
      intensityChange: avgSecondHalf - avgFirstHalf,
      positiveChange: (positiveSecond - positiveFirst) * 100,
      happinessCompletionRate,
      stabilityScore: Math.max(0, Math.min(100, stabilityScore)),
      streakDays: calculateStreak(records),
      achievements: []
    };
  }, [records, smallHappiness, smallHappyRecords]);

  if (!stats) return null;

  const achievements = [
    { 
      id: 'first_record', 
      title: '初次记录', 
      description: '记录第一条心情', 
      unlocked: records.length >= 1,
      icon: '🌱'
    },
    { 
      id: 'week_streak', 
      title: '坚持一周', 
      description: '连续记录7天', 
      unlocked: stats.streakDays >= 7,
      icon: '📅'
    },
    { 
      id: 'hundred_records', 
      title: '百次记录', 
      description: '记录100条心情', 
      unlocked: records.length >= 100,
      icon: '💯'
    },
    { 
      id: 'positive_up', 
      title: '正向提升', 
      description: '正向情绪提升10%以上', 
      unlocked: stats.positiveChange >= 10,
      icon: '📈'
    },
    { 
      id: 'happiness_master', 
      title: '小确幸达人', 
      description: '完成10个小确幸', 
      unlocked: stats.happinessCompletionRate >= 50,
      icon: '✨'
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
          <p className="text-2xl font-bold text-green-600">
            {stats.intensityChange >= 0 ? '+' : ''}{stats.intensityChange.toFixed(1)}
          </p>
          <p className="text-xs text-green-600">强度变化</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
          <p className="text-2xl font-bold text-blue-600">
            {stats.positiveChange >= 0 ? '+' : ''}{stats.positiveChange.toFixed(0)}%
          </p>
          <p className="text-xs text-blue-600">正向情绪变化</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
          <p className="text-2xl font-bold text-purple-600">{stats.streakDays}</p>
          <p className="text-xs text-purple-600">连续记录天数</p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3">
          <p className="text-2xl font-bold text-orange-600">{stats.happinessCompletionRate.toFixed(0)}%</p>
          <p className="text-xs text-orange-600">小确幸完成率</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-700 mb-3">🏆 成就解锁</h4>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map(achievement => (
            <div 
              key={achievement.id}
              className={`p-3 rounded-lg border-2 transition-all ${
                achievement.unlocked 
                  ? 'border-yellow-200 bg-yellow-50' 
                  : 'border-gray-100 bg-gray-50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{achievement.icon}</span>
                <div>
                  <p className={`text-sm font-medium ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                    {achievement.title}
                  </p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function calculateStreak(records: MoodRecord[]): number {
  if (records.length === 0) return 0;

  const sortedRecords = [...records].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const record of sortedRecords) {
    const recordDate = new Date(record.createdAt);
    recordDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      streak++;
      currentDate = recordDate;
    } else {
      break;
    }
  }

  return streak;
}

export const WeekdayVsWeekendChart: React.FC<{ records: MoodRecord[] }> = ({ records }) => {
  const data = useMemo(() => {
    const weekday = { happy: 0, calm: 0, anxious: 0, sad: 0, other: 0 };
    const weekend = { happy: 0, calm: 0, anxious: 0, sad: 0, other: 0 };

    records.forEach(record => {
      const day = new Date(record.createdAt).getDay();
      const target = day === 0 || day === 6 ? weekend : weekday;
      
      if (['happy', 'calm'].includes(record.mood)) target.happy++;
      else if (record.mood === 'anxious' || record.mood === 'sad') target[record.mood]++;
      else target.other++;
    });

    return [
      { name: '工作日', ...weekday },
      { name: '周末', ...weekend }
    ];
  }, [records]);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="happy" stackId="a" fill="#10b981" name="正向" />
        <Bar dataKey="anxious" stackId="a" fill="#f59e0b" name="焦虑" />
        <Bar dataKey="sad" stackId="a" fill="#3b82f6" name="悲伤" />
        <Bar dataKey="other" stackId="a" fill="#6b7280" name="其他" />
      </BarChart>
    </ResponsiveContainer>
  );
};
