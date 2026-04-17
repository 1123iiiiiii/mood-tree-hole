export type MoodType = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'fearful' | 'surprised';

export type Tag = 'work' | 'family' | 'health' | 'relationship' | 'finance' | 'study' | 'other';

export type SmallHappyCategory =
  | 'relaxation'
  | 'exercise'
  | 'creative'
  | 'social'
  | 'growth'
  | 'sensory'
  | 'organize'
  | 'nature';

export type Frequency = 'daily' | 'weekly' | 'once';

export type MoodIntensity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface MoodRecord {
  id: string;
  event: string;
  mood: MoodType;
  intensity: number;
  tags: Tag[];
  createdAt: string;
  smallHappyId?: string;
  analysis?: MoodAnalysis;
}

export interface MoodAnalysis {
  psychologyTip: string;
  affirmations: string[];
  recommendedActivities: string[];
}

export interface SmallHappy {
  id: string;
  title: string;
  category: SmallHappyCategory;
  frequency: Frequency;
  reminderTime?: string;
  isCustom: boolean;
  createdAt: string;
  isArchived: boolean;
}

export interface SmallHappyRecord {
  id: string;
  smallHappyId: string;
  completedAt: string;
  mood?: MoodType;
  moodIntensity?: number;
  note?: string;
}

export interface TimeRange {
  startDate: string;
  endDate: string;
  preset?: 'today' | 'week' | 'month' | 'quarter' | 'year';
}

export type NeedLevel = 'physiological' | 'safety' | 'social' | 'esteem' | 'selfActualization';

export type DefenseMechanismType =
  | 'sublimation'
  | 'humor'
  | 'identification'
  | 'suppression'
  | 'rationalization'
  | 'projection'
  | 'denial'
  | 'regression';

export type DefenseMaturity = 'mature' | 'intermediate' | 'immature';

export interface PsychologyInsight {
  type: 'positive' | 'warning' | 'suggestion';
  title: string;
  description: string;
  evidence: string[];
  suggestion?: string;
}

export interface NeedSatisfaction {
  score: number;
  evidence: string[];
  triggerEvents: string[];
  trend: 'improving' | 'stable' | 'declining';
}

export interface MaslowAnalysis {
  userId: string;
  timeRange: TimeRange;
  needs: Record<NeedLevel, NeedSatisfaction>;
  dominantNeed: NeedLevel;
  unsatisfiedNeeds: NeedLevel[];
  insights: PsychologyInsight[];
}

export interface DefenseMechanismResult {
  mechanism: DefenseMechanismType;
  frequency: number;
  percentage: number;
  examples: string[];
  maturity: DefenseMaturity;
}

export interface DefenseMechanismAnalysis {
  userId: string;
  timeRange: TimeRange;
  mechanisms: DefenseMechanismResult[];
  primaryMechanism: DefenseMechanismType;
  maturityLevel: DefenseMaturity;
  insights: PsychologyInsight[];
}

export interface TriggerPattern {
  name: string;
  description: string;
  trigger: string;
  emotion: MoodType;
  frequency: number;
  suggestion: string;
}

export interface EmotionSequence {
  trigger: MoodType;
  response: MoodType;
  frequency: number;
  interpretation: string;
}

export interface TriggerAnalysis {
  userId: string;
  timeRange: TimeRange;
  eventEmotionCorrelations: {
    event: string;
    mood: MoodType;
    frequency: number;
    percentage: number;
  }[];
  emotionSequences: EmotionSequence[];
  patterns: TriggerPattern[];
  insights: PsychologyInsight[];
}

export interface GrowthTracking {
  userId: string;
  currentPeriod: TimeRange;
  previousPeriod: TimeRange;
  metrics: {
    emotionStability: MetricComparison;
    recoveryTime: MetricComparison;
    positiveRatio: MetricComparison;
    stressResponse: MetricComparison;
    smallHappyEffect: MetricComparison;
  };
  achievements: Achievement[];
  insights: PsychologyInsight[];
}

export interface MetricComparison {
  current: number;
  previous: number;
  changePercent: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface Achievement {
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface DailyMoodAverage {
  date: string;
  averageIntensity: number;
  dominantMood: MoodType;
  moodCounts: Record<MoodType, number>;
  smallHappyCompleted: boolean;
}

export interface MoodCurveData {
  timeRange: TimeRange;
  dailyAverages: DailyMoodAverage[];
  moodDistribution: Record<MoodType, number>;
}

export interface UserPreferences {
  favoriteCategories: SmallHappyCategory[];
  favoriteMoods: MoodType[];
  preferredAffirmationStyle: 'encouraging' | 'gentle' | 'motivating';
}

export interface MoodImprovement {
  timesCompleted: number;
  averageMoodDelta: number;
  effectiveness: number;
}

export interface UserMemory {
  userId: string;
  preferences: UserPreferences;
  learning: {
    completedSmallHappyIds: string[];
    moodImprovementStats: Record<SmallHappyCategory, MoodImprovement>;
  };
  achievements: {
    currentStreak: number;
    longestStreak: number;
    totalMoodRecords: number;
    totalSmallHappies: number;
  };
  context: {
    lastViewedTab: string;
    lastTimeRange: TimeRange;
    preferredViewMode: 'list' | 'grid';
  };
  lastUpdated: string;
}
