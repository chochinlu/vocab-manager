import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// 中介軟體
app.use(cors());
app.use(express.json());

// 健康檢查端點
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Vocab Manager API Server' });
});

/**
 * AI 拼字檢查
 * POST /api/ai/spell-check
 */
app.post('/api/ai/spell-check', async (req, res) => {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: '請提供單字' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: `分析這個英文單字: "${word}"

請判斷:
1. 這是否是正確的英文單字?
2. 如果是複數形式,單數是什麼?
3. 如果拼字可能有錯,提供正確的拼法建議
4. 如果是常見錯誤(如打錯、多字母、少字母),提供建議

回傳 JSON 格式(不要 markdown):
{
  "isCorrect": true/false,
  "isCorrectable": true/false,
  "message": "簡短說明",
  "suggestions": ["建議1", "建議2", "建議3"]
}

如果單字完全正確且不是複數,suggestions 為空陣列。
如果是複數形式,suggestions 應包含單數形式。`
        }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('AI 拼字檢查錯誤:', error);
    res.status(500).json({ error: '拼字檢查失敗' });
  }
});

/**
 * AI 修正例句
 * POST /api/ai/correct-example
 */
app.post('/api/ai/correct-example', async (req, res) => {
  const { word, partOfSpeech, example } = req.body;

  if (!word || !example) {
    return res.status(400).json({ error: '請提供單字和例句' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: `你是英文教學專家,專門幫華人改進中式英文。

目標單字/片語: ${word} (${partOfSpeech})
學生寫的例句: "${example}"

任務:
1. 修正中式英文，提供更自然的英文表達
2. 檢查修正後的句子是否包含目標單字/片語 "${word}"
3. 如果修正後的句子沒有包含目標單字/片語，請額外提供一個使用該單字的建議例句

回傳 JSON 格式:
{
  "corrected": "修正後的例句（如果完全正確就是原句）",
  "containsTarget": true/false,
  "suggestion": "如果修正後不包含目標單字，提供一個使用該單字的建議例句（否則為 null）"
}

重要:
- 只回傳 JSON，不要 markdown 格式標記
- 如果修正後的句子已包含目標單字，suggestion 必須是 null
- suggestion 應該是一個完整、自然的例句`
        }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('AI 修正例句錯誤:', error);
    res.status(500).json({ error: '例句修正失敗' });
  }
});

/**
 * Free Dictionary API
 * POST /api/dictionary/free
 */
app.post('/api/dictionary/free', async (req, res) => {
  const { word, partOfSpeech } = req.body;

  if (!word) {
    return res.status(400).json({ error: '請提供單字' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        tools: [{
          type: "web_fetch_20250305",
          name: "web_fetch"
        }],
        messages: [{
          role: 'user',
          content: `Fetch https://api.dictionaryapi.dev/api/v2/entries/en/${word} and extract data for ${partOfSpeech}. Include phonetic, definition, audioUrlUK, audioUrlUS (from phonetics array), and examples.`
        }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Free Dictionary API 錯誤:', error);
    res.status(500).json({ error: 'Free Dictionary 查詢失敗' });
  }
});

/**
 * Cambridge Dictionary API
 * POST /api/dictionary/cambridge
 */
app.post('/api/dictionary/cambridge', async (req, res) => {
  const { word, partOfSpeech, posLabel } = req.body;

  if (!word) {
    return res.status(400).json({ error: '請提供單字' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        tools: [
          {
            type: "web_search_20250305",
            name: "web_search"
          },
          {
            type: "web_fetch_20250305",
            name: "web_fetch"
          }
        ],
        messages: [{
          role: 'user',
          content: `請幫我從劍橋字典查詢單字 "${word}" 作為 ${partOfSpeech} (${posLabel}) 的資料。

步驟:
1. 先用 web_search 搜尋: cambridge dictionary ${word}
2. 找到劍橋字典的 URL 後,用 web_fetch 抓取完整內容
3. 從網頁中找出對應詞性 (${partOfSpeech}) 的資料

然後回傳 JSON 格式(不要 markdown):
{
  "phonetic": "音標 (如 /ˈɪm.plɪ.ment/)",
  "definition": "該詞性的英文定義",
  "examples": ["例句1 (用 **粗體** 標記片語動詞或固定搭配)", "例句2"]
}

重要:
- 只抓取 ${partOfSpeech} 詞性的資料,不要其他詞性
- examples 中的片語動詞或固定搭配用 **粗體** 標記
- 如果找不到該詞性,回傳 null
- 不需要音檔 URL,我們用 Web Speech API`
        }]
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Cambridge Dictionary API 錯誤:', error);
    res.status(500).json({ error: '劍橋字典查詢失敗' });
  }
});

/**
 * OpenRouter - 翻譯例句成繁體中文
 * POST /api/openrouter/translate
 */
app.post('/api/openrouter/translate', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: '請提供要翻譯的文字' });
  }

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'OpenRouter API Key 未設定' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Vocab Manager'
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-72b-instruct:free',
        messages: [{
          role: 'user',
          content: `請將以下英文翻譯成繁體中文（台灣用語）：

"${text}"

只需要回傳翻譯結果，不要其他說明。`
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenRouter API 錯誤:', data.error);
      return res.status(500).json({ error: data.error.message || '翻譯失敗' });
    }

    // 提取翻譯結果
    const translation = data.choices?.[0]?.message?.content || '';
    res.json({ translation });
  } catch (error) {
    console.error('OpenRouter 翻譯錯誤:', error);
    res.status(500).json({ error: '翻譯服務連線失敗' });
  }
});

/**
 * OpenRouter - 英文拼字檢查
 * POST /api/openrouter/spell-check
 */
app.post('/api/openrouter/spell-check', async (req, res) => {
  const { word } = req.body;

  if (!word) {
    return res.status(400).json({ error: '請提供單字' });
  }

  if (!OPENROUTER_API_KEY) {
    return res.status(500).json({ error: 'OpenRouter API Key 未設定' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Vocab Manager'
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-72b-instruct:free',
        messages: [{
          role: 'user',
          content: `分析這個英文單字: "${word}"

請判斷:
1. 這是否是正確的英文單字?
2. 如果是複數形式,單數是什麼?
3. 如果拼字可能有錯,提供正確的拼法建議
4. 如果是常見錯誤(如打錯、多字母、少字母),提供建議

回傳 JSON 格式:
{
  "isCorrect": true/false,
  "isCorrectable": true/false,
  "message": "簡短說明",
  "suggestions": ["建議1", "建議2", "建議3"]
}

如果單字完全正確且不是複數,suggestions 為空陣列。
如果是複數形式,suggestions 應包含單數形式。
請只回傳 JSON，不要其他說明。`
        }]
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenRouter API 錯誤:', data.error);
      return res.status(500).json({ error: data.error.message || '拼字檢查失敗' });
    }

    // 提取檢查結果
    const result = data.choices?.[0]?.message?.content || '';

    // 嘗試解析 JSON 回應
    try {
      const parsedResult = JSON.parse(result);
      res.json(parsedResult);
    } catch {
      // 如果無法解析，回傳原始文字
      res.json({
        isCorrect: false,
        isCorrectable: false,
        message: result,
        suggestions: []
      });
    }
  } catch (error) {
    console.error('OpenRouter 拼字檢查錯誤:', error);
    res.status(500).json({ error: '拼字檢查服務連線失敗' });
  }
});

/**
 * AI 練習批改
 * POST /api/ai/practice-feedback
 */
app.post('/api/ai/practice-feedback', async (req, res) => {
  const { word, partOfSpeech, sentence, model = 'haiku' } = req.body;

  if (!word || !sentence) {
    return res.status(400).json({ error: '請提供單字和例句' });
  }

  // Model mapping
  const modelMap = {
    'sonnet': 'claude-sonnet-4-20250514',
    'haiku': 'claude-3-5-haiku-20241022',
    'qwen': 'qwen/qwen-2.5-72b-instruct:free'
  };

  const selectedModel = modelMap[model] || modelMap['haiku'];
  const useOpenRouter = model === 'qwen';

  try {
    if (useOpenRouter) {
      // Use OpenRouter for Qwen
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Vocab Manager'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{
            role: 'user',
            content: `你是專業的英文教學老師，請批改學生的英文例句練習。

目標單字: ${word} (${partOfSpeech})
學生寫的例句: "${sentence}"

請提供詳細的批改回饋，包含：
1. 評分 (0-100)
2. 語法錯誤檢查
3. 用法建議
4. 改進版本
5. 整體評語
6. 熟練度評估

回傳 JSON 格式（不要 markdown 標記）:
{
  "score": 85,
  "isCorrect": true,
  "errors": [
    {
      "type": "grammar" | "usage" | "word-choice" | "spelling",
      "pattern": "錯誤類型簡述（如：missing article）",
      "original": "原始錯誤文字",
      "correction": "修正後文字",
      "explanation": "錯誤說明（繁體中文）"
    }
  ],
  "suggestions": [
    "建議1（繁體中文）",
    "建議2（繁體中文）"
  ],
  "improvedVersion": "改進後的完整例句",
  "overallComment": "整體評語（繁體中文，鼓勵性質）",
  "proficiencyAssessment": "beginner" | "intermediate" | "advanced" | "mastered"
}

重要：
- 如果句子完全正確，errors 為空陣列，isCorrect 為 true
- score 應該根據語法正確性、用法道地性、句子複雜度綜合評分
- proficiencyAssessment 根據學生的表現評估熟練度
- 所有中文說明使用繁體中文（台灣用語）
- 只回傳 JSON，不要其他說明`
          }]
        })
      });

      const data = await response.json();

      if (data.error) {
        console.error('OpenRouter API 錯誤:', data.error);
        return res.status(500).json({ error: data.error.message || '批改服務失敗' });
      }

      // Transform OpenRouter response to match Anthropic format
      const content = data.choices?.[0]?.message?.content || '';
      res.json({
        content: [{
          type: 'text',
          text: content
        }]
      });
    } else {
      // Use Anthropic for Sonnet/Haiku
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: selectedModel,
          max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `你是專業的英文教學老師，請批改學生的英文例句練習。

目標單字: ${word} (${partOfSpeech})
學生寫的例句: "${sentence}"

請提供詳細的批改回饋，包含：
1. 評分 (0-100)
2. 語法錯誤檢查
3. 用法建議
4. 改進版本
5. 整體評語
6. 熟練度評估

回傳 JSON 格式（不要 markdown 標記）:
{
  "score": 85,
  "isCorrect": true,
  "errors": [
    {
      "type": "grammar" | "usage" | "word-choice" | "spelling",
      "pattern": "錯誤類型簡述（如：missing article）",
      "original": "原始錯誤文字",
      "correction": "修正後文字",
      "explanation": "錯誤說明（繁體中文）"
    }
  ],
  "suggestions": [
    "建議1（繁體中文）",
    "建議2（繁體中文）"
  ],
  "improvedVersion": "改進後的完整例句",
  "overallComment": "整體評語（繁體中文，鼓勵性質）",
  "proficiencyAssessment": "beginner" | "intermediate" | "advanced" | "mastered"
}

重要：
- 如果句子完全正確，errors 為空陣列，isCorrect 為 true
- score 應該根據語法正確性、用法道地性、句子複雜度綜合評分
- proficiencyAssessment 根據學生的表現評估熟練度
- 所有中文說明使用繁體中文（台灣用語）
- 只回傳 JSON，不要其他說明`
        }]
        })
      });

      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error('AI 練習批改錯誤:', error);
    res.status(500).json({ error: '批改服務失敗' });
  }
});

/**
 * Unsplash 隨機背景圖片
 * GET /api/unsplash/random
 */
app.get('/api/unsplash/random', async (req, res) => {
  const { query, collections, orientation = 'landscape' } = req.query;

  if (!UNSPLASH_ACCESS_KEY) {
    return res.status(500).json({ error: 'Unsplash Access Key 未設定' });
  }

  try {
    // 建立查詢參數
    const params = new URLSearchParams({
      client_id: UNSPLASH_ACCESS_KEY,
      orientation
    });

    if (query) {
      params.append('query', query);
    }

    if (collections) {
      params.append('collections', collections);
    }

    const response = await fetch(`https://api.unsplash.com/photos/random?${params.toString()}`);
    const data = await response.json();

    if (response.status === 401) {
      console.error('Unsplash API 認證失敗');
      return res.status(401).json({ error: 'Unsplash API Key 無效' });
    }

    if (response.status === 403) {
      console.error('Unsplash API 超過請求限制');
      return res.status(403).json({ error: 'API 請求次數已達上限（每小時 50 次）' });
    }

    if (!response.ok) {
      console.error('Unsplash API 錯誤:', data);
      return res.status(response.status).json({ error: '獲取背景圖片失敗' });
    }

    // 回傳精簡的圖片資訊
    res.json({
      id: data.id,
      url: data.urls.regular,      // 1080p
      urlFull: data.urls.full,     // 原始尺寸
      urlRaw: data.urls.raw,       // 可自訂尺寸
      width: data.width,
      height: data.height,
      description: data.description || data.alt_description,
      author: {
        name: data.user.name,
        link: data.user.links.html
      },
      downloadLocation: data.links.download_location
    });
  } catch (error) {
    console.error('Unsplash API 連線錯誤:', error);
    res.status(500).json({ error: '背景圖片服務連線失敗' });
  }
});

// 啟動伺服器
app.listen(PORT, () => {
  console.log(`🚀 API Server 運行於 http://localhost:${PORT}`);
  console.log(`📚 健康檢查: http://localhost:${PORT}/health`);
});
