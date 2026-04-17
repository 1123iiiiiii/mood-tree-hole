import React from 'react';
import { MoodType } from '@/types';
import { moodInterpretations, affirmations, recommendedActivities } from '@/data/psychology';
import { Card } from '@/components/ui';
import { MOOD_EMOJIS, MOOD_LABELS } from '@/utils/helpers';

interface MixedMood {
  mood: MoodType;
  percentage: number;
}

interface DeepAnalysis {
  maslowNeeds: Record<string, number>;
  defenseMechanisms: Record<string, string>;
  triggers: string[];
  personality: string[];
  growth: string[];
}

interface PsychologyCardProps {
  mood: MoodType;
  insight?: string;
  mixedMoods?: MixedMood[];
  deepAnalysis?: DeepAnalysis | null;
}

export const PsychologyCard: React.FC<PsychologyCardProps> = ({ mood, insight, mixedMoods, deepAnalysis }) => {
  const interpretation = moodInterpretations[mood];
  const affirmation = affirmations[mood][0];
  const activities = recommendedActivities[mood];

  const needLabels: Record<string, string> = {
    physiological: '生理需求',
    safety: '安全需求',
    social: '社交需求',
    esteem: '尊重需求',
    selfActualization: '自我实现'
  };

  const maxNeed = deepAnalysis ? Math.max(...Object.values(deepAnalysis.maslowNeeds)) : 0;
  const dominantNeed = deepAnalysis ? Object.entries(deepAnalysis.maslowNeeds).find(([_, v]) => v === maxNeed)?.[0] : null;

  return (
    <div className="space-y-4">
      <Card className="border-l-4 border-primary">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{MOOD_EMOJIS[mood]}</span>
          <div className="flex-1">
            <h3 className="font-semibold text-text-primary mb-2">
              {MOOD_LABELS[mood]}的心理学解读
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              {interpretation}
            </p>
          </div>
        </div>
      </Card>

      {insight && (
        <Card className="border-l-4 border-amber-400">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎓</span>
            <h3 className="font-semibold text-text-primary">
              AI心理分析师
            </h3>
          </div>
          <div className="bg-amber-50 p-3 rounded">
            <p className="text-sm text-text-primary leading-relaxed">
              {insight}
            </p>
          </div>
        </Card>
      )}

      {mixedMoods && mixedMoods.length > 1 && (
        <Card>
          <h3 className="font-medium text-text-primary mb-3">
            情绪构成
          </h3>
          <div className="space-y-2">
            {mixedMoods.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.mood === 'happy' ? '#FFD93D' : item.mood === 'calm' ? '#6BCB77' : item.mood === 'anxious' ? '#FF6B6B' : item.mood === 'sad' ? '#4D96FF' : item.mood === 'angry' ? '#FF6B6B' : item.mood === 'fearful' ? '#9D65C9' : '#FF922B' }}></span>
                <span className="text-sm text-text-secondary flex-1">{MOOD_LABELS[item.mood]}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {deepAnalysis && (
        <>
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">🔬</span>
              <h3 className="font-semibold text-text-primary">马斯洛需求分析</h3>
            </div>
            <div className="space-y-2">
              {Object.entries(deepAnalysis.maslowNeeds)
                .sort(([, a], [, b]) => b - a)
                .map(([need, value]) => (
                  <div key={need} className="flex items-center gap-2">
                    <span className="w-20 text-xs text-gray-600">{needLabels[need]}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${need === dominantNeed ? 'bg-primary' : 'bg-blue-300'}`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-xs text-right font-medium">{value}%</span>
                  </div>
                ))}
            </div>
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
              💡 你目前最强烈的需求是<strong>{dominantNeed ? needLabels[dominantNeed] : '未知'}</strong>，这可能正在影响你的情绪状态
            </div>
          </Card>

          {Object.keys(deepAnalysis.defenseMechanisms).length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🛡️</span>
                <h3 className="font-semibold text-text-primary">心理防御机制</h3>
              </div>
              <div className="space-y-2">
                {Object.entries(deepAnalysis.defenseMechanisms).map(([mechanism, description], index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded">
                    <span className="font-medium text-sm text-primary">{mechanism}</span>
                    <p className="text-xs text-gray-600 mt-1">{description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {deepAnalysis.triggers.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">⚡</span>
                <h3 className="font-semibold text-text-primary">情绪触发因素</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {deepAnalysis.triggers.map((trigger, index) => (
                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                    {trigger}
                  </span>
                ))}
              </div>
            </Card>
          )}

          {deepAnalysis.personality.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🧠</span>
                <h3 className="font-semibold text-text-primary">性格洞察</h3>
              </div>
              <div className="space-y-2">
                {deepAnalysis.personality.map((trait, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-sm text-gray-700">{trait}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {deepAnalysis.growth.length > 0 && (
            <Card className="border-l-4 border-green-400">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">🌱</span>
                <h3 className="font-semibold text-text-primary">成长建议</h3>
              </div>
              <div className="space-y-2">
                {deepAnalysis.growth.map((suggestion, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-sm text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      <Card>
        <h3 className="font-medium text-text-primary mb-3">温暖话语</h3>
        <div className="bg-primary/5 border-l-2 border-primary p-3 rounded">
          <p className="text-sm text-text-primary italic">"{affirmation}"</p>
        </div>
      </Card>

      <Card>
        <h3 className="font-medium text-text-primary mb-3">推荐活动</h3>
        <div className="space-y-2">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span>
              <span className="text-sm text-text-secondary">{activity}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
