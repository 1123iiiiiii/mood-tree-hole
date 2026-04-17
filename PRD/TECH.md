# 心情树洞 - 技术文档 (TECH)

> **版本**：v1.0
> **日期**：2026-04-03
> **状态**：已完成
> **产品名称**：心情树洞
> **文档类型**：技术实现文档
> **基于PRD**：PRD.md

---

## 1. 技术架构总览

### 1.1 系统架构图

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           用户交互层 (React 17)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ 记录页面 │  │ 历史页面 │  │ 小确幸页 │  │ 分析页面 │  │ 洞察报告 │          │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘          │
└────────┼───────────┼───────────┼───────────┼───────────┼──────────────────┘
         │           │           │           │           │
         ▼           ▼           ▼           ▼           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         状态管理层 (Context API)                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ MoodContext │  │HappinessCtx │  │ MemoryCtx   │  │AnalysisCtx  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
         │                    │                    │                    │
         ▼                    ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       心理学分析引擎 (Engine Layer)                           │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │
│  │需求层次分析│ │防御机制识别│ │触发因素分析│ │成长追踪   │ │推荐引擎   │    │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘    │
│        └─────────────┴─────────────┴─────────────┴─────────────┘           │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                                  │
│  │情绪曲线聚合│ │洞察生成器 │ │心理学知识库│                                  │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘                                  │
└────────┼──────────────┼──────────────┼───────────────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AI服务层 (国内免费模型) ⚡可扩展                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │  智谱AI    │  │  阿里通义   │  │  百度文心   │                         │
│  │  (GLM-4)  │  │ (Qwen)      │  │ (ERNIE)     │                         │
│  └─────────────┘  └─────────────┘  └─────────────┘                         │
│         │                │                │                                  │
│         ▼                ▼                ▼                                  │
│  ┌─────────────────────────────────────────────────────┐                     │
│  │              AI服务管理器 (降级策略 + 缓存)         │                     │
│  └─────────────────────────────────────────────────────┘                     │
└─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         本地存储层 (localStorage)                            │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                   │
│  │localStorage   │  │  内存缓存     │  │  IndexedDB   │                   │
│  │(心情记录)     │  │(会话状态)     │  │(历史大数据)   │                   │
│  └───────────────┘  └───────────────┘  └───────────────┘                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 技术选型理由

| 类别 | 选择 | 理由 |
|------|------|------|
| **框架** | React 17 | 稳定可靠，生态丰富，兼容性良好 |
| **语言** | TypeScript 5.x | 类型安全，提高代码质量 |
| **构建** | Vite 4.2.0 | 极速热更新，开发体验好 |
| **样式** | Tailwind CSS 3.2 | 快速开发，主题切换方便 |
| **状态** | Context + useReducer | 轻量级，无需额外依赖 |
| **图表** | Recharts 2.5.0 | React原生，支持性好 |
| **路由** | React Router 6.8.0 | React标准路由方案 |
| **日期** | date-fns 3.x | 轻量、模块化、无依赖 |

---

## 2. 项目结构

### 2.1 目录结构

```
mood-tree-hole/
├── src/
│   ├── components/                 # 可复用组件
│   │   ├── ui/                   # 基础UI组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Tabs.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── mood/                # 心情相关组件
│   │   │   ├── MoodSelector.tsx       # 心情选择器
│   │   │   ├── MoodIcon.tsx           # 心情图标
│   │   │   └── index.ts
│   │   │
│   │   ├── psychology/           # 心理学相关组件
│   │   │   ├── PsychologyCard.tsx      # 心理学建议卡片
│   │   │   ├── AffirmationCard.tsx    # 温暖话语卡片
│   │   │   ├── ActivityCard.tsx        # 推荐活动卡片
│   │   │   └── index.ts
│   │   │
│   │   ├── smallHappiness/       # 小确幸相关组件
│   │   │   ├── SmallHappyCard.tsx      # 小确幸卡片
│   │   │   ├── SmallHappyList.tsx      # 小确幸列表
│   │   │   ├── SmallHappyForm.tsx      # 添加表单
│   │   │   ├── SmallHappyCompletion.tsx # 完成弹窗
│   │   │   └── index.ts
│   │   │
│   │   ├── charts/               # 图表组件
│   │   │   ├── MoodCurveChart.tsx      # 心情曲线图
│   │   │   ├── MoodPieChart.tsx        # 情绪分布饼图
│   │   │   ├── MoodHeatmap.tsx        # 时段热力图
│   │   │   ├── NeedRadarChart.tsx      # 需求雷达图
│   │   │   ├── DefenseMechanismChart.tsx # 防御机制图
│   │   │   └── index.ts
│   │   │
│   │   ├── analysis/             # 分析相关组件
│   │   │   ├── TimeRangeSelector.tsx   # 时间段选择器
│   │   │   ├── InsightCard.tsx        # 洞察卡片
│   │   │   ├── GrowthTracker.tsx       # 成长追踪
│   │   │   └── index.ts
│   │   │
│   │   └── layout/               # 布局组件
│   │       ├── AppLayout.tsx           # 主布局
│   │       ├── BottomNav.tsx           # 底部导航
│   │       ├── Header.tsx              # 顶部导航
│   │       └── index.ts
│   │
│   ├── pages/                   # 页面组件
│   │   ├── RecordPage.tsx             # 记录页
│   │   ├── HistoryPage.tsx            # 历史页
│   │   ├── HappinessPage.tsx           # 小确幸页
│   │   ├── AnalysisPage.tsx           # 分析页
│   │   └── index.ts
│   │
│   ├── context/                  # 全局状态管理
│   │   ├── MoodContext.tsx            # 心情记录状态
│   │   ├── HappinessContext.tsx        # 小确幸状态
│   │   ├── MemoryContext.tsx           # 用户记忆状态
│   │   ├── AnalysisContext.tsx         # 分析状态
│   │   └── index.ts
│   │
│   ├── hooks/                    # 自定义Hooks
│   │   ├── useMoodRecords.ts          # 心情记录
│   │   ├── useSmallHappiness.ts        # 小确幸
│   │   ├── useUserMemory.ts           # 用户记忆
│   │   ├── usePsychology.ts           # 心理学建议
│   │   ├── useMoodAnalysis.ts         # 心情分析
│   │   ├── useTimeRange.ts            # 时间范围
│   │   ├── useStorage.ts              # 本地存储
│   │   └── index.ts
│   │
│   ├── engine/                   # 分析引擎 ⚡核心
│   │   ├── index.ts                   # 引擎导出
│   │   ├── BaseAnalyzer.ts            # 分析器基类
│   │   ├── PsychologyEngine.ts        # 心理学分析引擎
│   │   ├── MaslowAnalyzer.ts          # 马斯洛需求分析
│   │   ├── DefenseMechanismAnalyzer.ts # 防御机制分析
│   │   ├── TriggerAnalyzer.ts         # 触发因素分析
│   │   ├── GrowthTracker.ts           # 成长追踪
│   │   ├── RecommendationEngine.ts    # 推荐引擎
│   │   ├── CurveAggregator.ts         # 曲线聚合
│   │   └── InsightGenerator.ts        # 洞察生成
│   │
│   ├── services/                  # AI服务层 ⚡可扩展
│   │   ├── ai/
│   │   │   ├── BaseAIService.ts      # AI服务基类
│   │   │   ├── AIServiceManager.ts    # AI服务管理器
│   │   │   ├── ZhipuAIService.ts      # 智谱AI
│   │   │   ├── QwenAIService.ts       # 阿里云通义
│   │   │   └── ErnieAIService.ts     # 百度文心
│   │   └── cache/
│   │       └── AICache.ts             # AI响应缓存
│   │
│   ├── data/                     # 静态数据
│   │   ├── psychology.ts              # 心理学知识库
│   │   ├── smallHappiness.ts          # 预设小事库
│   │   └── mockData.ts                # Mock数据
│   │
│   ├── utils/                    # 工具函数
│   │   ├── storage.ts                  # localStorage封装
│   │   ├── dateUtils.ts                # 日期处理
│   │   ├── moodUtils.ts                # 心情工具
│   │   ├── validation.ts               # 表单验证
│   │   ├── analytics.ts                # 统计工具
│   │   ├── helpers.ts                  # 通用帮助函数
│   │   └── index.ts
│   │
│   ├── types/                    # TypeScript类型
│   │   ├── mood.ts                    # 心情相关类型
│   │   ├── smallHappiness.ts          # 小确幸类型
│   │   ├── analysis.ts                # 分析相关类型
│   │   ├── memory.ts                  # 记忆相关类型
│   │   └── index.ts                   # 类型导出
│   │
│   ├── styles/                   # 样式文件
│   │   └── globals.css                 # 全局样式
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── public/
│   └── index.html
│
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── .gitignore
```

### 2.2 文件命名规范

| 类别 | 规范 | 示例 |
|------|------|------|
| 组件文件 | PascalCase | `MoodSelector.tsx` |
| 工具文件 | camelCase | `dateUtils.ts` |
| 类型文件 | camelCase | `moodTypes.ts` |
| 测试文件 | `*.test.ts(x)` | `dateUtils.test.ts` |
| 样式文件 | kebab-case | `globals.css` |

---

## 3. 核心模块技术方案

### 3.1 心情记录模块

#### 3.1.1 组件结构

```
RecordPage
├── Tab切换 [选择心情 | 心情随笔]
│
├── 选择心情模式
│   ├── MoodSelector          # 心情选择（7种情绪）
│   ├── IntensitySlider      # 强度滑块（1-10）
│   ├── EventInput           # 事件输入（TextArea）
│   ├── TagSelector          # 标签选择（多选）
│   └── PsychologyCard        # 心理学建议（结果展示）
│
└── 心情随笔模式
    ├── EventTextArea        # 事件输入
    ├── AnalyzeButton        # 分析按钮
    ├── MixedMoodDisplay     # 混合心情展示
    ├── MoodIntensitySlider  # 强度滑块
    └── PsychologyCard       # 心理学建议 + 评估师洞察
```

#### 3.1.2 状态管理

```typescript
// context/MoodContext.tsx
interface MoodState {
  records: MoodRecord[];
  currentDraft: Partial<MoodRecord>;
  isSubmitting: boolean;
}

type MoodAction =
  | { type: 'SET_DRAFT'; payload: Partial<MoodRecord> }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: MoodRecord }
  | { type: 'SUBMIT_ERROR'; payload: string }
  | { type: 'LOAD_RECORDS'; payload: MoodRecord[] }
  | { type: 'DELETE_RECORD'; payload: string }
  | { type: 'RESET_DRAFT' };
```

#### 3.1.3 情绪分析算法

```typescript
// 情绪关键词分析
const EMOTION_KEYWORDS: Record<MoodType, string[]> = {
  happy: ['开心', '高兴', '快乐', '幸福', '愉悦', '兴奋', '满足'],
  calm: ['平静', '放松', '宁静', '安心', '舒适', '安宁'],
  anxious: ['焦虑', '担心', '紧张', '压力', '不安', '忧虑', '惶恐'],
  sad: ['伤心', '难过', '悲伤', '失落', '沮丧', '忧郁', '孤独'],
  angry: ['生气', '愤怒', '恼火', '烦躁', '不满', '气愤', '暴怒'],
  fearful: ['害怕', '恐惧', '担心', '紧张', '不安', '惶恐', '胆怯'],
  surprised: ['惊讶', '意外', '震惊', '惊喜', '诧异', '惊奇'],
};

// 分析函数
function analyzeEmotion(event: string): { moods: MixedMood[], insight: string } {
  const scores: Record<MoodType, number> = {
    happy: 0, calm: 0, anxious: 0, sad: 0,
    angry: 0, fearful: 0, surprised: 0,
  };

  // 统计关键词匹配
  Object.entries(EMOTION_KEYWORDS).forEach(([mood, keywords]) => {
    keywords.forEach(keyword => {
      if (event.includes(keyword)) {
        scores[mood as MoodType] += 3;
      }
    });
  });

  // 计算占比
  const total = Object.values(scores).reduce((sum, s) => sum + s, 0);
  const mixedMoods: MixedMood[] = Object.entries(scores)
    .filter(([_, score]) => score > 0)
    .map(([mood, score]) => ({
      mood: mood as MoodType,
      percentage: Math.round((score / total) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return { moods: mixedMoods, insight: generateInsight(mixedMoods) };
}
```

### 3.2 小确幸模块

#### 3.2.1 组件结构

```
HappinessPage
├── Tab切换 [清单 | 推荐 | 统计]
│
├── 清单Tab
│   ├── SmallHappyHeader      # 头部（统计 + 添加按钮）
│   ├── SmallHappyFilter     # 筛选（类别/频率）
│   └── SmallHappyList        # 列表
│       └── SmallHappyCard   # 单个小事卡片
│           └── CompletionModal # 完成弹窗
│
├── 推荐Tab
│   └── SmallHappyRecommendation # 智能推荐区
│
└── 统计Tab
    └── CompletionStats      # 完成率统计
```

#### 3.2.2 推荐算法

```typescript
// engine/RecommendationEngine.ts
class RecommendationEngine {
  recommend(params: RecommendationParams): SmallHappy[] {
    // 1. 获取所有未归档的小事
    const activeItems = this.getActiveItems();

    // 2. 基于当前心情筛选
    const moodRelated = this.filterByMood(params.currentMood);

    // 3. 基于用户偏好筛选
    const preferred = this.filterByPreferences(moodRelated);

    // 4. 去除已完成的小事（按频率规则）
    const notCompleted = this.filterNotCompletedToday(
      preferred,
      params.completedRecords
    );

    // 5. 按心情提升效果权重排序
    const ranked = this.rankByEffectiveness(notCompleted);

    // 6. 返回Top N
    return ranked.slice(0, params.limit || 5);
  }

  // 频率去重规则
  private shouldRecommend(item: SmallHappy, lastCompleted?: string): boolean {
    if (!lastCompleted) return true;
    const daysSince = differenceInDays(new Date(), new Date(lastCompleted));
    return item.frequency === 'daily' ? daysSince >= 1 :
           item.frequency === 'weekly' ? daysSince >= 7 : false;
  }
}
```

### 3.3 心理学分析模块

#### 3.3.1 分析引擎架构

```typescript
// engine/BaseAnalyzer.ts
abstract class BaseAnalyzer<T> {
  protected records: MoodRecord[] = [];
  protected timeRange: TimeRange | null = null;

  setRecords(records: MoodRecord[]): this {
    this.records = records;
    return this;
  }

  setTimeRange(timeRange: TimeRange): this {
    this.timeRange = timeRange;
    return this;
  }

  protected filterByTimeRange(records: MoodRecord[]): MoodRecord[] {
    if (!this.timeRange) return records;
    return records.filter(r =>
      r.createdAt >= this.timeRange!.startDate &&
      r.createdAt <= this.timeRange!.endDate
    );
  }

  abstract analyze(): T;
}

// engine/PsychologyEngine.ts
class PsychologyEngine {
  private analyzers: Map<string, BaseAnalyzer<any>> = new Map();

  register(name: string, analyzer: BaseAnalyzer<any>): void {
    this.analyzers.set(name, analyzer);
  }

  analyze(records: MoodRecord[], timeRange: TimeRange): AnalysisResult {
    const result: AnalysisResult = {};

    this.analyzers.forEach((analyzer, name) => {
      analyzer
        .setRecords(records)
        .setTimeRange(timeRange);
      result[name] = analyzer.analyze();
    });

    return result;
  }
}
```

#### 3.3.2 马斯洛需求分析算法

```typescript
// engine/MaslowAnalyzer.ts
const NEED_EMOTION_MAP: Record<NeedLevel, { positive: MoodType[]; negative: MoodType[] }> = {
  physiological: {
    positive: ['calm', 'happy'],
    negative: ['sad', 'angry', 'anxious'],
  },
  safety: {
    positive: ['calm', 'happy'],
    negative: ['anxious', 'fearful'],
  },
  social: {
    positive: ['happy', 'calm'],
    negative: ['sad', 'anxious'],
  },
  esteem: {
    positive: ['happy', 'surprised'],
    negative: ['angry', 'sad'],
  },
  selfActualization: {
    positive: ['happy', 'calm'],
    negative: ['sad', 'anxious'],
  },
};

class MaslowAnalyzer extends BaseAnalyzer<MaslowAnalysis> {
  analyze(): MaslowAnalysis {
    const filtered = this.filterByTimeRange(this.records);
    const needs: Record<NeedLevel, NeedSatisfaction> = {} as any;

    (['physiological', 'safety', 'social', 'esteem', 'selfActualization'] as NeedLevel[])
      .forEach(need => {
        needs[need] = this.calculateNeedSatisfaction(filtered, need);
      });

    const sortedNeeds = Object.entries(needs)
      .sort(([, a], [, b]) => a.score - b.score);

    return {
      needs,
      dominantNeed: sortedNeeds[0][0] as NeedLevel,
      unsatisfiedNeeds: sortedNeeds.filter(([, n]) => n.score < 60).map(([k]) => k as NeedLevel),
      insights: this.generateInsights(needs),
    };
  }

  private calculateNeedSatisfaction(records: MoodRecord[], need: NeedLevel): NeedSatisfaction {
    const mapping = NEED_EMOTION_MAP[need];
    let positiveCount = 0;
    let negativeCount = 0;
    const evidence: string[] = [];

    records.forEach(record => {
      if (mapping.positive.includes(record.mood)) {
        positiveCount++;
        if (record.event) evidence.push(record.event.slice(0, 50));
      }
      if (mapping.negative.includes(record.mood)) {
        negativeCount++;
      }
    });

    const total = positiveCount + negativeCount;
    const score = total > 0 ? Math.round((positiveCount / total) * 100) : 50;

    return { score, evidence: evidence.slice(0, 3), triggerEvents: [], trend: 'stable' };
  }
}
```

#### 3.3.3 防御机制识别算法

```typescript
// engine/DefenseMechanismAnalyzer.ts
const DEFENSE_SIGNALS = [
  {
    mechanism: 'sublimation',
    pattern: (record: MoodRecord) =>
      record.mood === 'happy' && record.tags?.includes('exercise' || 'creative'),
    maturity: 'mature',
  },
  {
    mechanism: 'suppression',
    pattern: (record: MoodRecord) => record.intensity < 5 && record.mood !== 'happy',
    maturity: 'intermediate',
  },
  {
    mechanism: 'rationalization',
    pattern: /因为|所以|只是|罢了/,
    maturity: 'intermediate',
  },
  {
    mechanism: 'projection',
    pattern: (record: MoodRecord) =>
      record.event?.includes('他让我') || record.event?.includes('都是因为'),
    maturity: 'intermediate',
  },
  {
    mechanism: 'denial',
    pattern: (record: MoodRecord) =>
      record.event?.includes('我没') || record.event?.includes('不是'),
    maturity: 'immature',
  },
];
```

### 3.4 心情曲线模块

#### 3.4.1 曲线聚合算法

```typescript
// engine/CurveAggregator.ts
interface AggregationOptions {
  granularity: 'hour' | 'day' | 'week' | 'month';
  groupBy?: 'mood' | 'intensity' | 'tags';
}

class CurveAggregator {
  aggregate(
    records: MoodRecord[],
    timeRange: TimeRange,
    options: AggregationOptions
  ): MoodCurveData {
    const filtered = this.filterByTimeRange(records, timeRange);

    switch (options.granularity) {
      case 'hour':
        return this.aggregateByHour(filtered);
      case 'day':
        return this.aggregateByDay(filtered);
      case 'week':
        return this.aggregateByWeek(filtered);
      case 'month':
        return this.aggregateByMonth(filtered);
    }
  }

  private aggregateByDay(records: MoodRecord[]): MoodCurveData {
    const dailyMap = new Map<string, MoodRecord[]>();

    records.forEach(record => {
      const date = format(new Date(record.createdAt), 'yyyy-MM-dd');
      if (!dailyMap.has(date)) {
        dailyMap.set(date, []);
      }
      dailyMap.get(date)!.push(record);
    });

    const dailyAverages: DailyMoodAverage[] = Array.from(dailyMap.entries())
      .map(([date, dayRecords]) => {
        const avgIntensity = dayRecords.reduce((sum, r) => sum + r.intensity, 0) / dayRecords.length;
        const moodCounts = this.countMoods(dayRecords);
        const dominantMood = this.getDominantMood(moodCounts);

        return {
          date,
          averageIntensity: Math.round(avgIntensity * 10) / 10,
          dominantMood,
          moodCounts,
          smallHappyCompleted: dayRecords.some(r => r.smallHappyCompleted),
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      dailyAverages,
      weekdayPattern: this.calculateWeekdayPattern(records),
      moodDistribution: this.calculateMoodDistribution(records),
    };
  }
}
```

#### 3.4.2 时间段选择器

```typescript
// hooks/useTimeRange.ts
interface TimeRangePreset {
  label: string;
  value: 'today' | 'week' | 'month' | 'quarter' | 'year';
  getRange: () => { startDate: string; endDate: string };
}

const PRESETS: TimeRangePreset[] = [
  {
    label: '今天',
    value: 'today',
    getRange: () => ({
      startDate: startOfDay(new Date()).toISOString(),
      endDate: endOfDay(new Date()).toISOString(),
    }),
  },
  {
    label: '本周',
    value: 'week',
    getRange: () => ({
      startDate: startOfWeek(new Date()).toISOString(),
      endDate: endOfWeek(new Date()).toISOString(),
    }),
  },
  {
    label: '本月',
    value: 'month',
    getRange: () => ({
      startDate: startOfMonth(new Date()).toISOString(),
      endDate: endOfMonth(new Date()).toISOString(),
    }),
  },
  {
    label: '本季度',
    value: 'quarter',
    getRange: () => ({
      startDate: startOfQuarter(new Date()).toISOString(),
      endDate: endOfQuarter(new Date()).toISOString(),
    }),
  },
  {
    label: '今年',
    value: 'year',
    getRange: () => ({
      startDate: startOfYear(new Date()).toISOString(),
      endDate: endOfYear(new Date()).toISOString(),
    }),
  },
];

function useTimeRange(initialPreset: TimeRangePreset['value'] = 'week') {
  const [selectedPreset, setSelectedPreset] = useState(initialPreset);
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date } | null>(null);
  const [timeRange, setTimeRange] = useState(() =>
    PRESETS.find(p => p.value === initialPreset)?.getRange()
  );

  const selectPreset = (preset: TimeRangePreset['value']) => {
    setSelectedPreset(preset);
    setCustomRange(null);
    const range = PRESETS.find(p => p.value === preset)?.getRange();
    if (range) setTimeRange(range);
  };

  const selectCustomRange = (start: Date, end: Date) => {
    setSelectedPreset('custom');
    setCustomRange({ start, end });
    setTimeRange({
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    });
  };

  return { timeRange, selectedPreset, customRange, selectPreset, selectCustomRange };
}
```

---

## 4. 数据模型

### 4.1 核心类型定义

```typescript
// types/mood.ts
interface MoodRecord {
  id: string;
  event: string;
  mood: MoodType;
  intensity: number;       // 1-10
  tags: Tag[];
  createdAt: string;       // ISO timestamp
  smallHappyId?: string;   // 关联的小确幸（可选）
  mixedMoods?: MixedMood[]; // 混合心情（心情随笔模式）
  analysis?: {
    insight?: string;       // 心理评估师洞察
    needLevel?: NeedLevel; // 需求层次
  };
}

type MoodType = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'fearful' | 'surprised';

type Tag = 'work' | 'family' | 'health' | 'relationship' | 'finance' | 'study' | 'other';

interface MixedMood {
  mood: MoodType;
  percentage: number;      // 占比 0-100
}

// types/smallHappiness.ts
interface SmallHappy {
  id: string;
  title: string;
  category: SmallHappyCategory;
  frequency: Frequency;
  reminderTime?: string;
  isCustom: boolean;
  createdAt: string;
  isArchived: boolean;
}

type SmallHappyCategory =
  | 'relaxation' | 'exercise' | 'creative' | 'social'
  | 'growth' | 'sensory' | 'organize' | 'nature';

type Frequency = 'daily' | 'weekly' | 'once';

interface SmallHappyRecord {
  id: string;
  smallHappyId: string;
  completedAt: string;
  mood?: MoodType;
  moodIntensity?: number;
  note?: string;
}

// types/analysis.ts
interface TimeRange {
  startDate: string;
  endDate: string;
  preset?: 'today' | 'week' | 'month' | 'quarter' | 'year';
}

interface MaslowAnalysis {
  needs: Record<NeedLevel, NeedSatisfaction>;
  dominantNeed: NeedLevel;
  unsatisfiedNeeds: NeedLevel[];
  insights: PsychologyInsight[];
}

type NeedLevel = 'physiological' | 'safety' | 'social' | 'esteem' | 'selfActualization';

interface NeedSatisfaction {
  score: number;           // 满足度 0-100
  evidence: string[];       // 支撑证据
  triggerEvents: string[];  // 相关事件
  trend: 'improving' | 'stable' | 'declining';
}

interface PsychologyInsight {
  type: 'positive' | 'warning' | 'suggestion';
  title: string;
  description: string;
  evidence: string[];
  suggestion?: string;
}

// types/memory.ts
interface UserMemory {
  preferences: {
    favoriteCategories: SmallHappyCategory[];
    favoriteMoods: MoodType[];
  };
  learning: {
    completedSmallHappyIds: string[];
    completionHistory: CompletionRecord[];
    moodImprovementStats: Record<SmallHappyCategory, number>;
  };
  achievements: {
    currentStreak: number;
    totalMoodRecords: number;
  };
  context: {
    lastViewedTab: string;
    lastTimeRangePreset: string;
  };
  lastUpdated: string;
}
```

### 4.2 存储结构

```typescript
// utils/storage.ts
const STORAGE_KEYS = {
  MOOD_RECORDS: 'mood_tree_hole_records_v1',
  SMALL_HAPPIES: 'mood_tree_hole_happiness_v1',
  SMALL_HAPPY_RECORDS: 'mood_tree_hole_happiness_records_v1',
  USER_MEMORY: 'mood_tree_hole_memory_v1',
  SETTINGS: 'mood_tree_hole_settings_v1',
};

class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!this.instance) {
      this.instance = new StorageService();
    }
    return this.instance;
  }

  get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  setDebounced(key: string, value: any, delay = 500): void {
    // 防抖写入实现
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
```

---

## 5. 组件清单

### 5.1 基础UI组件

| 组件 | Props | 说明 |
|------|-------|------|
| Button | variant, size, disabled, loading, onClick | 按钮 |
| Card | children, className, onClick | 卡片容器 |
| Input | type, value, onChange, placeholder, error | 输入框 |
| TextArea | value, onChange, placeholder, rows, maxLength | 多行输入 |
| Modal | isOpen, onClose, title, children | 模态框 |
| Slider | min, max, value, onChange, step | 滑块 |
| Badge | variant, children | 标签 |
| Tabs | tabs, activeTab, onChange | 标签页 |

### 5.2 业务组件

| 组件 | 说明 | 依赖 |
|------|------|------|
| MoodSelector | 7种心情选择网格 | MoodIcon |
| MoodIcon | 心情emoji图标 | - |
| PsychologyCard | 心理学建议展示 | - |
| SmallHappyCard | 小确幸展示卡片 | Badge |
| SmallHappyForm | 添加/编辑小确幸表单 | Input, Select, Modal |
| MoodCurveChart | 心情强度曲线图 | Recharts LineChart |
| MoodPieChart | 情绪分布饼图 | Recharts PieChart |
| MoodHeatmap | 时段热力图 | 自定义组件 |
| NeedRadarChart | 需求层次雷达图 | Recharts RadarChart |
| TimeRangeSelector | 时间段选择器 | Button, DatePicker |
| InsightCard | 洞察结果卡片 | Badge |

---

## 6. 页面路由

### 6.1 路由配置

```typescript
// App.tsx
const routes = [
  {
    path: '/',
    element: <RecordPage />,
    label: '记录',
    icon: HeartIcon,
  },
  {
    path: '/history',
    element: <HistoryPage />,
    label: '历史',
    icon: ClockIcon,
  },
  {
    path: '/happiness',
    element: <HappinessPage />,
    label: '小确幸',
    icon: SparklesIcon,
  },
  {
    path: '/analysis',
    element: <AnalysisPage />,
    label: '分析',
    icon: ChartBarIcon,
  },
];
```

### 6.2 页面Tab结构

| 页面 | Tab配置 |
|------|---------|
| RecordPage | [选择心情] [心情随笔] |
| HistoryPage | [全部] [筛选] |
| HappinessPage | [清单] [推荐] [统计] |
| AnalysisPage | [统计概览] [趋势图表] [洞察报告] |

---

## 7. 开发计划

### 7.1 Sprint规划

#### Sprint 1: 项目初始化 + 核心记录 (Week 1)

| 任务 | 优先级 | 预计工时 |
|------|--------|----------|
| 项目初始化 | P0 | 4h |
| 基础UI组件库 | P0 | 8h |
| 心情记录页面 | P0 | 8h |
| 心理学知识库 | P0 | 4h |
| 心理学建议展示 | P0 | 4h |
| localStorage封装 | P0 | 4h |

#### Sprint 2: 小确幸模块 (Week 2)

| 任务 | 优先级 | 预计工时 |
|------|--------|----------|
| 小确幸数据模型 | P0 | 2h |
| 小确幸列表页面 | P0 | 6h |
| 添加/编辑表单 | P0 | 4h |
| 完成打卡功能 | P0 | 6h |
| 推荐引擎基础版 | P0 | 6h |
| 用户记忆基础版 | P0 | 4h |

#### Sprint 3: 分析图表 (Week 3-4)

| 任务 | 优先级 | 预计工时 |
|------|--------|----------|
| 时间段选择器 | P1 | 6h |
| 心情曲线图表 | P1 | 8h |
| 情绪分布饼图 | P1 | 4h |
| 历史记录页面 | P1 | 8h |
| 时段热力图 | P1 | 8h |

#### Sprint 4: 深层分析 (Week 5-6)

| 任务 | 优先级 | 预计工时 |
|------|--------|----------|
| 马斯洛分析器 | P2 | 12h |
| 防御机制识别器 | P2 | 12h |
| 触发因素分析器 | P2 | 12h |
| 需求雷达图 | P2 | 6h |
| 洞察报告页面 | P2 | 8h |

### 7.2 里程碑

| 里程碑 | 完成标准 | 目标时间 |
|--------|----------|----------|
| M1: MVP | 心情记录 + 心理学建议 + 小确幸基础 | Week 2末 |
| M2: 分析功能 | 曲线图表 + 时段分析 | Week 4末 |
| M3: 深层洞察 | 马斯洛 + 防御 + 触发分析 | Week 6末 |

---

## 8. 性能优化方案

### 8.1 首屏加载优化

| 优化项 | 方案 | 预期效果 |
|--------|------|----------|
| 代码分割 | React.lazy + Suspense | 减少首屏JS 40% |
| 路由懒加载 | 按页面分割 | 首屏加载 < 1.5s |
| Tailwind优化 | 生产环境 purge-css | CSS体积减少 60% |

### 8.2 运行时优化

| 优化项 | 方案 | 预期效果 |
|--------|------|----------|
| 状态更新 | useMemo + useCallback | 减少无效渲染 |
| 图表优化 | 虚拟化 + 数据聚合 | 大数据量流畅 |
| 存储写入 | 防抖 + 批量写入 | 减少IO 70% |

---

## 9. 测试策略

### 9.1 测试分层

| 测试类型 | 覆盖范围 | 工具 |
|----------|----------|------|
| 单元测试 | 工具函数、分析引擎 | Vitest |
| 组件测试 | UI组件交互 | React Testing Library |
| 集成测试 | 页面流程 | Playwright |

### 9.2 核心测试用例

```typescript
describe('心情记录', () => {
  it('应能选择心情并设置强度', () => {});
  it('应能输入事件描述', () => {});
  it('应能提交并保存记录', () => {});
  it('应展示心理学建议', () => {});
});

describe('心情随笔', () => {
  it('应能分析混合心情', () => {});
  it('应生成心理评估师洞察', () => {});
});

describe('小确幸', () => {
  it('应能添加新的小事', () => {});
  it('应能完成小事并记录心情', () => {});
  it('不应重复推荐已完成的daily小事', () => {});
});
```

---

## 10. 环境配置

### 10.1 环境要求

```bash
# Node.js版本
node >= 16.14.2

# 包管理器
npm >= 9.0.0
```

### 10.2 Git规范

```
分支命名：
- main: 主分支
- feature/*: 功能分支
- fix/*: 修复分支

提交规范：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
```

---

**文档信息**：

| 项目 | 内容 |
|------|------|
| 作者 | AI Assistant |
| 版本 | v1.0 |
| 日期 | 2026-04-03 |
| 状态 | 已完成 |
