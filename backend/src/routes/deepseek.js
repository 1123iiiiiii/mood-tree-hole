const express = require('express');
const axios = require('axios');
const router = express.Router();

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

const SYSTEM_PROMPT = `你是一个温暖的心理咨询师。请分析用户的心情随笔，返回JSON格式：

{
  "emotion": "当前主导情绪（2-4字，必须是：开心/快乐/平静/焦虑/悲伤/愤怒/恐惧/惊讶之一）",
  "reason": "情绪原因（10字内）",
  "insight": "简短理解（20字内）",
  "action": "建议行动（15字内）",
  "emotionIntensity": 1-10的整数强度值
}`;

router.post('/ai-analyze', async (req, res) => {
  try {
    const { event, mood: initialMood } = req.body;

    if (!event || event.length < 10) {
      return res.status(400).json({ error: '请输入至少10个字的心情随笔' });
    }

    const useOllama = !process.env.GROQ_API_KEY && !process.env.DEEPSEEK_API_KEY;

    if (useOllama) {
      try {
        const response = await axios.post(
          `${OLLAMA_API_URL}/api/chat`,
          {
            model: OLLAMA_MODEL,
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: `用户的心情随笔：${event}\n\n初始选择的心情类型：${initialMood || '未选择'}` }
            ],
            stream: false
          },
          {
            timeout: 120000
          }
        );

        const aiContent = response.data.message?.content;

        if (!aiContent) {
          return res.status(500).json({ error: 'AI分析失败，未获取到有效回复' });
        }

        let analysis;
        try {
          const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('无法解析AI返回的分析结果');
          }
        } catch (parseError) {
          console.error('解析AI返回结果失败:', parseError);
          return res.status(500).json({
            error: '分析结果解析失败',
            fallback: true
          });
        }

        return res.json({
          success: true,
          analysis,
          provider: 'ollama'
        });
      } catch (ollamaError) {
        console.error('Ollama连接失败:', ollamaError.code);
        if (ollamaError.code === 'ECONNREFUSED') {
          return res.status(503).json({
            error: '本地AI未运行',
            fallback: true,
            setupRequired: true,
            message: '请先安装并启动Ollama',
            setupGuide: '1. 下载 Ollama: https://ollama.com/download\n2. 安装后运行: ollama run llama3.2\n3. 等待显示 "success" 后重试'
          });
        }
        throw ollamaError;
      }
    }

    const apiKey = process.env.GROQ_API_KEY || process.env.DEEPSEEK_API_KEY;
    const isGroq = apiKey.startsWith('gsk_');
    const apiUrl = isGroq ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.deepseek.com/chat/completions';
    const model = isGroq ? 'llama-3.1-8b-instant' : 'deepseek-chat';

    const response = await axios.post(
      apiUrl,
      {
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `用户的心情随笔：${event}\n\n初始选择的心情类型：${initialMood || '未选择'}` }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        timeout: 30000
      }
    );

    const aiContent = response.data.choices[0]?.message?.content;

    if (!aiContent) {
      return res.status(500).json({ error: 'AI分析失败，未获取到有效回复' });
    }

    let analysis;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析AI返回的分析结果');
      }
    } catch (parseError) {
      console.error('解析AI返回结果失败:', parseError);
      return res.status(500).json({
        error: '分析结果解析失败',
        fallback: true
      });
    }

    res.json({
      success: true,
      analysis,
      provider: isGroq ? 'groq' : 'deepseek'
    });

  } catch (error) {
    console.error('AI API错误:', error.response?.data || error.message);

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({ error: 'AI分析超时，请重试' });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'AI API密钥无效' });
    }

    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'AI分析请求过于频繁，请稍后再试' });
    }

    res.status(500).json({
      error: 'AI分析服务暂时不可用',
      fallback: true
    });
  }
});

router.get('/status', async (req, res) => {
  const hasOllama = !process.env.GROQ_API_KEY && !process.env.DEEPSEEK_API_KEY;

  if (hasOllama) {
    try {
      await axios.get(`${OLLAMA_API_URL}/api/tags`, { timeout: 5000 });
      res.json({ status: 'ready', provider: 'ollama', model: OLLAMA_MODEL });
    } catch (error) {
      res.json({ status: 'not_running', provider: 'ollama', model: OLLAMA_MODEL });
    }
  } else {
    res.json({ status: 'ready', provider: 'api' });
  }
});

module.exports = router;
