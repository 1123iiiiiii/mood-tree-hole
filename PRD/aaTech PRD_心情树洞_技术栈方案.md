# 心情树洞 - 技术栈产品需求文档 (Tech PRD)

> **版本**：v1.0
> **日期**：2026-04-03
> **状态**：草稿
> **产品名称**：心情树洞
> **文档类型**：技术栈实现文档
> **基于PRD**：[PRD_心情树洞_v2.0.md](file:///d:/AI/Agent/Trae%20CN/profile_answer/train2/PRD_%E5%BF%83%E6%83%85%E6%A0%91%E6%B4%9E_v2.0.md)

---

## 1. 产品概述

### 1.1 产品定位

一款轻量级的心情记录工具，帮助用户记录生活事件与情绪反应，通过心理学知识分析情绪；同时提供"小确幸"清单功能，帮助用户积累愉悦身心的小事，通过完成小事提升心情，追踪记录完成后的情绪变化。

**产品slogan**：记录心情，遇见更好的自己

### 1.2 核心功能模块

| 模块 | 描述 | 优先级 |
|------|------|--------|
| 心情记录 | 记录事件、选择心情、获取心理学建议 | P0 |
| 小确幸清单 | 管理小事清单、智能推荐、完成打卡、心情追踪 | P0 |
| 用户记忆 | 偏好记忆、行为学习、推荐去重 | P0 |
| 心情曲线 | 时间段选择、多种图表展示 | P1 |
| 深层心理分析 | 马斯洛需求、防御机制、触发因素、成长追踪 | P2 |

### 1.3 技术架构总览

```
┌─────────────────────────────────────────────────────────────────────┐
│                           用户交互层 (React)                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │
│  │记录页面 │  │历史页面 │  │小确幸页 │  │分析页面 │  │洞察报告 │   │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │
└────────┼───────────┼───────────┼───────────┼───────────┼──────────┘
         │           │           │           │           │
         ▼           ▼           ▼           ▼           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         状态管理层 (Context)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │ MoodContext │  │HappinessCtx │  │ MemoryCtx   │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
└─────────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       心理学分析引擎 (Engine)                        │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐          │
│  │需求层次分析│ │防御机制识别│ │触发因素分析│ │成长追踪   │          │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘          │
│        └─────────────┴─────────────┴─────────────┘                  │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐                        │
│  │推荐引擎  │ │情绪曲线聚合│ │洞察生成器 │                        │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘                        │
└────────┼──────────────┼──────────────┼───────────────────────────────┘
         │              │              │
         ▼              ▼              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      AI服务层 (国内免费模型) ⚡新增                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │
│  │  智谱AI    │  │  阿里通义   │  │  百度文心   │                 │
│  │  (GLM-4)  │  │ (Qwen)      │  │ (ERNIE)     │                 │
│  └─────────────┘  └─────────────┘  └─────────────┘                 │
│         │                │                │                       │
│         ▼                ▼                ▼                       │
│  ┌─────────────────────────────────────────────────────┐           │
│  │              AI服务管理器 (降级策略 + 缓存)          │           │
│  └─────────────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         本地存储层                                   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐          │
│  │localStorage   │  │  IndexedDB    │  │  内存缓存     │          │
│  │(心情记录)     │  │(历史大数据)   │  │(会话状态)     │          │
│  └───────────────┘  └───────────────┘  └───────────────┘          │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. 技术栈选型

### 2.1 前端技术栈

| 层级 | 推荐技术 | 版本 | 选型理由 |
|------|----------|------|----------|
| **框架** | React | 18.x | 生态丰富，适合复杂状态管理 |
| **语言** | TypeScript | 5.x | 类型安全，提高代码质量 |
| **构建工具** | Vite | 5.x | 极速热更新，开发体验好 |
| **样式方案** | Tailwind CSS | 3.4 | 快速开发，主题切换方便 |
| **状态管理** | React Context + useReducer | - | 轻量级，无需额外依赖 |
| **图表库** | Recharts | 2.x | React原生，支持性好 |
| **日期处理** | date-fns | 3.x | 轻量、模块化、无依赖 |
| **唯一ID** | uuid | 9.x | 稳定的UUID生成 |
| **图标** | @heroicons/react | 2.x | Tailwind官方合作 |
| **路由** | React Router | 6.x | React标准路由方案 |

### 2.2 AI模型服务（国内免费模型）

| 服务商 | 模型 | 免费额度 | 适用场景 | 备注 |
|--------|------|----------|----------|------|
| **百度智能云** | ERNIE-4.0 | 500次/天 | 深度心理分析、洞察生成 | 需要API Key |
| **阿里云** | Qwen-turbo | 100万tokens/月 | 情绪解读、建议生成 | 需要阿里云账号 |
| **智谱AI** | GLM-4 | 100万tokens/月 | 情绪分类、模式识别 | 需要API Key |
| **讯飞星火** | Spark-3.5 | 无限调用 | 语音交互、心理对话 | 需要AppID |
| **腾讯混元** | Hunyuan | 10万次/天 | 综合分析 | 需要AppID |

### 2.3 AI能力应用矩阵

| 功能 | 本地规则引擎 | AI模型增强 | 说明 |
|------|-------------|------------|------|
| 情绪识别 | ✅ 基础规则 | ✅ 语义理解 | 理解复杂情绪表达 |
| 心理学建议 | ✅ 预设话语库 | ✅ 个性化生成 | AI生成更贴合的建议 |
| 需求层次分析 | ✅ 规则映射 | ✅ 深度解读 | 理解事件深层含义 |
| 防御机制识别 | ✅ 模式匹配 | ✅ 语义分析 | 更准确的机制识别 |
| 触发因素分析 | ✅ 关联统计 | ✅ 因果推理 | 发现隐藏关联 |
| 洞察生成 | ✅ 模板填充 | ✅ 智能生成 | 更人性化的洞察 |
| 小确幸推荐 | ✅ 规则推荐 | ✅ 语义匹配 | 更智能的个性化推荐 |

### 2.2 依赖包清单

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.3.0",
    "uuid": "^9.0.0",
    "@heroicons/react": "^2.1.0",
    "axios": "^1.6.0"
  }
}
```

### 2.4 AI服务接口设计

```typescript
// services/ai/BaseAIService.ts
interface AIRequest {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  max_tokens?: number;
}

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  id: string;
  model: string;
  choices: AIChoice[];
  usage: AIUsage;
}

interface AIChoice {
  message: AIMessage;
  finish_reason: string;
}

interface AIUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

abstract class BaseAIService {
  protected apiKey: string;
  protected baseURL: string;

  constructor(apiKey: string, baseURL: string) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }

  abstract chat(request: AIRequest): Promise<AIResponse>;

  protected async request<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`AI API Error: ${response.status}`);
    }

    return response.json();
  }
}
```

### 2.5 国内AI服务商实现

```typescript
// services/ai/ZhipuAIService.ts
class ZhipuAIService extends BaseAIService {
  private model = 'glm-4';

  constructor(apiKey: string) {
    super(apiKey, 'https://open.bigmodel.cn/api/paas/v4');
  }

  async chat(request: AIRequest): Promise<AIResponse> {
    return this.request('/chat/completions', {
      model: this.model,
      messages: request.messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.max_tokens ?? 1000,
    });
  }

  async analyzeEmotion(event: string, mood: string): Promise<EmotionAnalysis> {
    const response = await this.chat({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的心理咨询师，擅长分析情绪和提供心理建议。'
        },
        {
          role: 'user',
          content: `用户描述事件："${event}"，当前心情：${mood}。
                   请分析：
                   1. 这个情绪背后的深层原因
                   2. 可能反映的心理需求
                   3. 适合的调适建议
                   请用温暖、专业的语气回答。`
        }
      ],
    });

    return this.parseEmotionAnalysis(response.choices[0].message.content);
  }

  async generateInsight(records: MoodRecord[]): Promise<PsychologyInsight[]> {
    const recordsText = records.map(r =>
      `日期：${r.createdAt}，心情：${r.mood}，强度：${r.intensity}，事件：${r.event}`
    ).join('\n');

    const response = await this.chat({
      model: this.model,
      messages: [
        {
          role: 'system',
          content: '你是一个专业的心理健康顾问，擅长分析用户的心理状态和提供成长建议。'
        },
        {
          role: 'user',
          content: `用户的心情记录如下：
                   ${recordsText}
                   请分析：
                   1. 用户的情绪模式和趋势
                   2. 潜在的心理需求
                   3. 可以改进的方面
                   4. 具体的成长建议
                   请用温暖、支持的语气回答，并给出具体的建议。`
        }
      ],
    });

    return this.parseInsights(response.choices[0].message.content);
  }

  private parseEmotionAnalysis(content: string): EmotionAnalysis {
    // 解析AI返回的分析结果
    return {
      deepReason: '',
      relatedNeed: 'social',
      suggestions: [content],
    };
  }

  private parseInsights(content: string): PsychologyInsight[] {
    return [{
      type: 'suggestion',
      title: 'AI洞察',
      description: content,
      evidence: [],
      suggestion: content,
    }];
  }
}

// services/ai/QwenAIService.ts
class QwenAIService extends BaseAIService {
  private model = 'qwen-turbo';

  constructor(apiKey: string) {
    super(apiKey, 'https://dashscope.aliyuncs.com/api/v1');
  }

  async chat(request: AIRequest): Promise<AIResponse> {
    return this.request('/services/aigc/text-generation/generation', {
      model: this.model,
      input: {
        prompt: request.messages.map(m => `${m.role}: ${m.content}`).join('\n'),
      },
      parameters: {
        temperature: request.temperature ?? 0.7,
        max_tokens: request.max_tokens ?? 1000,
      },
    });
  }
}
```

### 2.6 AI服务降级策略

```typescript
// services/ai/AIServiceManager.ts
class AIServiceManager {
  private services: Map<string, BaseAIService> = new Map();
  private currentService: string = 'zhipu';
  private fallbackToLocal: boolean = true;

  constructor() {
    // 默认使用智谱AI（免费额度充足）
    const zhipuKey = localStorage.getItem('zhipu_api_key');
    if (zhipuKey) {
      this.services.set('zhipu', new ZhipuAIService(zhipuKey));
    }

    // 阿里云作为备选
    const qwenKey = localStorage.getItem('qwen_api_key');
    if (qwenKey) {
      this.services.set('qwen', new QwenAIService(qwenKey));
    }
  }

  async chat(message: string, context?: any): Promise<string> {
    try {
      const service = this.services.get(this.currentService);
      if (!service) {
        return this.getLocalResponse(message, context);
      }

      const response = await service.chat({
        model: '',
        messages: [{ role: 'user', content: message }],
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.warn('AI service error, falling back to local:', error);

      if (this.fallbackToLocal) {
        return this.getLocalResponse(message, context);
      }
      throw error;
    }
  }

  private getLocalResponse(message: string, context?: any): string {
    // 本地规则引擎降级响应
    // 实现基于预设知识库的回复
    return '抱歉，AI服务暂时不可用，请稍后再试。';
  }

  switchService(name: string): void {
    if (this.services.has(name)) {
      this.currentService = name;
    }
  }
}
```

### 2.3 技术栈矩阵

| 功能需求 | 技术方案 | 备选方案 |
|----------|----------|----------|
| 心情记录表单 | 受控组件 + React Hook Form | 原生表单 |
| 心情曲线图表 | Recharts LineChart | Chart.js |
| 情绪分布饼图 | Recharts PieChart | Chart.js |
| 时段热力图 | Recharts + 自定义组件 | ECharts |
| 需求雷达图 | Recharts RadarChart | ECharts |
| 日期范围选择 | 自定义组件 | react-datepicker |
| 本地存储 | localStorage + 封装 | IndexedDB (Dexie) |
| 状态管理 | Context + useReducer | Zustand |
| 路由管理 | React Router | wouter |
| 动画效果 | CSS Transitions + Framer Motion | 原生CSS |

---

## 3. 项目结构

### 3.1 目录结构

```
mood-tree-hole/
├── src/
│   ├── components/                 # 可复用组件
│   │   ├── ui/                   # 基础UI组件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Tabs.tsx
│   │   │
│   │   ├── mood/                # 心情相关组件
│   │   │   ├── MoodSelector.tsx       # 心情选择器
│   │   │   ├── MoodIcon.tsx           # 心情图标
│   │   │   ├── IntensitySlider.tsx     # 强度滑块
│   │   │   └── MoodRecordForm.tsx      # 记录表单
│   │   │
│   │   ├── psychology/           # 心理学相关组件
│   │   │   ├── PsychologyCard.tsx      # 心理学建议卡片
│   │   │   ├── AffirmationCard.tsx    # 调适话语卡片
│   │   │   └── ActivityCard.tsx        # 活动推荐卡片
│   │   │
│   │   ├── smallHappiness/       # 小确幸相关组件
│   │   │   ├── SmallHappyCard.tsx      # 小确幸卡片
│   │   │   ├── SmallHappyList.tsx      # 小确幸列表
│   │   │   ├── SmallHappyForm.tsx      # 添加表单
│   │   │   └── SmallHappyCompletion.tsx # 完成弹窗
│   │   │
│   │   ├── charts/               # 图表组件
│   │   │   ├── MoodCurveChart.tsx      # 心情曲线图
│   │   │   ├── MoodPieChart.tsx        # 情绪分布饼图
│   │   │   ├── HeatmapChart.tsx        # 热力图
│   │   │   ├── RadarChart.tsx          # 雷达图
│   │   │   └── ProgressBar.tsx         # 进度条
│   │   │
│   │   ├── analysis/             # 分析相关组件
│   │   │   ├── TimeRangeSelector.tsx   # 时间段选择器
│   │   │   ├── InsightCard.tsx        # 洞察卡片
│   │   │   ├── NeedHierarchy.tsx       # 需求层次图
│   │   │   ├── DefenseMechanism.tsx    # 防御机制图
│   │   │   └── TriggerAnalysis.tsx     # 触发因素分析
│   │   │
│   │   └── layout/               # 布局组件
│   │       ├── AppLayout.tsx           # 主布局
│   │       ├── BottomNav.tsx           # 底部导航
│   │       └── Header.tsx              # 顶部导航
│   │
│   ├── pages/                   # 页面组件
│   │   ├── RecordPage.tsx             # 记录页
│   │   ├── HistoryPage.tsx            # 历史页
│   │   ├── HappinessPage.tsx           # 小确幸页
│   │   ├── AnalysisPage.tsx           # 分析页
│   │   └── InsightReportPage.tsx       # 洞察报告页
│   │
│   ├── context/                  # 全局状态管理
│   │   ├── MoodContext.tsx            # 心情记录状态
│   │   ├── HappinessContext.tsx        # 小确幸状态
│   │   ├── MemoryContext.tsx           # 用户记忆状态
│   │   ├── AnalysisContext.tsx         # 分析状态
│   │   └── AppContext.tsx             # App全局状态
│   │
│   ├── hooks/                    # 自定义Hooks
│   │   ├── useMoodRecords.ts          # 心情记录
│   │   ├── useSmallHappiness.ts        # 小确幸
│   │   ├── useUserMemory.ts           # 用户记忆
│   │   ├── usePsychology.ts           # 心理学建议
│   │   ├── useMoodAnalysis.ts         # 心情分析
│   │   ├── useTimeRange.ts            # 时间范围
│   │   ├── useStorage.ts              # 本地存储
│   │   └── useMediaQuery.ts           # 响应式
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
│   ├── services/                  # AI服务层 ⚡新增
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
│   │   │   ├── moodInterpretations.ts  # 情绪解读
│   │   │   ├── affirmations.ts         # 调适话语
│   │   │   ├── activities.ts           # 推荐活动
│   │   │   └── defenseMechanisms.ts    # 防御机制
│   │   ├── smallHappiness.ts           # 预设小事库
│   │   ├── userSettings.ts            # 用户设置
│   │   └── mockData.ts                # Mock数据
│   │
│   ├── utils/                    # 工具函数
│   │   ├── storage.ts                  # localStorage封装
│   │   ├── dateUtils.ts                # 日期处理
│   │   ├── moodUtils.ts                # 心情工具
│   │   ├── validation.ts               # 表单验证
│   │   ├── analytics.ts                # 统计工具
│   │   └── helpers.ts                  # 通用帮助函数
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

### 3.2 文件编码规范

| 类别 | 规范 | 说明 |
|------|------|------|
| **组件文件** | PascalCase | 如 `MoodSelector.tsx` |
| **工具文件** | camelCase | 如 `dateUtils.ts` |
| **类型文件** | camelCase | 如 `moodTypes.ts` |
| **测试文件** | *.test.ts(x) | 如 `dateUtils.test.ts` |
| **样式文件** | kebab-case | 如 `globals.css` |

---

## 4. 核心模块技术方案

### 4.1 心情记录模块

#### 4.1.1 组件结构

```
MoodRecordForm
├── MoodSelector          # 心情选择（7种情绪）
├── IntensitySlider      # 强度滑块（1-10）
├── EventInput           # 事件输入（TextArea）
├── TagSelector          # 标签选择（多选）
└── PsychologyCard        # 心理学建议（结果展示）
```

#### 4.1.2 状态管理

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
  | { type: 'DELETE_RECORD'; payload: string };
```

#### 4.1.3 数据验证规则

| 字段 | 规则 | 错误提示 |
|------|------|----------|
| 心情 | 必选 | "请选择你的心情" |
| 强度 | 1-10整数 | "强度值应在1-10之间" |
| 事件 | 最少10字符 | "请描述一下发生了什么（至少10个字）" |
| 标签 | 可选，最多5个 | "最多选择5个标签" |

### 4.2 小确幸模块

#### 4.2.1 组件结构

```
SmallHappyPage
├── SmallHappyHeader          # 头部（统计 + 添加按钮）
├── SmallHappyFilter          # 筛选（类别/频率）
├── SmallHappyList            # 列表
│   └── SmallHappyCard        # 单个小事卡片
│       └── CompletionModal    # 完成弹窗（记录心情）
├── SmallHappyForm            # 添加/编辑表单
└── SmallHappyRecommendation  # 智能推荐区
```

#### 4.2.2 推荐算法流程

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
  // daily: 每天不重复推荐
  // weekly: 每周不重复推荐
  // once: 只推荐一次
  private shouldRecommend(item: SmallHappy, lastCompleted?: string): boolean {
    if (!lastCompleted) return true;
    const daysSince = differenceInDays(new Date(), new Date(lastCompleted));
    return item.frequency === 'daily' ? daysSince >= 1 :
           item.frequency === 'weekly' ? daysSince >= 7 : false;
  }
}
```

### 4.3 心理学分析模块

#### 4.3.1 分析引擎架构

```typescript
// engine/BaseAnalyzer.ts
abstract class BaseAnalyzer<T> {
  protected records: MoodRecord[] = [];
  protected timeRange: TimeRange | null = null;
  protected memory: UserMemory | null = null;

  setRecords(records: MoodRecord[]): this {
    this.records = records;
    return this;
  }

  setTimeRange(timeRange: TimeRange): this {
    this.timeRange = timeRange;
    return this;
  }

  setMemory(memory: UserMemory): this {
    this.memory = memory;
    return this;
  }

  protected filterByTimeRange(records: MoodRecord[]): MoodRecord[] {
    if (!this.timeRange) return records;
    const { startDate, endDate } = this.timeRange;
    return records.filter(r =>
      r.createdAt >= startDate && r.createdAt <= endDate
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

  analyze(records: MoodRecord[], timeRange: TimeRange, memory: UserMemory): AnalysisResult {
    const result: AnalysisResult = {};

    this.analyzers.forEach((analyzer, name) => {
      analyzer
        .setRecords(records)
        .setTimeRange(timeRange)
        .setMemory(memory);
      result[name] = analyzer.analyze();
    });

    return result;
  }
}
```

#### 4.3.2 马斯洛需求分析算法

```typescript
// engine/MaslowAnalyzer.ts
interface NeedEmotionMapping {
  [need: string]: {
    positive: MoodType[];
    negative: MoodType[];
  };
}

const NEED_EMOTION_MAP: NeedEmotionMapping = {
  physiological: {
    positive: ['calm', 'happy'],
    negative: ['sad', 'angry', 'anxious'], // 疲惫、烦躁信号
  },
  safety: {
    positive: ['calm', 'happy'],
    negative: ['anxious', 'fearful'], // 焦虑、恐惧信号
  },
  social: {
    positive: ['happy', 'calm'],
    negative: ['sad', 'anxious'], // 孤独、被拒绝信号
  },
  esteem: {
    positive: ['happy', 'surprised'],
    negative: ['angry', 'sad'], // 愤怒、羞耻信号
  },
  selfActualization: {
    positive: ['happy', 'calm'],
    negative: ['sad', 'anxious'], // 空虚、迷茫信号
  },
};

class MaslowAnalyzer extends BaseAnalyzer<MaslowAnalysis> {
  analyze(): MaslowAnalysis {
    const filtered = this.filterByTimeRange(this.records);
    const needs: MaslowAnalysis['needs'] = {} as any;

    // 计算各需求满足度
    (['physiological', 'safety', 'social', 'esteem', 'selfActualization'] as NeedLevel[])
      .forEach(need => {
        needs[need] = this.calculateNeedSatisfaction(filtered, need);
      });

    // 找出主导需求和未满足需求
    const sortedNeeds = Object.entries(needs)
      .sort(([, a], [, b]) => a.score - b.score);

    return {
      userId: this.memory?.userId || 'anonymous',
      timeRange: this.timeRange!,
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

    return {
      score,
      evidence: evidence.slice(0, 3),
      triggerEvents: [],
      trend: 'stable',
    };
  }
}
```

#### 4.3.3 防御机制识别算法

```typescript
// engine/DefenseMechanismAnalyzer.ts
interface DefenseSignal {
  mechanism: DefenseMechanismType;
  pattern: RegExp | ((record: MoodRecord) => boolean);
  maturity: 'mature' | 'intermediate' | 'immature';
}

const DEFENSE_SIGNALS: DefenseSignal[] = [
  {
    mechanism: 'sublimation',
    pattern: (record) =>
      record.mood === 'happy' &&
      record.tags?.includes('exercise' || 'creative'),
    maturity: 'mature',
  },
  {
    mechanism: 'suppression',
    pattern: (record) =>
      record.intensity < 5 && record.mood !== 'happy',
    maturity: 'intermediate',
  },
  {
    mechanism: 'rationalization',
    pattern: /因为|所以|只是|罢了/,
    maturity: 'intermediate',
  },
  {
    mechanism: 'projection',
    pattern: (record) =>
      record.event?.includes('他让我') || record.event?.includes('都是因为'),
    maturity: 'intermediate',
  },
  {
    mechanism: 'denial',
    pattern: (record) =>
      record.event?.includes('我没') || record.event?.includes('不是'),
    maturity: 'immature',
  },
];
```

#### 4.3.4 触发因素分析算法

```typescript
// engine/TriggerAnalyzer.ts
class TriggerAnalyzer extends BaseAnalyzer<TriggerAnalysis> {
  analyze(): TriggerAnalysis {
    const filtered = this.filterByTimeRange(this.records);

    // 1. 事件-情绪关联分析
    const eventEmotionCorrelations = this.analyzeEventEmotionCorrelation(filtered);

    // 2. 情绪时序链分析
    const emotionSequences = this.analyzeEmotionSequences(filtered);

    // 3. 识别高频模式
    const patterns = this.identifyPatterns(eventEmotionCorrelations, emotionSequences);

    return {
      userId: this.memory?.userId || 'anonymous',
      timeRange: this.timeRange!,
      eventEmotionCorrelations,
      emotionSequences,
      patterns,
      insights: this.generateInsights(patterns),
    };
  }

  private analyzeEventEmotionCorrelation(records: MoodRecord[]) {
    const correlationMap = new Map<string, Map<MoodType, number>>();

    records.forEach(record => {
      if (!record.event) return;

      // 提取关键词（简化处理）
      const keywords = this.extractKeywords(record.event);
      keywords.forEach(keyword => {
        if (!correlationMap.has(keyword)) {
          correlationMap.set(keyword, new Map());
        }
        const moodCount = correlationMap.get(keyword)!;
        moodCount.set(record.mood, (moodCount.get(record.mood) || 0) + 1);
      });
    });

    return Array.from(correlationMap.entries())
      .map(([event, moodCounts]) => {
        const total = Array.from(moodCounts.values()).reduce((a, b) => a + b, 0);
        const dominantMood = Array.from(moodCounts.entries())
          .sort(([, a], [, b]) => b - a)[0][0];
        return {
          event,
          mood: dominantMood,
          frequency: total,
          percentage: Math.round((moodCounts.get(dominantMood)! / total) * 100),
        };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10);
  }

  private analyzeEmotionSequences(records: MoodRecord[]) {
    const sequences: Map<string, number> = new Map();

    for (let i = 0; i < records.length - 1; i++) {
      const current = records[i];
      const next = records[i + 1];
      const key = `${current.mood}→${next.mood}`;
      sequences.set(key, (sequences.get(key) || 0) + 1);
    }

    return Array.from(sequences.entries())
      .map(([key, frequency]) => {
        const [trigger, response] = key.split('→');
        return {
          trigger: trigger as MoodType,
          response: response as MoodType,
          frequency,
          interpretation: this.interpretSequence(trigger, response),
        };
      })
      .filter(s => s.frequency >= 2)
      .sort((a, b) => b.frequency - a.frequency);
  }
}
```

### 4.4 心情曲线模块

#### 4.4.1 曲线聚合算法

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
      timeRange: this.currentTimeRange,
      dailyAverages,
      hourlyPattern: [],
      weekdayPattern: this.calculateWeekdayPattern(records),
      moodDistribution: this.calculateMoodDistribution(records),
      events: this.extractMarkedEvents(records),
    };
  }
}
```

#### 4.4.2 时间段选择器

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

  return {
    timeRange,
    selectedPreset,
    customRange,
    selectPreset,
    selectCustomRange,
  };
}
```

---

## 5. 数据模型

### 5.1 核心类型定义

```typescript
// types/mood.ts
interface MoodRecord {
  id: string;
  event: string;
  mood: MoodType;
  intensity: number;
  tags: Tag[];
  createdAt: string;
  smallHappyId?: string;       // 关联的小确幸ID（可选）
  analysis?: MoodAnalysis;
}

type MoodType = 'happy' | 'calm' | 'anxious' | 'sad' | 'angry' | 'fearful' | 'surprised';

type Tag = 'work' | 'family' | 'health' | 'relationship' | 'finance' | 'study' | 'other';

interface MoodAnalysis {
  psychologyTip: string;
  affirmations: string[];
  recommendedActivities: string[];
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
  userId: string;
  timeRange: TimeRange;
  needs: Record<NeedLevel, NeedSatisfaction>;
  dominantNeed: NeedLevel;
  unsatisfiedNeeds: NeedLevel[];
  insights: PsychologyInsight[];
}

type NeedLevel = 'physiological' | 'safety' | 'social' | 'esteem' | 'selfActualization';

interface NeedSatisfaction {
  score: number;
  evidence: string[];
  triggerEvents: string[];
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
  userId: string;
  preferences: {
    favoriteCategories: SmallHappyCategory[];
    favoriteMoods: MoodType[];
    preferredAffirmationStyle: 'encouraging' | 'gentle' | 'motivating';
  };
  learning: {
    completedSmallHappyIds: string[];
    completionHistory: CategoryCompletion[];
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
```

### 5.2 存储结构

```typescript
// utils/storage.ts
const STORAGE_KEYS = {
  MOOD_RECORDS: 'mood_tree_hole_records_v1',
  SMALL_HAPPIES: 'mood_tree_hole_happiness_v1',
  SMALL_HAPPY_RECORDS: 'mood_tree_hole_happiness_records_v1',
  USER_MEMORY: 'mood_tree_hole_memory_v1',
  SETTINGS: 'mood_tree_hole_settings_v1',
};

interface StorageVersion {
  version: number;
  lastMigrated: string;
}

class StorageService {
  private static instance: StorageService;

  static getInstance(): StorageService {
    if (!this.instance) {
      this.instance = new StorageService();
    }
    return this.instance;
  }

  // 通用读取
  get<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  // 通用写入
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // 防抖写入（用于频繁更新的数据）
  private writeQueue = new Map<string, any>();
  private writeTimer: number | null = null;

  setDebounced(key: string, value: any, delay = 500): void {
    this.writeQueue.set(key, value);
    if (this.writeTimer) clearTimeout(this.writeTimer);
    this.writeTimer = window.setTimeout(() => {
      this.writeQueue.forEach((v, k) => {
        localStorage.setItem(k, JSON.stringify(v));
      });
      this.writeQueue.clear();
    }, delay);
  }

  // 移除
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // 清除所有
  clear(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // 数据迁移
  migrate(fromVersion: number, toVersion: number, data: any): any {
    // TODO: 实现数据迁移逻辑
    return data;
  }
}
```

---

## 6. 组件清单

### 6.1 基础UI组件

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
| Avatar | src, alt, size | 头像 |
| Empty | description, action | 空状态 |

### 6.2 业务组件

| 组件 | 说明 | 依赖 |
|------|------|------|
| MoodSelector | 7种心情选择网格 | MoodIcon |
| MoodIcon | 心情emoji图标 | - |
| IntensitySlider | 1-10强度滑块 | Slider |
| PsychologyCard | 心理学建议展示 | AffirmationCard, ActivityCard |
| SmallHappyCard | 小确幸展示卡片 | Badge |
| SmallHappyForm | 添加/编辑小确幸表单 | Input, Select, Modal |
| MoodCurveChart | 心情强度曲线图 | Recharts LineChart |
| MoodPieChart | 情绪分布饼图 | Recharts PieChart |
| HeatmapChart | 时段热力图 | 自定义组件 |
| RadarChart | 需求层次雷达图 | Recharts RadarChart |
| TimeRangeSelector | 时间段选择器 | Button, DatePicker |
| InsightCard | 洞察结果卡片 | Badge |

---

## 7. 页面路由

### 7.1 路由配置

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
  {
    path: '/insight',
    element: <InsightReportPage />,
    label: '洞察',
    icon: LightbulbIcon,
  },
];
```

### 7.2 页面Tab结构

| 页面 | Tab配置 |
|------|---------|
| RecordPage | 单一页面，无需Tab |
| HistoryPage | [全部] [筛选] |
| HappinessPage | [清单] [推荐] [统计] |
| AnalysisPage | [统计概览] [趋势图表] |
| InsightReportPage | [需求层次] [防御机制] [触发因素] [成长追踪] |

---

## 8. 开发计划

### 8.1 Sprint规划

#### Sprint 1: 项目初始化 + 核心记录 (Week 1)

| 任务 | 描述 | 优先级 | 预计工时 |
|------|------|--------|----------|
| 项目初始化 | Vite + React + TS + Tailwind | P0 | 4h |
| 基础UI组件库 | Button, Card, Input, Modal | P0 | 8h |
| 心情记录页面 | 表单 + 心情选择 + 强度滑块 | P0 | 8h |
| 心理学知识库 | 情绪解读 + 话语 + 活动 | P0 | 4h |
| 心理学建议展示 | PsychologyCard组件 | P0 | 4h |
| localStorage封装 | StorageService | P0 | 4h |
| 集成测试 | 核心流程测试 | P0 | 4h |

#### Sprint 2: 小确幸模块 (Week 2)

| 任务 | 描述 | 优先级 | 预计工时 |
|------|------|--------|----------|
| 小确幸数据模型 | 类型定义 + Mock数据 | P0 | 2h |
| 小确幸列表页面 | 列表 + 筛选 | P0 | 6h |
| 添加/编辑表单 | SmallHappyForm | P0 | 4h |
| 完成打卡功能 | 完成弹窗 + 心情记录 | P0 | 6h |
| 推荐引擎基础版 | 基于心情推荐 | P0 | 6h |
| 用户记忆基础版 | 偏好记忆 + 去重 | P0 | 4h |
| 集成测试 | 小确幸流程测试 | P0 | 4h |

#### Sprint 3: 分析图表 (Week 3-4)

| 任务 | 描述 | 优先级 | 预计工时 |
|------|------|--------|----------|
| 时间段选择器 | 预设 + 自定义 | P1 | 6h |
| 心情曲线图表 | Recharts折线图 | P1 | 8h |
| 情绪分布饼图 | 占比展示 | P1 | 4h |
| 历史记录页面 | 列表 + 筛选 + 详情 | P1 | 8h |
| 时段热力图 | 周模式分析 | P1 | 8h |
| 基础统计分析 | 平均值、占比等 | P1 | 4h |
| 集成测试 | 分析功能测试 | P1 | 6h |

#### Sprint 4: 深层分析 (Week 5-6)

| 任务 | 描述 | 优先级 | 预计工时 |
|------|------|--------|----------|
| 马斯洛分析器 | 需求层次分析 | P2 | 12h |
| 防御机制识别器 | 机制识别 | P2 | 12h |
| 触发因素分析器 | 关联分析 | P2 | 12h |
| 需求雷达图 | 可视化展示 | P2 | 6h |
| 防御机制分布图 | 堆叠柱状图 | P2 | 6h |
| 洞察报告页面 | 综合展示 | P2 | 8h |
| 集成测试 | 深层分析测试 | P2 | 6h |

#### Sprint 5: 增强优化 (Week 7-8)

| 任务 | 描述 | 优先级 | 预计工时 |
|------|------|--------|----------|
| 成长追踪系统 | 环比分析 | P2 | 8h |
| 成就系统 | 里程碑 | P2 | 8h |
| 智能推荐优化 | 多维度排序 | P2 | 8h |
| 性能优化 | 懒加载 + 缓存 | P2 | 8h |
| UI/UX优化 | 动画 + 交互 | P2 | 6h |
| 数据导出 | JSON导出 | P2 | 4h |
| 最终测试 + 上线 | 全流程测试 | P0 | 8h |

### 8.2 里程碑

| 里程碑 | 完成标准 | 目标时间 |
|--------|----------|----------|
| M1: MVP | 心情记录 + 心理学建议 + 小确幸基础 | Week 2末 |
| M2: 分析功能 | 曲线图表 + 时段分析 | Week 4末 |
| M3: 深层洞察 | 马斯洛 + 防御 + 触发分析 | Week 6末 |
| M4: 正式发布 | 全部功能 + 优化 + 测试通过 | Week 8末 |

---

## 9. 性能优化方案

### 9.1 首屏加载优化

| 优化项 | 方案 | 预期效果 |
|--------|------|----------|
| 代码分割 | React.lazy + Suspense | 减少首屏JS 40% |
| 路由懒加载 | 按页面分割 | 首屏加载 < 1.5s |
| 图片优化 | WebP + 懒加载 | 减少带宽 30% |
| Tailwind优化 | 生产环境 purge-css | CSS体积减少 60% |

### 9.2 运行时优化

| 优化项 | 方案 | 预期效果 |
|--------|------|----------|
| 状态更新 | useMemo + useCallback | 减少无效渲染 |
| 图表优化 | 虚拟化 + 数据聚合 | 大数据量流畅 |
| 存储写入 | 防抖 + 批量写入 | 减少IO 70% |
| 心理学计算 | Web Worker异步 | UI不卡顿 |

### 9.3 缓存策略

| 数据类型 | 缓存策略 | 失效策略 |
|----------|----------|----------|
| 心情记录列表 | 内存缓存 | 新增/删除时更新 |
| 心理学知识库 | Static + 内存 | 不失效 |
| 用户记忆 | localStorage | 每次操作更新 |
| 分析结果 | 内存缓存 | 时间范围变化时更新 |

---

## 10. 测试策略

### 10.1 测试分层

| 测试类型 | 覆盖范围 | 工具 |
|----------|----------|------|
| 单元测试 | 工具函数、分析引擎 | Vitest + React Testing Library |
| 组件测试 | UI组件交互 | React Testing Library |
| 集成测试 | 页面流程 | Playwright |
| E2E测试 | 核心用户路径 | Playwright |

### 10.2 核心测试用例

```typescript
// 心情记录流程
describe('心情记录', () => {
  it('应能选择心情并设置强度', () => {});
  it('应能输入事件描述', () => {});
  it('应能选择标签', () => {});
  it('应能提交并保存记录', () => {});
  it('应展示心理学建议', () => {});
});

// 小确幸流程
describe('小确幸', () => {
  it('应能添加新的小事', () => {});
  it('应能完成小事并记录心情', () => {});
  it('不应重复推荐已完成的daily小事', () => {});
  it('应基于心情推荐合适的小事', () => {});
});

// AI服务测试
describe('AI服务', () => {
  it('应能正确调用智谱AI', async () => {});
  it('应能降级到本地规则引擎', async () => {});
  it('应能缓存AI响应', async () => {});
  it('应能处理API限流', async () => {});
});
```

---

## 11. 风险与应对

| 风险 | 影响 | 应对策略 | 优先级 |
|------|------|----------|--------|
| localStorage容量不足 | 数据无法存储 | 压缩数据 + IndexedDB降级 | P1 |
| 心理学算法准确度 | 分析结果不可靠 | 本地规则 + AI增强 + 免责声明 | P1 |
| 大数据量性能问题 | 图表卡顿 | 数据聚合 + 虚拟化 | P1 |
| 跨浏览器兼容性问题 | 部分功能失效 | Polyfill + 兼容性测试 | P2 |
| 图表定制化复杂 | 开发周期长 | 使用Recharts高级特性 | P1 |
| **AI服务不可用** | **无法获取AI分析** | **本地规则引擎降级** | **P1** |
| **API调用频率限制** | **请求被限流** | **请求队列 + 指数退避** | **P1** |
| **用户未配置API Key** | **无法使用AI功能** | **引导配置 + 本地功能完整** | **P2** |

---

## 12. 附录

### 12.1 环境配置

```bash
# Node.js版本
node >= 18.0.0

# 包管理器
npm >= 9.0.0 或 yarn >= 1.22.0 或 pnpm >= 8.0.0
```

### 12.2 Git规范

```
分支命名：
- main: 主分支
- feature/*: 功能分支
- fix/*: 修复分支
- refactor/*: 重构分支

提交规范：
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式
- refactor: 重构
- test: 测试
- chore: 构建/工具
```

### 12.3 代码审查清单

- [ ] TypeScript类型完整，无any
- [ ] 组件有 Props 接口定义
- [ ] 关键逻辑有注释
- [ ] 错误边界处理
- [ ] 性能优化（useMemo/useCallback）
- [ ] 单元测试覆盖
- [ ] 符合项目编码规范

### 12.4## 10.2 更新日志

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0 | 2026-04-03 | 初始版本，包含完整技术方案 |
| v1.1 | 2026-04-03 | 新增国内免费AI模型集成方案（智谱AI、阿里通义、百度文心） |

## 10.3 AI模型配置指南

### 10.3.1 智谱AI（推荐）

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号并获取 API Key
3. 在应用设置中配置 `zhipu_api_key`
4. 免费额度：100万tokens/月

### 10.3.2 阿里云通义千问

1. 访问 [阿里云百炼平台](https://bailian.console.aliyun.com/)
2. 开通服务并获取 API Key
3. 在应用设置中配置 `qwen_api_key`
4. 免费额度：100万tokens/月

### 10.3.3 百度文心一言

1. 访问 [百度智能云千帆平台](https://qianfan.cloud.baidu.com/)
2. 开通服务并获取 API Key
3. 在应用设置中配置 `ernie_api_key`
4. 免费额度：500次/天
