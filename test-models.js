/**
 * 測試不同 AI 模型的批改表現
 * 使用同一個例句測試三個模型：Sonnet 4, Haiku, Qwen 2.5 72B
 */

import dotenv from 'dotenv';
dotenv.config();

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// 測試用例句（故意包含一些錯誤）
const TEST_CASES = [
  {
    word: 'implement',
    partOfSpeech: 'verb',
    sentence: 'Our team is implement new feature for improve user experience.',
    description: '包含多個文法錯誤（時態、冠詞、介系詞）'
  },
  {
    word: 'efficient',
    partOfSpeech: 'adjective',
    sentence: 'This algorithm is more efficient than previous one.',
    description: '缺少冠詞'
  },
  {
    word: 'collaborate',
    partOfSpeech: 'verb',
    sentence: 'We collaborate with other team to develop this project.',
    description: '單複數錯誤'
  }
];

const PROMPT_TEMPLATE = (word, partOfSpeech, sentence) => `你是專業的英文教學老師，請批改學生的英文例句練習。

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
- 只回傳 JSON，不要其他說明`;

/**
 * 測試 Claude Sonnet 4
 */
async function testSonnet4(word, partOfSpeech, sentence) {
  console.log('\n🔵 測試 Claude Sonnet 4...');
  const startTime = Date.now();

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
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: PROMPT_TEMPLATE(word, partOfSpeech, sentence)
        }]
      })
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    if (data.content && data.content[0]) {
      const result = JSON.parse(data.content[0].text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, ''));
      return {
        model: 'Claude Sonnet 4',
        duration,
        result,
        usage: data.usage
      };
    }
  } catch (error) {
    return {
      model: 'Claude Sonnet 4',
      duration: Date.now() - startTime,
      error: error.message
    };
  }
}

/**
 * 測試 Claude Haiku
 */
async function testHaiku(word, partOfSpeech, sentence) {
  console.log('\n🟢 測試 Claude Haiku...');
  const startTime = Date.now();

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: PROMPT_TEMPLATE(word, partOfSpeech, sentence)
        }]
      })
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    if (data.content && data.content[0]) {
      const result = JSON.parse(data.content[0].text.trim().replace(/```json\n?/g, '').replace(/```\n?/g, ''));
      return {
        model: 'Claude Haiku',
        duration,
        result,
        usage: data.usage
      };
    }
  } catch (error) {
    return {
      model: 'Claude Haiku',
      duration: Date.now() - startTime,
      error: error.message
    };
  }
}

/**
 * 測試 Qwen 2.5 72B (OpenRouter)
 */
async function testQwen(word, partOfSpeech, sentence) {
  console.log('\n🟡 測試 Qwen 2.5 72B (OpenRouter)...');
  const startTime = Date.now();

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Vocab Manager Test'
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-72b-instruct:free',
        messages: [{
          role: 'user',
          content: PROMPT_TEMPLATE(word, partOfSpeech, sentence)
        }]
      })
    });

    const data = await response.json();
    const duration = Date.now() - startTime;

    if (data.choices && data.choices[0]) {
      const content = data.choices[0].message.content.trim();
      const cleanJson = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const result = JSON.parse(cleanJson);
      return {
        model: 'Qwen 2.5 72B',
        duration,
        result,
        usage: data.usage
      };
    }
  } catch (error) {
    return {
      model: 'Qwen 2.5 72B',
      duration: Date.now() - startTime,
      error: error.message
    };
  }
}

/**
 * 顯示測試結果
 */
function displayResults(testCase, results) {
  console.log('\n' + '='.repeat(80));
  console.log(`📝 測試案例：${testCase.description}`);
  console.log(`   單字：${testCase.word} (${testCase.partOfSpeech})`);
  console.log(`   句子：${testCase.sentence}`);
  console.log('='.repeat(80));

  results.forEach(result => {
    console.log(`\n【${result.model}】 (${result.duration}ms)`);

    if (result.error) {
      console.log(`❌ 錯誤：${result.error}`);
      return;
    }

    console.log(`📊 評分：${result.result.score}/100`);
    console.log(`✅ 是否正確：${result.result.isCorrect ? '是' : '否'}`);
    console.log(`🎓 熟練度：${result.result.proficiencyAssessment}`);

    if (result.result.errors && result.result.errors.length > 0) {
      console.log(`\n⚠️  錯誤 (${result.result.errors.length}個)：`);
      result.result.errors.forEach((err, i) => {
        console.log(`   ${i + 1}. [${err.type}] ${err.pattern}`);
        console.log(`      原句：${err.original}`);
        console.log(`      修正：${err.correction}`);
        console.log(`      說明：${err.explanation}`);
      });
    }

    if (result.result.suggestions && result.result.suggestions.length > 0) {
      console.log(`\n💡 建議 (${result.result.suggestions.length}個)：`);
      result.result.suggestions.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s}`);
      });
    }

    console.log(`\n✨ 改進版本：${result.result.improvedVersion}`);
    console.log(`💬 評語：${result.result.overallComment}`);

    if (result.usage) {
      console.log(`\n📈 Token 使用：`);
      console.log(`   輸入：${result.usage.input_tokens || 'N/A'}`);
      console.log(`   輸出：${result.usage.output_tokens || 'N/A'}`);
    }
  });
}

/**
 * 主測試函數
 */
async function runTests() {
  console.log('\n🚀 開始測試不同 AI 模型的批改表現...\n');

  for (const testCase of TEST_CASES) {
    const results = await Promise.all([
      testSonnet4(testCase.word, testCase.partOfSpeech, testCase.sentence),
      testHaiku(testCase.word, testCase.partOfSpeech, testCase.sentence),
      testQwen(testCase.word, testCase.partOfSpeech, testCase.sentence)
    ]);

    displayResults(testCase, results);

    // 等待一下避免 rate limit
    if (testCase !== TEST_CASES[TEST_CASES.length - 1]) {
      console.log('\n⏳ 等待 2 秒...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n\n✅ 測試完成！');
}

// 執行測試
runTests().catch(console.error);
