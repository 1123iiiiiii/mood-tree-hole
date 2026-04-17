import { MoodType, SmallHappy } from '@/types';

export const moodInterpretations: Record<MoodType, string> = {
  happy: '快乐是一种积极的情绪状态，通常与满足感、成就感或愉悦的体验相关。',
  calm: '平静是一种内心安宁、放松的状态，通常与压力减轻和情绪稳定相关。',
  anxious: '焦虑是对未来不确定性的一种担忧反应，可能与压力和过度思考有关。',
  sad: '悲伤是对损失或失望的自然反应，是人类情感的重要组成部分。',
  angry: '愤怒是对感知到的不公或威胁的反应，需要健康的表达方式。',
  fearful: '恐惧是对潜在危险的自然反应，帮助我们保持警惕。',
  surprised: '惊讶是对意外事件的即时反应，通常是短暂的情绪状态。',
};

export const affirmations: Record<MoodType, string[]> = {
  happy: [
    '我值得拥有这份快乐。',
    '珍惜当下的美好时光。',
    '快乐是我应得的。',
  ],
  calm: [
    '我此刻很安全，很平静。',
    '我可以控制自己的情绪。',
    '内心的平静是我最大的财富。',
  ],
  anxious: [
    '此刻的感受只是暂时的，我可以一步一步来。',
    '未来还没来，我能做的是把握现在。',
    '我有能力应对生活中的挑战。',
  ],
  sad: [
    '悲伤是成长的一部分，我会慢慢好起来。',
    '允许自己感受悲伤，这是正常的。',
    '阳光总在风雨后，我会度过这个难关。',
  ],
  angry: [
    '我可以表达自己的感受，同时保持尊重。',
    '深呼吸，给自己一点时间冷静。',
    '愤怒提醒我什么对我很重要。',
  ],
  fearful: [
    '恐惧是正常的，我可以面对它。',
    '我有能力保护自己。',
    '一步一步来，我会变得更勇敢。',
  ],
  surprised: [
    '生活充满惊喜，我喜欢这种感觉。',
    '意外可以带来新的机会。',
    '保持开放的心态，迎接新的体验。',
  ],
};

export const recommendedActivities: Record<MoodType, string[]> = {
  happy: ['与朋友分享快乐', '记录美好时刻', '做一件善良的事'],
  calm: ['深呼吸练习', '冥想', '散步', '听轻音乐'],
  anxious: ['4-7-8呼吸法', '渐进式肌肉放松', '写日记', '短距离散步'],
  sad: ['与亲友倾诉', '做喜欢的活动', '看一部温暖的电影', '户外散步'],
  angry: ['深呼吸', '写下来再撕掉', '体育锻炼', '找个安静的地方冷静'],
  fearful: ['正念呼吸', '面对恐惧的一小步', '与信任的人交流', '听鼓舞人心的音乐'],
  surprised: ['享受这一刻', '记录这个意外', '与他人分享', '反思这个经历'],
};

export const smallHappinessPresets: Omit<SmallHappy, 'id' | 'createdAt' | 'isArchived' | 'isCustom'>[] = [
  { title: '听15分钟轻音乐', category: 'relaxation', frequency: 'daily' },
  { title: '散步10分钟', category: 'exercise', frequency: 'daily' },
  { title: '喝一杯热茶', category: 'sensory', frequency: 'daily' },
  { title: '读一篇短文', category: 'growth', frequency: 'daily' },
  { title: '整理桌面', category: 'organize', frequency: 'daily' },
  { title: '给朋友发一条问候消息', category: 'social', frequency: 'daily' },
  { title: '做一次深呼吸练习', category: 'relaxation', frequency: 'daily' },
  { title: '看窗外的风景5分钟', category: 'sensory', frequency: 'daily' },
  { title: '写一件今天感恩的事', category: 'growth', frequency: 'daily' },
  { title: '伸展身体', category: 'exercise', frequency: 'daily' },
  { title: '画一幅简笔画', category: 'creative', frequency: 'weekly' },
  { title: '与朋友视频聊天', category: 'social', frequency: 'weekly' },
  { title: '尝试新的菜谱', category: 'creative', frequency: 'weekly' },
  { title: '去公园散步', category: 'nature', frequency: 'weekly' },
  { title: '读一章书', category: 'growth', frequency: 'weekly' },
  { title: '整理照片', category: 'organize', frequency: 'weekly' },
  { title: '听一场线上音乐会', category: 'sensory', frequency: 'weekly' },
  { title: '学习一个新技能', category: 'growth', frequency: 'weekly' },
  { title: '做一次冥想', category: 'relaxation', frequency: 'weekly' },
  { title: '与家人共进晚餐', category: 'social', frequency: 'weekly' },
];
