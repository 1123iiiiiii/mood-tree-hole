import Taro from '@tarojs/taro';
import { View, Text, Button, Textarea, Slider } from '@tarojs/components';
import { useState, useEffect } from 'react';
import { MoodSelector } from '@/components/MoodSelector';
import { Card } from '@/components/Card';
import { request } from '@/utils/request';
import './index.css';

const MOODS = [
  { value: 'happy', label: '开心', emoji: '😊' },
  { value: 'calm', label: '平静', emoji: '😌' },
  { value: 'anxious', label: '焦虑', emoji: '😰' },
  { value: 'sad', label: '伤心', emoji: '😢' },
  { value: 'angry', label: '生气', emoji: '😠' },
  { value: 'fearful', label: '害怕', emoji: '😨' },
  { value: 'surprised', label: '惊讶', emoji: '😲' }
];

const TAG_OPTIONS = [
  { value: 'work', label: '工作' },
  { value: 'family', label: '家庭' },
  { value: 'health', label: '健康' },
  { value: 'relationship', label: '人际关系' },
  { value: 'finance', label: '财务' },
  { value: 'study', label: '学习' },
  { value: 'other', label: '其他' }
];

export default function RecordPage() {
  const [activeTab, setActiveTab] = useState<'mood' | 'event'>('mood');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [intensity, setIntensity] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [eventText, setEventText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const analyzeEvent = async (event: string) => {
    if (event.length < 10) return;

    setIsAnalyzing(true);
    try {
      const res = await request('/deepseek/ai-analyze', 'POST', { event });
      if (res.success && res.analysis) {
        setAnalysisResult(res.analysis);
        
        const emotionMap: Record<string, string> = {
          '开心': 'happy', '快乐': 'happy', '愉快': 'happy', '幸福': 'happy',
          '平静': 'calm', '安宁': 'calm', '放松': 'calm',
          '焦虑': 'anxious', '不安': 'anxious', '紧张': 'anxious',
          '悲伤': 'sad', '难过': 'sad', '伤心': 'sad',
          '愤怒': 'angry', '生气': 'angry', '恼火': 'angry',
          '恐惧': 'fearful', '害怕': 'fearful',
          '惊讶': 'surprised', '意外': 'surprised'
        };

        const aiMood = res.analysis.emotion ? emotionMap[res.analysis.emotion] || 'calm' : 'calm';
        setSelectedMood(aiMood);
        setIntensity(res.analysis.emotionIntensity || 5);
        setDeepAnalysis(res.analysis);
      }
    } catch (error) {
      Taro.showToast({ title: '分析失败', icon: 'none' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      Taro.showToast({ title: '请选择心情', icon: 'none' });
      return;
    }

    try {
      await request('/mood', 'POST', {
        mood: selectedMood,
        intensity,
        tags: selectedTags,
        event: eventText
      });
      Taro.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/index/index' });
      }, 1500);
    } catch (error) {
      Taro.showToast({ title: '保存失败', icon: 'none' });
    }
  };

  return (
    <View className="page-container">
      <View className="tabs">
        <View 
          className={`tab ${activeTab === 'mood' ? 'active' : ''}`}
          onClick={() => setActiveTab('mood')}
        >
          选择心情
        </View>
        <View 
          className={`tab ${activeTab === 'event' ? 'active' : ''}`}
          onClick={() => setActiveTab('event')}
        >
          心情随笔
        </View>
      </View>

      {activeTab === 'mood' ? (
        <View className="mood-section">
          <Text className="section-title">今天的心情如何？</Text>
          <MoodSelector 
            moods={MOODS} 
            selectedMood={selectedMood} 
            onSelect={handleMoodSelect} 
          />
          
          {selectedMood && (
            <>
              <Card>
                <Text className="intensity-label">心情强度</Text>
                <Slider
                  value={intensity}
                  onChange={(e) => setIntensity(e.detail.value)}
                  min={1}
                  max={10}
                  showValue
                />
                <Text className="intensity-hint">
                  {MOODS.find(m => m.value === selectedMood)?.label}感 {intensity > 5 ? '较强烈' : '较轻微'}
                </Text>
              </Card>

              <Card>
                <Text className="tags-label">相关标签（可选）</Text>
                <View className="tags-container">
                  {TAG_OPTIONS.map(tag => (
                    <View
                      key={tag.value}
                      className={`tag ${selectedTags.includes(tag.value) ? 'selected' : ''}`}
                      onClick={() => toggleTag(tag.value)}
                    >
                      {tag.label}
                    </View>
                  ))}
                </View>
              </Card>

              <Textarea
                className="event-input"
                placeholder="详细描述（可选）..."
                value={eventText}
                onInput={(e) => setEventText(e.detail.value)}
                maxlength={500}
              />

              <Button className="submit-btn" onClick={handleSubmit}>
                保存记录
              </Button>
            </>
          )}
        </View>
      ) : (
        <View className="event-section">
          <Text className="section-title">今日随想</Text>
          <Textarea
            className="essay-input"
            placeholder="写下今天的故事，让心情自然流淌..."
            value={eventText}
            onInput={(e) => setEventText(e.detail.value)}
            maxlength={1000}
          />
          
          {eventText.length > 0 && eventText.length < 10 && (
            <Text className="hint-text">📝 再写一些内容（至少10个字）</Text>
          )}
          
          {eventText.length >= 10 && !isAnalyzing && !analysisResult && (
            <Button className="analyze-btn" onClick={() => analyzeEvent(eventText)}>
              💭 陪伴理解我
            </Button>
          )}
          
          {isAnalyzing && (
            <View className="analyzing">
              <Text>正在分析中...</Text>
            </View>
          )}
          
          {analysisResult && !isAnalyzing && (
            <Card className="analysis-card">
              <View className="analysis-header">
                <Text className="analysis-title">💭 AI分析</Text>
              </View>
              <Text className="analysis-insight">{analysisResult.insight}</Text>
              {analysisResult.reason && (
                <Text className="analysis-reason">原因：{analysisResult.reason}</Text>
              )}
              {analysisResult.action && (
                <Text className="analysis-action">💡 {analysisResult.action}</Text>
              )}
              <Button className="submit-btn" onClick={handleSubmit}>
                保存记录
              </Button>
            </Card>
          )}
        </View>
      )}
    </View>
  );
}
