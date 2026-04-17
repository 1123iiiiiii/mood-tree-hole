const express = require('express');
const auth = require('../middleware/auth');
const MoodRecord = require('../models/MoodRecord');

const router = express.Router();

// 获取所有心情记录（支持分页和筛选）
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate, mood } = req.query;
    
    const query = { userId: req.user._id };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (mood) {
      query.mood = mood;
    }

    const records = await MoodRecord.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await MoodRecord.countDocuments(query);

    res.json({
      records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: '获取记录失败' });
  }
});

// 获取单条记录
router.get('/:id', auth, async (req, res) => {
  try {
    const record = await MoodRecord.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!record) {
      return res.status(404).json({ error: '记录不存在' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: '获取记录失败' });
  }
});

// 创建心情记录
router.post('/', auth, async (req, res) => {
  try {
    const { mode, mood, intensity, event, mixedMoods, tags, analysis } = req.body;
    
    const record = new MoodRecord({
      userId: req.user._id,
      mode,
      mood,
      intensity,
      event,
      mixedMoods,
      tags,
      analysis
    });
    
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: '创建记录失败' });
  }
});

// 更新心情记录
router.put('/:id', auth, async (req, res) => {
  try {
    const record = await MoodRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    
    if (!record) {
      return res.status(404).json({ error: '记录不存在' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ error: '更新记录失败' });
  }
});

// 删除心情记录
router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await MoodRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!record) {
      return res.status(404).json({ error: '记录不存在' });
    }
    
    res.json({ message: '删除成功' });
  } catch (error) {
    res.status(500).json({ error: '删除记录失败' });
  }
});

module.exports = router;
