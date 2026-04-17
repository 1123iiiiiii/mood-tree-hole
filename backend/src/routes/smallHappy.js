const express = require('express');
const auth = require('../middleware/auth');
const SmallHappy = require('../models/SmallHappy');

const router = express.Router();

// 预设小确幸模板
const PRESET_HAPPY = [
  { title: '喝一杯热茶', category: 'relax', frequency: 'daily' },
  { title: '散步30分钟', category: 'exercise', frequency: 'daily' },
  { title: '阅读15分钟', category: 'grow', frequency: 'daily' },
  { title: '给朋友发个消息', category: 'social', frequency: 'weekly' },
  { title: '整理房间', category: 'organize', frequency: 'weekly' },
  { title: '听一首喜欢的音乐', category: 'sense', frequency: 'daily' },
  { title: '做一次深呼吸', category: 'relax', frequency: 'daily' },
  { title: '吃一份水果', category: 'health', frequency: 'daily' }
];

// 获取所有小确幸
router.get('/', auth, async (req, res) => {
  try {
    const items = await SmallHappy.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: '获取失败' });
  }
});

// 获取推荐（基于用户偏好和心情）
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { currentMood } = req.query;
    
    // 获取用户已完成的小确幸
    const completed = await SmallHappy.find({
      userId: req.user._id,
      'completions.0': { $exists: true }
    });
    
    // 获取用户偏好的分类
    const categoryCount = {};
    completed.forEach(item => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + item.completions.length;
    });
    
    // 推荐未完成的小确幸
    const recommendations = await SmallHappy.find({
      userId: req.user._id,
      _id: { $nin: completed.map(c => c._id) }
    }).limit(5);
    
    // 如果推荐不足，添加预设
    if (recommendations.length < 3) {
      const presetTitles = completed.map(c => c.title);
      const presetsToAdd = PRESET_HAPPY
        .filter(p => !presetTitles.includes(p.title))
        .slice(0, 3 - recommendations.length);
      
      presetsToAdd.forEach(preset => {
        recommendations.push({ ...preset, isCustom: false, _id: `preset_${preset.title}` });
      });
    }
    
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: '获取推荐失败' });
  }
});

// 创建小确幸
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, frequency } = req.body;
    
    const item = new SmallHappy({
      userId: req.user._id,
      title,
      category,
      frequency,
      isCustom: true
    });
    
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: '创建失败' });
  }
});

// 完成小确幸
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const { moodBefore, moodAfter, intensityBefore, intensityAfter } = req.body;
    
    const item = await SmallHappy.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!item) {
      return res.status(404).json({ error: '不存在' });
    }
    
    item.completions.push({
      moodBefore,
      moodAfter,
      intensityBefore,
      intensityAfter
    });
    
    item.lastCompletedAt = Date.now();
    item.streak += 1;
    
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: '完成失败' });
  }
});

// 删除小确幸
router.delete('/:id', auth, async (req, res) => {
  try {
    const item = await SmallHappy.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!item) {
      return res.status(404).json({ error: '不存在' });
    }
    
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除失败' });
  }
});

module.exports = router;
