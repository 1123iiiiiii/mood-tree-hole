const express = require('express');
const auth = require('../middleware/auth');
const MoodRecord = require('../models/MoodRecord');
const SmallHappy = require('../models/SmallHappy');

const router = express.Router();

// 情绪分析
router.post('/analyze', auth, async (req, res) => {
  try {
    const { mood, event } = req.body;
    
    // 简单的关键词分析
    const keywords = {
      happy: ['开心', '快乐', '幸福', '高兴', '愉快', '欢乐', '喜悦', '满意'],
      calm: ['平静', '安宁', '放松', '舒适', '淡定', '舒缓'],
      anxious: ['焦虑', '担心', '紧张', '压力', '不安', '忧虑', '烦躁'],
      sad: ['伤心', '难过', '悲伤', '沮丧', '失落', '郁闷', '痛苦'],
      angry: ['生气', '愤怒', '恼火', '烦躁', '不满', '火大'],
      fearful: ['害怕', '恐惧', '担心', '不安', '紧张', '惊慌'],
      surprised: ['惊讶', '意外', '吃惊', '震惊', '惊喜', '诧异']
    };
    
    let insights = [];
    
    // 分析情绪关键词
    for (const [moodType, words] of Object.entries(keywords)) {
      const found = words.filter(word => event.includes(word));
      if (found.length > 0) {
        insights.push({
          type: moodType,
          keywords: found,
          message: `检测到与「${moodType}」相关的词汇: ${found.join('、')}`
        });
      }
    }
    
    // 生成建议
    let suggestions = [];
    switch (mood) {
      case 'happy':
        suggestions.push('保持这份愉悦心情，分享给身边的人');
        break;
      case 'calm':
        suggestions.push('平静是很好的状态，适合进行思考和规划');
        break;
      case 'anxious':
        suggestions.push('尝试深呼吸，暂时放下压力源，做一些放松活动');
        suggestions.push('可以听音乐或进行冥想缓解焦虑');
        break;
      case 'sad':
        suggestions.push('允许自己感受悲伤，但不要沉溺太久');
        suggestions.push('可以找朋友倾诉或做一些喜欢的事情转移注意力');
        break;
      case 'angry':
        suggestions.push('先冷静下来，给自己一些空间');
        suggestions.push('尝试用运动或其他方式发泄情绪');
        break;
      default:
        suggestions.push('关注自己的情绪变化，及时调整心态');
    }
    
    res.json({
      insights,
      suggestions,
      mood,
      event
    });
  } catch (error) {
    res.status(500).json({ error: '分析失败' });
  }
});

// 获取统计数据
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const records = await MoodRecord.find(query).sort({ createdAt: -1 });
    
    // 情绪分布
    const moodDistribution = {};
    records.forEach(r => {
      moodDistribution[r.mood] = (moodDistribution[r.mood] || 0) + 1;
    });
    
    // 平均强度
    const avgIntensity = records.length > 0
      ? records.reduce((sum, r) => sum + r.intensity, 0) / records.length
      : 0;
    
    // 时段分布
    const timeSlotDistribution = {};
    records.forEach(r => {
      timeSlotDistribution[r.timeSlot] = (timeSlotDistribution[r.timeSlot] || 0) + 1;
    });
    
    // 标签统计
    const tagDistribution = {};
    records.forEach(r => {
      r.tags?.forEach(tag => {
        tagDistribution[tag] = (tagDistribution[tag] || 0) + 1;
      });
    });
    
    res.json({
      total: records.length,
      moodDistribution,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      timeSlotDistribution,
      tagDistribution,
      records: records.slice(0, 10) // 最近10条
    });
  } catch (error) {
    res.status(500).json({ error: '获取统计失败' });
  }
});

// 获取趋势数据
router.get('/trends', auth, async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const records = await MoodRecord.find({
      userId: req.user._id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });
    
    // 按日期聚合
    const dailyData = {};
    records.forEach(r => {
      const date = r.createdAt.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { total: 0, intensitySum: 0, moods: {} };
      }
      dailyData[date].total += 1;
      dailyData[date].intensitySum += r.intensity;
      dailyData[date].moods[r.mood] = (dailyData[date].moods[r.mood] || 0) + 1;
    });
    
    const trends = Object.entries(dailyData).map(([date, data]) => ({
      date,
      avgIntensity: Math.round((data.intensitySum / data.total) * 10) / 10,
      count: data.total,
      dominantMood: Object.entries(data.moods).sort((a, b) => b[1] - a[1])[0]?.[0]
    }));
    
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: '获取趋势失败' });
  }
});

module.exports = router;
