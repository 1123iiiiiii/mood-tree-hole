import React, { useState, useEffect } from 'react';
import { useMood } from '@/context/MoodContext';
import { useSmallHappy } from '@/context/SmallHappyContext';
import { Card, Button, Tabs, Tab } from '@/components/ui';
import { MoodCurveChart, MoodPieChart, MoodHeatmap, NeedRadarChart, DefenseMechanismChart, GrowthTracker } from '@/components/charts/MoodCharts';
import { getTimeRange } from '@/utils/dateUtils';
import { MoodRecord, MoodType } from '@/types';
import { MOOD_LABELS } from '@/utils/helpers';

type TimePreset = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
type TabType = 'overview' | 'trends' | 'insights' | 'growth';

const STORAGE_KEY_TIME_PRESET = 'mood_time_preset';
const STORAGE_KEY_CUSTOM_START = 'mood_custom_start';
const STORAGE_KEY_CUSTOM_END = 'mood_custom_end';

export const AnalysisPage: React.FC = () => {
  const { state: moodState } = useMood();
  const { state: smallHappyState } = useSmallHappy();
  const [selectedTab, setSelectedTab] = useState<TabType>('overview');
  const [selectedPreset, setSelectedPreset] = useState<TimePreset>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TIME_PRESET);
    return (saved as TimePreset) || 'week';
  });
  const [customDateRange, setCustomDateRange] = useState(() => {
    const savedStart = localStorage.getItem(STORAGE_KEY_CUSTOM_START) || '';
    const savedEnd = localStorage.getItem(STORAGE_KEY_CUSTOM_END) || '';
    return { start: savedStart, end: savedEnd };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TIME_PRESET, selectedPreset);
    if (customDateRange.start) localStorage.setItem(STORAGE_KEY_CUSTOM_START, customDateRange.start);
    if (customDateRange.end) localStorage.setItem(STORAGE_KEY_CUSTOM_END, customDateRange.end);
  }, [selectedPreset, customDateRange]);

  const timeRange = getTimeRange(selectedPreset, customDateRange.start, customDateRange.end);

  const filteredRecords = moodState.records.filter((record: MoodRecord) => {
    const recordDate = new Date(record.createdAt);
    return recordDate >= new Date(timeRange.startDate) && recordDate <= new Date(timeRange.endDate);
  });

  // 基础统计
  const averageIntensity = filteredRecords.length > 0
    ? (filteredRecords.reduce((sum: number, r: MoodRecord) => sum + r.intensity, 0) / filteredRecords.length).toFixed(1)
    : '0';

  const moodCounts = filteredRecords.reduce((acc: Record<string, number>, r: MoodRecord) => {
    acc[r.mood] = (acc[r.mood] || 0) + 1;
    return acc;
  }, {});

  const dominantMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || null;

  // 马斯洛需求层次分析
  const analyzeMaslowNeeds = (records: MoodRecord[]) => {
    const needs = {
      physiological: 50,
      safety: 65,
      social: 45,
      esteem: 70,
      selfActualization: 60
    };

    records.forEach(record => {
      // 简单的需求分析逻辑
      if (record.event?.includes('睡眠') || record.event?.includes('休息') || record.event?.includes('身体')) {
        needs.physiological += 5;
      }
      if (record.event?.includes('工作') || record.event?.includes('安全') || record.event?.includes('财务')) {
        needs.safety += 5;
      }
      if (record.event?.includes('朋友') || record.event?.includes('家人') || record.event?.includes('关系')) {
        needs.social += 5;
      }
      if (record.event?.includes('成就') || record.event?.includes('认可') || record.event?.includes('尊重')) {
        needs.esteem += 5;
      }
      if (record.event?.includes('成长') || record.event?.includes('意义') || record.event?.includes('目标')) {
        needs.selfActualization += 5;
      }

      // 情绪影响
      if (record.mood === 'happy') {
        Object.keys(needs).forEach(need => {
          needs[need as keyof typeof needs] += 2;
        });
      } else if (record.mood === 'anxious' || record.mood === 'sad') {
        Object.keys(needs).forEach(need => {
          needs[need as keyof typeof needs] -= 1;
        });
      }
    });

    // 限制在 0-100 范围内
    Object.keys(needs).forEach(need => {
      needs[need as keyof typeof needs] = Math.max(0, Math.min(100, needs[need as keyof typeof needs]));
    });

    return needs;
  };

  // 防御机制分析
  const analyzeDefenseMechanisms = (records: MoodRecord[]) => {
    const mechanisms = {
      sublimation: 0,
      humor: 0,
      suppression: 0,
      rationalization: 0,
      projection: 0,
      denial: 0,
      regression: 0
    };

    records.forEach(record => {
      const event = record.event?.toLowerCase() || '';
      
      if (event.includes('运动') || event.includes('创作') || event.includes('转化')) {
        mechanisms.sublimation += 1;
      } else if (event.includes('幽默') || event.includes('调侃') || event.includes('笑话')) {
        mechanisms.humor += 1;
      } else if (event.includes('控制') || event.includes('冷静') || event.includes('压抑')) {
        mechanisms.suppression += 1;
      } else if (event.includes('因为') || event.includes('所以') || event.includes('理由')) {
        mechanisms.rationalization += 1;
      } else if (event.includes('别人') || event.includes('他们') || event.includes('他让')) {
        mechanisms.projection += 1;
      } else if (event.includes('没有') || event.includes('不是') || event.includes('否认')) {
        mechanisms.denial += 1;
      } else if (event.includes('依赖') || event.includes('逃避') || event.includes('幼稚')) {
        mechanisms.regression += 1;
      }
    });

    return mechanisms;
  };

  // 触发因素分析
  const analyzeTriggers = (records: MoodRecord[]) => {
    const triggers: Record<string, Record<string, number>> = {};

    records.forEach(record => {
      record.tags.forEach(tag => {
        if (!triggers[tag]) {
          triggers[tag] = {};
        }
        triggers[tag][record.mood] = (triggers[tag][record.mood] || 0) + 1;
      });
    });

    return triggers;
  };

  const maslowNeeds = analyzeMaslowNeeds(filteredRecords);
  const defenseMechanisms = analyzeDefenseMechanisms(filteredRecords);
  const triggers = analyzeTriggers(filteredRecords);

  const smallHappyRecords = smallHappyState.records || [];

  const presets: { value: TimePreset; label: string }[] = [
    { value: 'today', label: '今天' },
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'quarter', label: '本季度' },
    { value: 'year', label: '今年' },
    { value: 'custom', label: '自定义' },
  ];

  return (
    <div className="space-y-6">
      {/* 时间段选择器 */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-3">心情趋势分析</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {presets.map((preset) => (
            <Button
              key={preset.value}
              variant={selectedPreset === preset.value ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedPreset(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        {selectedPreset === 'custom' && (
          <div className="flex gap-2 mt-2">
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
              className="border rounded px-3 py-1 text-sm"
            />
            <span className="flex items-center">至</span>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
              className="border rounded px-3 py-1 text-sm"
            />
          </div>
        )}
      </div>

      {/* Tab 切换 */}
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as TabType)}>
        <Tab value="overview" label="统计概览" />
        <Tab value="trends" label="趋势图表" />
        <Tab value="insights" label="洞察报告" />
        <Tab value="growth" label="成长追踪" />
      </Tabs>

      {/* 统计概览 Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Card className="text-center">
              <p className="text-3xl font-bold text-primary">{averageIntensity}</p>
              <p className="text-sm text-text-secondary">平均心情强度</p>
            </Card>
            <Card className="text-center">
              <p className="text-3xl font-bold text-secondary">{filteredRecords.length}</p>
              <p className="text-sm text-text-secondary">记录条数</p>
            </Card>
          </div>

          {dominantMood && (
            <Card>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">主导心情</span>
                <span className="text-lg font-semibold text-primary">
                  {dominantMood === 'happy' ? '☀️ 愉快' :
                   dominantMood === 'calm' ? '🍃 平静' :
                   dominantMood === 'anxious' ? '🌧️ 焦虑' :
                   dominantMood === 'sad' ? '💧 悲伤' :
                   dominantMood === 'angry' ? '🔥 愤怒' :
                   dominantMood === 'fearful' ? '🌙 恐惧' : '✨ 惊讶'}
                </span>
              </div>
            </Card>
          )}

          <Card>
            <h3 className="font-medium text-text-primary mb-4">情绪分布</h3>
            <MoodPieChart records={filteredRecords} />
          </Card>

          <Card>
            <h3 className="font-medium text-text-primary mb-4">快速洞察</h3>
            <div className="space-y-2">
              {filteredRecords.length === 0 ? (
                <p className="text-text-secondary">暂无数据，请先记录心情</p>
              ) : (
                <>
                  <p className="text-sm">• 你的平均心情强度为 {averageIntensity}，{parseFloat(averageIntensity) > 6 ? '状态不错！' : '可以多做些让自己开心的事'}</p>
                  {dominantMood && (
                    <p className="text-sm">• 你最常见的心情是 {MOOD_LABELS[dominantMood as MoodType]}</p>
                  )}
                  <p className="text-sm">• 共记录了 {filteredRecords.length} 条心情，继续保持！</p>
                </>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* 趋势图表 Tab */}
      {selectedTab === 'trends' && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-medium text-text-primary mb-4">心情强度曲线 <span className="text-xs text-amber-500">⭐ 小确幸标记</span></h3>
            <MoodCurveChart records={filteredRecords} smallHappyCompletions={smallHappyRecords} />
          </Card>

          <Card>
            <h3 className="font-medium text-text-primary mb-4">
              {selectedPreset === 'today' ? '今日心情分布' : '时段心情热力图'}
            </h3>
            <MoodHeatmap records={filteredRecords} />
          </Card>

          <Card>
            <h3 className="font-medium text-text-primary mb-4">情绪分布</h3>
            <MoodPieChart records={filteredRecords} />
          </Card>
        </div>
      )}

      {/* 洞察报告 Tab */}
      {selectedTab === 'insights' && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-medium text-text-primary mb-4">🔬 马斯洛需求层次分析</h3>
            <NeedRadarChart needs={maslowNeeds} />
            <div className="mt-4 space-y-2">
              {Object.entries(maslowNeeds).map(([need, score]) => {
                const needLabels: Record<string, string> = {
                  physiological: '生理需求',
                  safety: '安全需求',
                  social: '社交需求',
                  esteem: '尊重需求',
                  selfActualization: '自我实现'
                };
                return (
                  <div key={need} className="flex justify-between items-center">
                    <span className="text-sm">{needLabels[need]}</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{score}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <h3 className="font-medium text-text-primary mb-4">🛡️ 心理防御机制分析</h3>
            <DefenseMechanismChart mechanisms={defenseMechanisms} />
          </Card>

          <Card>
            <h3 className="font-medium text-text-primary mb-4">🔍 情绪触发因素分析</h3>
            <div className="space-y-3">
              {Object.entries(triggers).length === 0 ? (
                <p className="text-text-secondary">暂无足够数据进行分析</p>
              ) : (
                Object.entries(triggers).map(([tag, moods]) => {
                  const tagLabels: Record<string, string> = {
                    work: '工作',
                    family: '家庭',
                    health: '健康',
                    relationship: '人际关系',
                    finance: '财务',
                    study: '学习',
                    other: '其他'
                  };
                  return (
                    <div key={tag} className="border-b pb-2">
                      <p className="font-medium">{tagLabels[tag] || tag}</p>
                      <div className="space-y-1 mt-1">
                        {Object.entries(moods).map(([mood, count]) => (
                          <div key={mood} className="flex justify-between text-sm">
                            <span>{MOOD_LABELS[mood as MoodType]}</span>
                            <span>{count}次</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          <Card>
            <h3 className="font-medium text-text-primary mb-4">🌱 心理成长追踪</h3>
            <div className="space-y-2">
              <p className="text-sm">• 情绪稳定性：{filteredRecords.length > 5 ? '良好' : '需要提升'}</p>
              <p className="text-sm">• 正向情绪占比：{filteredRecords.filter(r => r.mood === 'happy' || r.mood === 'calm').length / filteredRecords.length * 100 || 0}%</p>
              <p className="text-sm">• 小确幸完成率：{smallHappyState.records?.length > 0 ? (smallHappyState.records.filter(r => r.mood).length / smallHappyState.records.length * 100).toFixed(0) : 0}%</p>
              <p className="text-sm">• 连续记录天数：{Math.floor((new Date().getTime() - new Date(moodState.records[0]?.createdAt || new Date()).getTime()) / (1000 * 60 * 60 * 24))}天</p>
            </div>
          </Card>
        </div>
      )}

      {/* 成长追踪 Tab */}
      {selectedTab === 'growth' && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-medium text-text-primary mb-4">📊 心理成长追踪</h3>
            <GrowthTracker 
              records={filteredRecords} 
              smallHappiness={smallHappyState.smallHappies || []}
              smallHappyRecords={smallHappyRecords}
            />
          </Card>

          <Card>
            <h3 className="font-medium text-text-primary mb-4">📈 长期趋势分析</h3>
            <div className="space-y-3">
              {moodState.records.length > 10 ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">总体趋势</span>
                    <span className={`text-sm font-medium ${moodState.records.length > 20 ? 'text-green-600' : 'text-gray-600'}`}>
                      {moodState.records.length > 20 ? '📈 持续改善中' : '📊 数据收集中'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">记录时长</span>
                    <span className="text-sm font-medium">
                      {Math.floor((new Date().getTime() - new Date(moodState.records[moodState.records.length - 1]?.createdAt || new Date()).getTime()) / (1000 * 60 * 60 * 24))} 天
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">小确幸完成总数</span>
                    <span className="text-sm font-medium">{smallHappyState.records?.length || 0} 次</span>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">记录更多心情数据以获得准确的成长分析</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
