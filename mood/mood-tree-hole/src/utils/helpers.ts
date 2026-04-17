import { MoodType, SmallHappyCategory } from '@/types';

export const MOOD_LABELS: Record<MoodType, string> = {
  happy: '愉快',
  calm: '平静',
  anxious: '焦虑',
  sad: '悲伤',
  angry: '愤怒',
  fearful: '恐惧',
  surprised: '惊讶',
};

export const MOOD_EMOJIS: Record<MoodType, string> = {
  happy: '☀️',
  calm: '🍃',
  anxious: '🌧️',
  sad: '💧',
  angry: '🔥',
  fearful: '🌙',
  surprised: '✨',
};

export const TAG_LABELS: Record<string, string> = {
  work: '工作',
  family: '家庭',
  health: '健康',
  relationship: '人际关系',
  finance: '财务',
  study: '学习',
  other: '其他',
};

export const CATEGORY_LABELS: Record<SmallHappyCategory, string> = {
  relaxation: '放松冥想',
  exercise: '身体活动',
  creative: '创意娱乐',
  social: '社交互动',
  growth: '自我成长',
  sensory: '感官享受',
  organize: '整理收纳',
  nature: '大自然',
};

export const CATEGORY_EMOJIS: Record<SmallHappyCategory, string> = {
  relaxation: '🧘',
  exercise: '🏃',
  creative: '🎨',
  social: '💬',
  growth: '📚',
  sensory: '🌸',
  organize: '🗂️',
  nature: '🌿',
};

export const FREQUENCY_LABELS: Record<string, string> = {
  daily: '每天',
  weekly: '每周',
  once: '一次性',
};

export const NEED_LABELS: Record<string, string> = {
  physiological: '生理需求',
  safety: '安全需求',
  social: '社交需求',
  esteem: '尊重需求',
  selfActualization: '自我实现',
};

export const MOOD_COLORS: Record<MoodType, string> = {
  happy: '#FFD93D',
  calm: '#6BCB77',
  anxious: '#FF9F45',
  sad: '#4D96FF',
  angry: '#FF6B6B',
  fearful: '#9B59B6',
  surprised: '#00D2D3',
};

export const CATEGORY_COLORS: Record<SmallHappyCategory, string> = {
  relaxation: '#9B59B6',
  exercise: '#27AE60',
  creative: '#E74C3C',
  social: '#3498DB',
  growth: '#F39C12',
  sensory: '#FF69B4',
  organize: '#00BCD4',
  nature: '#4CAF50',
};
