# 心情树洞 - Agent 协作文档 (AGENTS)

> **版本**：v1.0
> **日期**：2026-04-03
> **状态**：已完成
> **产品名称**：心情树洞
> **文档类型**：Agent 协作与职责定义文档

---

## 1. Agent 架构概述

### 1.1 Agent 生态系统

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           用户请求层                                        │
│                         (User Requests)                                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          协调 Agent (Orchestrator)                          │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     任务分类与路由                                   │   │
│  │  · 识别请求类型                                                     │   │
│  │  · 分发给合适的专业 Agent                                          │   │
│  │  · 整合各 Agent 结果                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  前端 Agent  │         │  后端 Agent   │         │  数据 Agent   │
│ (Frontend)   │         │  (Backend)    │         │   (Data)     │
└───────────────┘         └───────────────┘         └───────────────┘
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│  UI Agent    │         │  API Agent    │         │ 分析 Agent   │
│  组件开发    │         │  接口设计     │         │ 心理学引擎   │
└───────────────┘         └───────────────┘         └───────────────┘
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐         ┌───────────────┐         ┌───────────────┐
│ 样式 Agent   │         │ 存储 Agent   │         │ AI Agent    │
│ Tailwind    │         │ localStorage │         │ 模型集成    │
└───────────────┘         └───────────────┘         └───────────────┘
```

### 1.2 Agent 职责矩阵

| Agent | 主要职责 | 协作对象 | 输出产物 |
|-------|----------|----------|----------|
| 协调 Agent | 任务路由、结果整合 | 所有 Agent | 统一响应 |
| 前端 Agent | UI组件、页面开发 | 后端、数据、AI | React 组件 |
| 后端 Agent | API设计、业务逻辑 | 前端、数据 | 接口规范 |
| 数据 Agent | 数据模型、存储 | 前端、后端 | 类型定义、存储服务 |
| 分析 Agent | 心理学引擎、算法 | 前端、AI | 分析结果 |
| AI Agent | 模型集成、降级策略 | 分析 Agent | AI 响应 |
| UI Agent | 组件开发、样式 | 前端 Agent | UI 组件 |
| 样式 Agent | Tailwind、主题 | UI Agent | 样式规范 |

---

## 2. 核心 Agent 详细规范

### 2.1 协调 Agent (Orchestrator)

**职责**：
- 接收并解析用户请求
- 判断请求类型（功能开发、Bug修复、文档更新等）
- 路由到合适的专业 Agent
- 整合各 Agent 输出为统一响应
- 追踪任务进度和状态

**决策规则**：

```
IF 请求包含 "页面" OR "组件" OR "UI"
    → 路由到 前端 Agent

ELSE IF 请求包含 "API" OR "接口" OR "数据"
    → 路由到 后端 Agent

ELSE IF 请求包含 "分析" OR "心理学" OR "洞察"
    → 路由到 分析 Agent

ELSE IF 请求包含 "AI" OR "模型" OR "智能"
    → 路由到 AI Agent

ELSE IF 请求包含 "文档" OR "PRD" OR "README"
    → 路由到 文档 Agent

ELSE
    → 多 Agent 协作处理
```

**输出格式**：

```markdown
## 任务处理结果

### 任务类型
[识别到的任务类型]

### 处理 Agent
- 主处理：[Agent名称]
- 协作：[Agent列表]

### 执行步骤
1. [步骤1]
2. [步骤2]
...

### 输出产物
- [产物1]：文件路径
- [产物2]：文件路径

### 状态
✅ 完成 / 🔄 进行中 / ⚠️ 需要确认
```

### 2.2 前端 Agent (Frontend Agent)

**职责**：
- React 组件开发
- 页面路由配置
- 状态管理实现
- 生命周期管理
- 性能优化（useMemo、useCallback 等）

**工作流程**：

```
接收任务
    │
    ▼
分析组件需求
    │
    ├── 需要新组件？
    │   └── 是 → UI Agent 创建组件
    │
    ▼
设计组件结构
    │
    ▼
实现组件逻辑
    │
    ├── 需要状态？
    │   └── 是 → 集成 Context
    │
    ├── 需要副作用？
    │   └── 是 → 使用 useEffect
    │
    ▼
集成样式
    │
    ▼
测试组件
    │
    ▼
输出组件文件
```

**代码规范**：

```typescript
// 组件模板
interface ComponentProps {
  // 属性定义
}

export const ComponentName: React.FC<ComponentProps> = ({
  prop1,
  prop2,
}) => {
  // Hooks
  const [state, setState] = useState();

  // 业务逻辑
  const handleAction = useCallback(() => {
    // 处理逻辑
  }, [依赖]);

  // 渲染
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
};
```

**输出规范**：
- 每个组件单独文件
- 文件名：PascalCase（如 `MoodSelector.tsx`）
- 组件放在对应功能目录
- 导出组件和 Props 类型

### 2.3 后端 Agent (Backend Agent)

**职责**：
- 数据模型设计
- API 接口定义
- 业务逻辑封装
- 存储策略设计
- 数据验证规则

**工作流程**：

```
接收任务
    │
    ▼
分析数据需求
    │
    ▼
设计数据模型
    │
    ├── 定义 TypeScript 类型
    │
    ├── 定义接口方法
    │
    ▼
设计存储方案
    │
    ├── localStorage 结构
    │
    ├── 迁移策略
    │
    ▼
实现存储服务
    │
    ▼
实现业务逻辑
    │
    ▼
输出类型定义和服务
```

**代码规范**：

```typescript
// 类型定义模板
interface DataType {
  id: string;
  field1: string;
  field2: number;
  createdAt: string;
}

// 服务类模板
class DataService {
  private storageKey: string;

  constructor(storageKey: string) {
    this.storageKey = storageKey;
  }

  getAll(): DataType[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  save(item: DataType): void {
    const items = this.getAll();
    items.push(item);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  delete(id: string): void {
    const items = this.getAll().filter(item => item.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }
}
```

### 2.4 数据 Agent (Data Agent)

**职责**：
- TypeScript 类型定义
- 数据验证规则
- 数据转换逻辑
- 存储键管理
- 数据迁移策略

**类型定义规范**：

```typescript
// types/mood.ts
export type MoodType =
  | 'happy'
  | 'calm'
  | 'anxious'
  | 'sad'
  | 'angry'
  | 'fearful'
  | 'surprised';

export type Tag =
  | 'work'
  | 'family'
  | 'health'
  | 'relationship'
  | 'finance'
  | 'study'
  | 'other';

export interface MoodRecord {
  id: string;
  event: string;
  mood: MoodType;
  intensity: number;
  tags: Tag[];
  createdAt: string;
}

export interface MixedMood {
  mood: MoodType;
  percentage: number;
}
```

### 2.5 分析 Agent (Analysis Agent)

**职责**：
- 心理学分析引擎
- 马斯洛需求分析
- 防御机制识别
- 触发因素分析
- 成长追踪计算

**工作流程**：

```
接收分析请求
    │
    ▼
获取心情记录
    │
    ▼
按时间范围筛选
    │
    ▼
执行各类分析
    │
    ├── 马斯洛分析
    │
    ├── 防御机制分析
    │
    ├── 触发因素分析
    │
    ▼
生成洞察结果
    │
    ▼
返回分析报告
```

**引擎架构**：

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

// 引擎注册
class PsychologyEngine {
  private analyzers: Map<string, BaseAnalyzer<any>> = new Map();

  register(name: string, analyzer: BaseAnalyzer<any>): void {
    this.analyzers.set(name, analyzer);
  }

  analyze(records: MoodRecord[], timeRange: TimeRange): AnalysisResult {
    const result: AnalysisResult = {};
    this.analyzers.forEach((analyzer, name) => {
      result[name] = analyzer
        .setRecords(records)
        .setTimeRange(timeRange)
        .analyze();
    });
    return result;
  }
}
```

### 2.6 AI Agent (AI Agent)

**职责**：
- AI 服务集成
- 多模型支持
- 降级策略
- 响应缓存
- 错误处理

**服务架构**：

```typescript
// services/ai/AIServiceManager.ts
class AIServiceManager {
  private services: Map<string, BaseAIService> = new Map();
  private currentService: string = 'local';
  private fallbackToLocal: boolean = true;

  constructor() {
    // 本地规则引擎（默认）
    this.services.set('local', new LocalRuleEngine());

    // 智谱AI（可选）
    const zhipuKey = localStorage.getItem('zhipu_api_key');
    if (zhipuKey) {
      this.services.set('zhipu', new ZhipuAIService(zhipuKey));
    }
  }

  async analyze(mood: MoodType, event: string): Promise<AIResponse> {
    try {
      const service = this.services.get(this.currentService);
      return await service.analyze(mood, event);
    } catch (error) {
      if (this.fallbackToLocal) {
        return this.services.get('local')!.analyze(mood, event);
      }
      throw error;
    }
  }

  switchService(name: string): void {
    if (this.services.has(name)) {
      this.currentService = name;
    }
  }
}
```

### 2.7 UI Agent (UI Agent)

**职责**：
- 基础 UI 组件开发
- 组件复用性设计
- 无障碍支持（ARIA）
- 组件测试

**UI 组件清单**：

| 组件 | 说明 | 变体 |
|------|------|------|
| Button | 按钮 | primary, secondary, ghost, danger |
| Card | 卡片容器 | default, elevated, bordered |
| Input | 输入框 | text, password, number |
| TextArea | 多行输入 | default |
| Modal | 模态框 | default, confirm, alert |
| Slider | 滑块 | default, range |
| Badge | 标签 | default, primary, success, warning, error |
| Tabs | 标签页 | default, pill, underline |

### 2.8 样式 Agent (Style Agent)

**职责**：
- Tailwind CSS 配置
- 主题系统设计
- 样式规范制定
- 响应式设计

**设计规范**：

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          light: '#818cf8',
          dark: '#4f46e5',
        },
        secondary: {
          DEFAULT: '#ec4899',
          light: '#f472b6',
          dark: '#db2777',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
};
```

---

## 3. Agent 协作流程

### 3.1 功能开发流程

```
用户请求: 添加心情随笔的混合心情分析功能
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                      协调 Agent                             │
│  分析请求类型 → 功能开发                                    │
│  识别关键词：混合心情、分析                                │
└─────────────────────────────────────────────────────────────┘
    │
    ├──→ 前端 Agent: UI 展示
    │     │
    │     ├──→ UI Agent: 创建混合心情展示组件
    │     │
    │     └──→ 样式 Agent: 设计样式
    │
    ├──→ 数据 Agent: 定义 MixedMood 类型
    │
    ├──→ 分析 Agent: 实现混合心情分析算法
    │
    └──→ 后端 Agent: 存储逻辑
              │
              └──→ 数据 Agent: 更新存储服务
```

### 3.2 Bug 修复流程

```
用户请求: 心情随笔分析结果不显示
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                      协调 Agent                             │
│  分析问题 → Bug 修复                                       │
│  识别关键词：分析、显示                                    │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                      前端 Agent                             │
│  检查组件状态和渲染逻辑                                    │
│  发现：setState 调用问题                                   │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
修复代码
    │
    ▼
测试验证
    │
    ▼
输出修复报告
```

### 3.3 文档更新流程

```
用户请求: 更新 PRD 文档
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                      协调 Agent                             │
│  分析请求类型 → 文档更新                                    │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│                      文档 Agent                             │
│  读取现有文档                                               │
│  分析需要更新的内容                                         │
│  生成更新建议                                               │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
整合并更新文档
```

---

## 4. Agent 通信协议

### 4.1 任务传递格式

```typescript
interface AgentTask {
  id: string;
  type: 'feature' | 'bugfix' | 'docs' | 'refactor';
  priority: 'high' | 'medium' | 'low';
  description: string;
  context: {
    files?: string[];
    requirements?: string[];
  };
  assignee?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
}

interface AgentResponse {
  taskId: string;
  success: boolean;
  output: {
    files?: FileChange[];
    messages?: string[];
    errors?: string[];
  };
  nextSteps?: string[];
}
```

### 4.2 状态同步

```typescript
// 任务状态
interface TaskStatus {
  taskId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // 0-100
  currentStep: string;
  logs: LogEntry[];
}

// 日志条目
interface LogEntry {
  timestamp: string;
  agent: string;
  action: string;
  result: 'success' | 'error' | 'info';
  message: string;
}
```

---

## 5. Agent 能力矩阵

### 5.1 前端 Agent 能力

| 能力 | 熟练度 | 说明 |
|------|--------|------|
| React 组件开发 | ⭐⭐⭐⭐⭐ | 熟练掌握函数组件和 Hooks |
| TypeScript | ⭐⭐⭐⭐⭐ | 强类型定义 |
| Tailwind CSS | ⭐⭐⭐⭐⭐ | 快速样式开发 |
| 状态管理 | ⭐⭐⭐⭐ | Context + useReducer |
| 路由 | ⭐⭐⭐⭐ | React Router |
| 图表 | ⭐⭐⭐⭐ | Recharts |
| 测试 | ⭐⭐⭐ | React Testing Library |

### 5.2 后端 Agent 能力

| 能力 | 熟练度 | 说明 |
|------|--------|------|
| 数据模型设计 | ⭐⭐⭐⭐⭐ | TypeScript 类型定义 |
| 存储服务 | ⭐⭐⭐⭐⭐ | localStorage 封装 |
| 业务逻辑 | ⭐⭐⭐⭐ | 清晰的逻辑封装 |
| 数据验证 | ⭐⭐⭐⭐ | 表单验证规则 |
| 性能优化 | ⭐⭐⭐ | 防抖、批量写入 |

### 5.3 分析 Agent 能力

| 能力 | 熟练度 | 说明 |
|------|--------|------|
| 马斯洛分析 | ⭐⭐⭐⭐⭐ | 完整的算法实现 |
| 防御机制识别 | ⭐⭐⭐⭐ | 基于规则的模式匹配 |
| 触发因素分析 | ⭐⭐⭐⭐ | 关联分析算法 |
| 成长追踪 | ⭐⭐⭐⭐ | 环比计算 |
| 洞察生成 | ⭐⭐⭐⭐ | 模板 + 智能生成 |

### 5.4 AI Agent 能力

| 能力 | 熟练度 | 说明 |
|------|--------|------|
| 智谱AI 集成 | ⭐⭐⭐⭐ | API 对接 |
| 阿里通义集成 | ⭐⭐⭐⭐ | API 对接 |
| 本地降级 | ⭐⭐⭐⭐⭐ | 规则引擎 |
| 缓存策略 | ⭐⭐⭐⭐ | 响应缓存 |
| 错误处理 | ⭐⭐⭐⭐ | 优雅降级 |

---

## 6. Agent 协作场景

### 6.1 场景一：新功能开发

**请求**：实现小确幸的智能推荐功能

**协作流程**：

```
协调 Agent
    │
    ├── 分解任务
    │   ├── 数据模型设计 → 数据 Agent
    │   ├── 推荐算法 → 分析 Agent
    │   ├── 推荐 UI → 前端 Agent
    │   └── 存储逻辑 → 后端 Agent
    │
    ▼
并行执行
    │
    ├── 数据 Agent: 定义 SmallHappyRecommendation 类型
    │
    ├── 分析 Agent: 实现基于心情的推荐算法
    │
    ├── 前端 Agent: 创建推荐展示组件
    │
    └── 后端 Agent: 实现推荐数据存储
    │
    ▼
协调 Agent: 整合各 Agent 输出
    │
    ▼
输出: 完整的小确幸推荐功能
```

### 6.2 场景二：性能优化

**请求**：优化心情曲线图表性能

**协作流程**：

```
协调 Agent
    │
    ├── 分析问题
    │   └── 数据量大时图表卡顿
    │
    ├── 制定优化方案
    │   ├── 数据聚合 → 分析 Agent
    │   ├── 懒加载 → 前端 Agent
    │   └── 缓存 → 数据 Agent
    │
    ▼
执行优化
    │
    ├── 分析 Agent: 实现数据聚合，减少渲染点
    │
    ├── 前端 Agent: 添加图表懒加载
    │
    └── 数据 Agent: 实现分析结果缓存
    │
    ▼
测试验证
    │
    ▼
输出: 性能优化完成
```

### 6.3 场景三：文档生成

**请求**：生成项目技术文档

**协作流程**：

```
协调 Agent
    │
    ├── 文档任务
    │   ├── README.md → 文档 Agent
    │   ├── API 文档 → 后端 Agent
    │   ├── 组件文档 → UI Agent
    │   └── 数据字典 → 数据 Agent
    │
    ▼
各 Agent 生成文档
    │
    ├── 文档 Agent: 项目概述、使用说明
    │
    ├── 后端 Agent: API 接口文档
    │
    ├── UI Agent: 组件 API 文档
    │
    └── 数据 Agent: 数据模型文档
    │
    ▼
协调 Agent: 整合文档
    │
    ▼
输出: 完整项目文档
```

---

## 7. Agent 质量保证

### 7.1 代码审查清单

- [ ] TypeScript 类型完整，无 any
- [ ] 组件有 Props 接口定义
- [ ] 关键逻辑有注释
- [ ] 错误边界处理
- [ ] 性能优化（useMemo/useCallback）
- [ ] 单元测试覆盖
- [ ] 符合项目编码规范

### 7.2 测试覆盖率要求

| 模块 | 最低覆盖率 |
|------|------------|
| 工具函数 | 80% |
| 分析引擎 | 70% |
| 组件 | 50% |
| 存储服务 | 70% |

### 7.3 性能基准

| 指标 | 目标值 |
|------|--------|
| 首屏加载 | < 1.5s |
| 组件渲染 | < 100ms |
| 存储操作 | < 50ms |
| 分析计算 | < 500ms |

---

## 8. Agent 调度策略

### 8.1 任务优先级

| 优先级 | 条件 | 调度策略 |
|--------|------|----------|
| P0 | 核心功能、Bug | 立即处理，优先调度 |
| P1 | 重要功能 | 24h内处理 |
| P2 | 优化增强 | 72h内处理 |
| P3 | 低优先级 | 空闲时处理 |

### 8.2 负载均衡

```
监控 Agent 状态
    │
    ├── 空闲 Agent 数量
    │
    ├── 当前任务队列
    │
    └── 任务复杂度评估
    │
    ▼
智能分配
    │
    ├── 简单任务 → 单 Agent
    │
    ├── 复杂任务 → 多 Agent 协作
    │
    └── 大量任务 → 队列+批处理
```

---

## 9. 附录

### 9.1 Agent 命名规范

| Agent | 命名 | 说明 |
|-------|------|------|
| 协调 Agent | orchestrator | 任务调度中心 |
| 前端 Agent | frontend | UI 开发 |
| 后端 Agent | backend | 业务逻辑 |
| 数据 Agent | data | 数据处理 |
| 分析 Agent | analysis | 心理学引擎 |
| AI Agent | ai | 智能服务 |
| UI Agent | ui | 组件开发 |
| 样式 Agent | style | 样式设计 |
| 文档 Agent | docs | 文档编写 |

### 9.2 错误代码

| 代码 | 说明 | 处理策略 |
|------|------|----------|
| AGENT_001 | Agent 不可用 | 切换到备选 Agent |
| AGENT_002 | 任务超时 | 重试或降级 |
| AGENT_003 | 协作冲突 | 协调 Agent 仲裁 |
| AGENT_004 | 输出格式错误 | 返回错误信息 |
| AGENT_005 | 依赖缺失 | 通知前置 Agent |

---

**文档信息**：

| 项目 | 内容 |
|------|------|
| 作者 | AI Assistant |
| 版本 | v1.0 |
| 日期 | 2026-04-03 |
| 状态 | 已完成 |
