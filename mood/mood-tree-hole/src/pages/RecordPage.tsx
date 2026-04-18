import React, { useState } from 'react';
import axios from 'axios';
import { useMood } from '@/context/MoodContext';
import { MoodSelector } from '@/components/mood/MoodSelector';
import { PsychologyCard } from '@/components/psychology/PsychologyCard';
import { Card, Button, TextArea, Slider, Badge } from '@/components/ui';
import { MOOD_LABELS } from '@/utils/helpers';
import { Tag, MoodType } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const TAG_OPTIONS: { value: Tag; label: string }[] = [
  { value: 'work', label: '工作' },
  { value: 'family', label: '家庭' },
  { value: 'health', label: '健康' },
  { value: 'relationship', label: '人际关系' },
  { value: 'finance', label: '财务' },
  { value: 'study', label: '学习' },
  { value: 'other', label: '其他' },
];

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

export const RecordPage: React.FC = () => {
  const { state, setDraft, submitRecord } = useMood();
  const { currentDraft } = state;
  const [activeTab, setActiveTab] = useState<'mood' | 'event'>('mood');
  const [showPsychology, setShowPsychology] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mixedMoods, setMixedMoods] = useState<MixedMood[]>([]);
  const [analysisInsight, setAnalysisInsight] = useState('');
  const [deepAnalysis, setDeepAnalysis] = useState<DeepAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleMoodSelect = (mood: typeof currentDraft.mood) => {
    if (mood) {
      setDraft({ 
        mood, 
        intensity: 5, // 重置强度
        event: '', // 重置事件
        tags: [] // 重置标签
      });
      setShowPsychology(true);
      setMixedMoods([]);
      setAnalysisInsight('');
    }
  };

  const analyzeEvent = async (event: string) => {
    if (event.length < 10) return;

    setIsAnalyzing(true);
    setMixedMoods([]);
    setAnalysisInsight('');
    setDeepAnalysis(null);
    setAnalysisError(null);

    try {
      const response = await axios.post<{
        success: boolean;
        analysis: {
          emotion?: string;
          reason?: string;
          insight?: string;
          action?: string;
          emotionIntensity?: number;
        };
      }>(`${API_BASE_URL}/deepseek/ai-analyze`, {
        event,
        mood: currentDraft.mood
      }, {
        timeout: 30000
      });

      if (response.data.success && response.data.analysis) {
        const analysis = response.data.analysis;

        setAnalysisInsight(analysis.insight || analysis.action || '');

        // 完整情绪映射表
        const emotionMap: Record<string, MoodType> = {
          '开心': 'happy', '快乐': 'happy', '愉快': 'happy', '幸福': 'happy', '喜悦': 'happy', '高兴': 'happy', '愉悦': 'happy',
          '平静': 'calm', '安宁': 'calm', '放松': 'calm', '宁静': 'calm', '舒适': 'calm', '平和': 'calm',
          '焦虑': 'anxious', '不安': 'anxious', '紧张': 'anxious', '忧虑': 'anxious', '担忧': 'anxious', '压力大': 'anxious', '压抑': 'anxious',
          '悲伤': 'sad', '难过': 'sad', '伤心': 'sad', '失落': 'sad', '沮丧': 'sad', '忧郁': 'sad', '痛苦': 'sad',
          '愤怒': 'angry', '生气': 'angry', '恼火': 'angry', '烦躁': 'angry', '不满': 'angry', '气愤': 'angry',
          '恐惧': 'fearful', '害怕': 'fearful', '惶恐': 'fearful', '畏惧': 'fearful', '胆怯': 'fearful',
          '惊讶': 'surprised', '意外': 'surprised', '震惊': 'surprised', '惊喜': 'surprised'
        };

        // 找到匹配的关键词
        let bestMatch: MoodType = 'calm';
        let maxLength = 0;
        const emotionText = analysis.emotion || '';

        // 遍历所有情绪关键词找最长匹配
        for (const [keyword, mood] of Object.entries(emotionMap)) {
          if (emotionText.includes(keyword) && keyword.length > maxLength) {
            bestMatch = mood;
            maxLength = keyword.length;
          }
        }

        // 使用AI分析的情绪和强度
        const aiIntensity = analysis.emotionIntensity || 5;

        setDraft({
          mood: bestMatch,
          intensity: aiIntensity
        });

        const mappedDeepAnalysis: DeepAnalysis = {
          maslowNeeds: { physiological: 50, safety: 50, social: 50, esteem: 50, selfActualization: 50 },
          defenseMechanisms: {},
          triggers: analysis.reason ? [analysis.reason] : [],
          personality: [],
          growth: analysis.action ? [analysis.action] : []
        };

        setDeepAnalysis(mappedDeepAnalysis);
        setShowPsychology(true);
      }
    } catch (error: any) {
      console.error('DeepSeek分析失败:', error);

      if (error.code === 'ECONNABORTED' || error.response?.status === 504) {
        setAnalysisError('AI分析超时，请检查网络后重试');
      } else if (error.response?.status === 401) {
        setAnalysisError('AI服务未授权，请联系管理员');
      } else if (error.response?.status === 429) {
        setAnalysisError('AI分析请求过于频繁，请稍后再试');
      } else if (error.response?.data?.error) {
        setAnalysisError(error.response.data.error);
      } else {
        setAnalysisError('AI分析服务暂时不可用，请稍后再试');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (currentDraft.mood) {
      submitRecord();
      setShowPsychology(false);
      setMixedMoods([]);
      setAnalysisInsight('');
      setDeepAnalysis(null);
    }
  };

  const toggleTag = (tag: Tag) => {
    const newTags = currentDraft.tags.includes(tag)
      ? currentDraft.tags.filter((t) => t !== tag)
      : [...currentDraft.tags, tag];
    setDraft({ tags: newTags });
  };

  const isValid = currentDraft.mood && (activeTab === 'mood' || currentDraft.event.length >= 1);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex space-x-2 mb-4">
          <button
            className={`flex-1 py-2 rounded-t-lg ${activeTab === 'mood' ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary'}`}
            onClick={() => setActiveTab('mood')}
          >
            选择心情
          </button>
          <button
            className={`flex-1 py-2 rounded-t-lg ${activeTab === 'event' ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary'}`}
            onClick={() => setActiveTab('event')}
          >
            心情随笔
          </button>
        </div>

        {activeTab === 'mood' ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">今天的心情如何？</h2>
            <MoodSelector
              selectedMood={currentDraft.mood}
              onSelect={handleMoodSelect}
            />
            {currentDraft.mood && (
              <>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-text-primary mb-2">心情强度</h4>
                  <Slider
                    value={currentDraft.intensity}
                    onChange={(value) => setDraft({ intensity: value })}
                    min={1}
                    max={10}
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    {MOOD_LABELS[currentDraft.mood]}感 {currentDraft.intensity > 5 ? '较强烈' : '较轻微'}
                  </p>
                </div>
                <TextArea
                  label="详细描述（可选）"
                  placeholder="可以详细描述一下当时的情况..."
                  rows={3}
                  value={currentDraft.event}
                  onChange={(e) => setDraft({ event: e.target.value })}
                />
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-text-primary">今日随想</h2>
            <p className="text-sm text-text-secondary">
              当心情复杂难以言喻时，写下你的故事，让我们帮你解读
            </p>
            <TextArea
              label="心情随笔"
              placeholder="写下今天的故事，让心情自然流淌...\n\n这里可以记录你的感受、经历、想法，无论开心还是难过，复杂还是简单"
              rows={4}
              value={currentDraft.event}
              onChange={(e) => {
                setDraft({ event: e.target.value });
              }}
            />
            {currentDraft.event.length > 0 && currentDraft.event.length < 10 && (
              <p className="text-xs text-amber-600">📝 再写一些内容（至少10个字），AI分析师就能更好地理解你</p>
            )}
            {currentDraft.event.length >= 10 && !isAnalyzing && !deepAnalysis && (
              <button
                onClick={() => analyzeEvent(currentDraft.event)}
                className="w-full py-3 bg-gradient-to-r from-primary to-purple-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <span>💭</span>
                <span>陪伴理解我</span>
              </button>
            )}
            {isAnalyzing && (
              <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-amber-500"></div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-amber-700">正在分析中...</p>
                  </div>
                </div>
              </div>
            )}
            {analysisError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-700 mb-1">AI分析暂时不可用</p>
                    <p className="text-xs text-red-600">{analysisError}</p>
                    {analysisError.includes('本地AI未运行') && (
                      <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                        <p className="font-medium text-red-700">解决方法：</p>
                        <p className="text-red-600">1. 安装Ollama: ollama.com/download</p>
                        <p className="text-red-600">2. 运行: <code className="bg-red-100 px-1 rounded">ollama run llama3.2</code></p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {deepAnalysis && !isAnalyzing && (
              <div className="p-4 bg-white border border-primary/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💭</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary mb-1">AI分析</p>
                    <p className="text-sm text-text-primary">{analysisInsight}</p>
                    {deepAnalysis.triggers.length > 0 && (
                      <p className="text-xs text-text-secondary mt-2">
                        <span className="text-amber-600">原因：</span>{deepAnalysis.triggers[0]}
                      </p>
                    )}
                    {deepAnalysis.growth.length > 0 && (
                      <p className="text-xs text-green-600 mt-1">
                        <span>💡 </span>{deepAnalysis.growth[0]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {currentDraft.mood && (
        <Card>
          <label className="block text-sm font-medium text-text-secondary mb-3">
            相关标签（可选）
          </label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((tag) => (
              <Badge
                key={tag.value}
                variant={currentDraft.tags.includes(tag.value) ? 'primary' : 'default'}
                className="cursor-pointer"
                onClick={() => toggleTag(tag.value)}
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {currentDraft.mood && (
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full"
          size="lg"
        >
          {isValid ? '保存记录' : activeTab === 'event' ? '请输入心情随笔' : '请选择心情'}
        </Button>
      )}
    </div>
  );
};
