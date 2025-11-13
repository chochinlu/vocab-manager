import React, { useState, useEffect } from 'react';
import { Search, Plus, Book, Volume2, Tag, Calendar, Edit2, Check, X, Trash2, RefreshCw } from 'lucide-react';
import'./utils/storage';

const VocabManager = () => {
  const [vocabs, setVocabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVocab, setEditingVocab] = useState(null); // 正在編輯的單字
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPos, setFilterPos] = useState('all');
  const [filterTag, setFilterTag] = useState('all');
  const [filterDate, setFilterDate] = useState('week'); // 'today' | 'week' | 'month' | 'all'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'alphabetical'

  // 新增單字的表單狀態
  const [formData, setFormData] = useState({
    word: '',
    partOfSpeech: 'verb',
    definitionChinese: '',
    definitionEnglish: '',
    examplesOriginal: [''],
    myExample: '',
    aiCorrected: '',
    phonetic: '',
    audioUrl: '',
    audioUrlUK: '',
    audioUrlUS: '',
    context: { source: '', scenario: '', url: '' },
    tags: []
  });

  const [newTag, setNewTag] = useState('');
  const [isCorrectingExample, setIsCorrectingExample] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(null); // 'uk' | 'us' | null
  const [isCheckingSpelling, setIsCheckingSpelling] = useState(false);
  const [spellingSuggestions, setSpellingSuggestions] = useState([]);
  const [isFetchingFreeDictionary, setIsFetchingFreeDictionary] = useState(false);
  const [isFetchingCambridge, setIsFetchingCambridge] = useState(false);

  // 載入資料
  useEffect(() => {
    loadVocabs();
  }, []);

  const loadVocabs = async () => {
    try {
      setLoading(true);
      const result = await window.storage.list('vocab:');
      if (result && result.keys) {
        const vocabPromises = result.keys.map(async (key) => {
          const data = await window.storage.get(key);
          return data ? JSON.parse(data.value) : null;
        });
        const loadedVocabs = (await Promise.all(vocabPromises)).filter(Boolean);
        setVocabs(loadedVocabs.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate)));
      }
    } catch (error) {
      console.log('首次使用,尚無資料');
      setVocabs([]);
    } finally {
      setLoading(false);
    }
  };

  // 儲存單字
  const saveVocab = async () => {
    if (!formData.word.trim()) {
      alert('請輸入單字');
      return;
    }

    const vocab = {
      id: editingVocab ? editingVocab.id : `vocab:${formData.word}-${formData.partOfSpeech}-${Date.now()}`,
      word: formData.word.trim(),
      partOfSpeech: formData.partOfSpeech,
      addedDate: editingVocab ? editingVocab.addedDate : new Date().toISOString(),
      definitions: {
        chinese: formData.definitionChinese,
        english: formData.definitionEnglish
      },
      examples: {
        original: formData.examplesOriginal.filter(e => e.trim()),
        myOwn: formData.myExample,
        aiCorrected: formData.aiCorrected
      },
      pronunciation: {
        phonetic: formData.phonetic,
        audioUrl: formData.audioUrl,
        audioUrlUK: formData.audioUrlUK,
        audioUrlUS: formData.audioUrlUS
      },
      context: formData.context,
      tags: formData.tags,
      reviewHistory: editingVocab ? editingVocab.reviewHistory : []
    };

    try {
      await window.storage.set(vocab.id, JSON.stringify(vocab));
      
      if (editingVocab) {
        // 更新現有單字
        setVocabs(prev => prev.map(v => v.id === vocab.id ? vocab : v));
        alert('✅ 單字已更新!');
      } else {
        // 新增單字
        setVocabs(prev => [vocab, ...prev]);
        alert('✅ 單字已儲存!');
      }
      
      resetForm();
      setShowAddForm(false);
      setEditingVocab(null);
    } catch (error) {
      alert('儲存失敗: ' + error.message);
    }
  };

  // AI 修正例句
  const correctExample = async () => {
    if (!formData.myExample.trim()) {
      alert('請先輸入你的例句');
      return;
    }

    setIsCorrectingExample(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `你是英文教學專家,專門幫華人改進中式英文。

單字: ${formData.word} (${formData.partOfSpeech})
學生寫的例句: "${formData.myExample}"

請直接回傳修正後的例句,不要其他說明。如果句子完全正確,就回傳原句。`
          }]
        })
      });

      const data = await response.json();
      const corrected = data.content[0].text.trim();
      setFormData(prev => ({ ...prev, aiCorrected: corrected }));
    } catch (error) {
      alert('AI 修正失敗: ' + error.message);
    } finally {
      setIsCorrectingExample(false);
    }
  };

  // 檢查拼字和提供建議
  const checkSpelling = async () => {
    const word = formData.word.trim();
    if (!word) return;
    
    setIsCheckingSpelling(true);
    setSpellingSuggestions([]);
    
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      const textContent = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');
      
      let cleanJson = textContent.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      try {
        const result = JSON.parse(cleanJson);
        
        if (result.suggestions && result.suggestions.length > 0) {
          setSpellingSuggestions(result.suggestions);
        }
        
        // 顯示訊息
        if (result.isCorrect && result.suggestions.length === 0) {
          alert('✅ 拼字正確!');
        } else if (result.message) {
          // 不用 alert,讓建議直接顯示在下方
        }
      } catch (parseError) {
        console.error('Parse error:', parseError);
        alert('⚠️ 拼字檢查失敗,請稍後再試');
      }
    } catch (error) {
      alert('拼字檢查失敗: ' + error.message);
    } finally {
      setIsCheckingSpelling(false);
    }
  };

  // 使用建議的單字
  const useSuggestion = (suggestion) => {
    setFormData(prev => ({ ...prev, word: suggestion }));
    setSpellingSuggestions([]);
  };

  // 從 Free Dictionary API 抓取資料
  const fetchFreeDictionaryData = async () => {
    if (!formData.word.trim()) {
      alert('請先輸入單字或片語');
      return;
    }

    const word = formData.word.trim().toLowerCase();
    const pos = formData.partOfSpeech;
    
    // 檢查是否為片語
    const isPhrase = word.includes(' ');
    
    if (isPhrase) {
      alert('💡 Free Dictionary API 主要支援單字查詢\n\n片語建議使用「劍橋字典」按鈕,效果更好!');
      return;
    }
    
    setIsFetchingFreeDictionary(true);
    try {
      // 步驟1: 抓取 Free Dictionary API 資料
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 3000,
          tools: [
            {
              type: "web_fetch_20250305",
              name: "web_fetch"
            }
          ],
          messages: [{
            role: 'user',
            content: `Fetch https://api.dictionaryapi.dev/api/v2/entries/en/${word} and extract data for ${pos}. Include phonetic, definition, audioUrlUK, audioUrlUS (from phonetics array), and examples.`
          }]
        })
      });

      const data = await response.json();
      const rawText = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n')
        .trim();
      
      console.log('Step 1 - Raw Free Dictionary data:', rawText);
      
      // 步驟2: 用 AI 整理成純 JSON (包含音檔URL)
      const extractResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `Extract JSON from this Free Dictionary data for "${word}" (${pos}):

${rawText}

Return ONLY this JSON structure:
{"phonetic":"...","definition":"...","audioUrlUK":"...","audioUrlUS":"...","examples":["..."]}

Audio URLs should be from phonetics array containing '-uk' or '-us'. Return ONLY JSON or null.`
          }]
        })
      });

      const extractData = await extractResponse.json();
      let cleanText = extractData.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('')
        .trim();

      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      // 暴力提取 JSON
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
        const jsonStr = cleanText.substring(firstBrace, lastBrace + 1);
        const result = JSON.parse(jsonStr);
        
        console.log('Step 2 - Extracted JSON:', result);
        
        if (result && typeof result === 'object') {
          setFormData(prev => ({
            ...prev,
            phonetic: result.phonetic || prev.phonetic,
            definitionEnglish: result.definition || prev.definitionEnglish,
            audioUrlUK: result.audioUrlUK || prev.audioUrlUK,
            audioUrlUS: result.audioUrlUS || prev.audioUrlUS,
            examplesOriginal: result.examples && Array.isArray(result.examples) && result.examples.length > 0 
              ? result.examples 
              : prev.examplesOriginal
          }));
          alert('✅ 已從 Free Dictionary API 取得資料!');
        } else {
          alert(`❌ 找不到 "${word}" 的資料`);
        }
      } else if (cleanText.includes('null')) {
        alert(`❌ 找不到 "${word}" 的資料`);
      } else {
        throw new Error('無法提取 JSON');
      }
    } catch (error) {
      console.error('Free Dictionary fetch error:', error);
      alert('⚠️ 抓取失敗,請改用「劍橋字典」或手動輸入');
    } finally {
      setIsFetchingFreeDictionary(false);
    }
  };

  // 輔助函數: 將 AI 回應整理成純 JSON
  const extractPureJSON = async (rawText, word, pos) => {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `Given this text about "${word}" (${pos}), extract ONLY the JSON object.

Text:
${rawText}

Extract and return ONLY the JSON object with this structure:
{"phonetic":"...","definition":"...","examples":["..."]}

Return ONLY the JSON, nothing else. If no valid data, return: null`
          }]
        })
      });

      const data = await response.json();
      let cleanText = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('')
        .trim();

      // 移除 markdown
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      // 暴力提取 JSON
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');

      if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
        const jsonStr = cleanText.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonStr);
      }

      if (cleanText.includes('null')) {
        return null;
      }

      throw new Error('無法提取 JSON');
    } catch (error) {
      console.error('Extract JSON failed:', error);
      throw error;
    }
  };

  // 從劍橋字典抓取資料
  const fetchCambridgeData = async () => {
    if (!formData.word.trim()) {
      alert('請先輸入單字');
      return;
    }

    const word = formData.word.trim().toLowerCase();
    const pos = formData.partOfSpeech;
    
    setIsFetchingCambridge(true);
    try {
      const cambridgeUrl = `https://dictionary.cambridge.org/dictionary/english/${word}`;
      
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
            content: `請幫我從劍橋字典查詢單字 "${word}" 作為 ${pos} (${posOptions.find(p => p.value === pos)?.label}) 的資料。

步驟:
1. 先用 web_search 搜尋: cambridge dictionary ${word}
2. 找到劍橋字典的 URL 後,用 web_fetch 抓取完整內容
3. 從網頁中找出對應詞性 (${pos}) 的資料

然後回傳 JSON 格式(不要 markdown):
{
  "phonetic": "音標 (如 /ˈɪm.plɪ.ment/)",
  "definition": "該詞性的英文定義",
  "examples": ["例句1 (用 **粗體** 標記片語動詞或固定搭配)", "例句2"]
}

重要:
- 只抓取 ${pos} 詞性的資料,不要其他詞性
- examples 中的片語動詞或固定搭配用 **粗體** 標記
- 如果找不到該詞性,回傳 null
- 不需要音檔 URL,我們用 Web Speech API`
          }]
        })
      });

      const data = await response.json();
      const textContent = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');
      
      let cleanJson = textContent.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      try {
        const result = JSON.parse(cleanJson);
        
        if (result) {
          setFormData(prev => ({
            ...prev,
            phonetic: result.phonetic || prev.phonetic,
            definitionEnglish: result.definition || prev.definitionEnglish,
            examplesOriginal: result.examples && result.examples.length > 0 
              ? result.examples 
              : prev.examplesOriginal
          }));
          alert('✅ 已從劍橋字典取得資料!');
        } else {
          alert(`❌ 在劍橋字典找不到 "${word}" 作為 ${posOptions.find(p => p.value === pos)?.label} 的資料\n\n建議:\n1. 檢查單字拼寫\n2. 嘗試其他詞性\n3. 手動輸入資料`);
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Content:', cleanJson);
        alert('⚠️ 資料解析失敗。可能原因:\n1. 劍橋字典沒有這個單字\n2. 網路連線問題\n\n請手動輸入或稍後再試');
      }
    } catch (error) {
      alert('抓取失敗: ' + error.message);
    } finally {
      setIsFetchingCambridge(false);
    }
  };

  // 渲染例句 (支援粗體標記)
  const renderExample = (text) => {
    if (!text) return null;
    
    // 將 **text** 轉換成粗體
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // 移除 ** 並顯示為粗體
        const boldText = part.slice(2, -2);
        return <strong key={index} className="text-indigo-700 font-bold">{boldText}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  // 開啟劍橋字典
  const openCambridgeDictionary = () => {
    if (!formData.word.trim()) {
      alert('請先輸入單字');
      return;
    }
    const word = formData.word.trim().toLowerCase().replace(/\s+/g, '-');
    const url = `https://dictionary.cambridge.org/dictionary/english/${word}`;
    window.open(url, '_blank');
  };

  // 使用 Web Speech API 播放發音
  const playPronunciation = (text, accent, isSentence = false) => {
    if (!text) return;
    
    // 檢查瀏覽器支援
    if (!('speechSynthesis' in window)) {
      alert('您的瀏覽器不支援語音合成功能');
      return;
    }

    // 停止當前播放
    window.speechSynthesis.cancel();
    
    setIsPlayingAudio(accent);
    
    const utterance = new SpeechSynthesisUtterance(text);
    // 句子用正常速度,單字稍微慢一點
    utterance.rate = isSentence ? 0.9 : 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // 設定語言
    if (accent === 'uk') {
      utterance.lang = 'en-GB'; // 英式英文
    } else {
      utterance.lang = 'en-US'; // 美式英文
    }
    
    // 播放結束後重置狀態
    utterance.onend = () => {
      setIsPlayingAudio(null);
    };
    
    utterance.onerror = () => {
      setIsPlayingAudio(null);
      alert('播放失敗,請確認瀏覽器支援該語言');
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // 刪除單字
  const deleteVocab = async (id) => {
    if (!confirm('確定要刪除這個單字嗎?')) return;
    
    try {
      await window.storage.delete(id);
      setVocabs(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      alert('刪除失敗: ' + error.message);
    }
  };

  // 開始編輯單字
  const startEditVocab = (vocab) => {
    setEditingVocab(vocab);
    setFormData({
      word: vocab.word,
      partOfSpeech: vocab.partOfSpeech,
      definitionChinese: vocab.definitions.chinese,
      definitionEnglish: vocab.definitions.english,
      examplesOriginal: vocab.examples.original.length > 0 ? vocab.examples.original : [''],
      myExample: vocab.examples.myOwn,
      aiCorrected: vocab.examples.aiCorrected,
      phonetic: vocab.pronunciation.phonetic,
      audioUrl: vocab.pronunciation.audioUrl || '',
      audioUrlUK: vocab.pronunciation.audioUrlUK || '',
      audioUrlUS: vocab.pronunciation.audioUrlUS || '',
      context: vocab.context,
      tags: vocab.tags
    });
    setShowAddForm(true);
    // 滾動到表單頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 重置表單
  const resetForm = () => {
    setFormData({
      word: '',
      partOfSpeech: 'verb',
      definitionChinese: '',
      definitionEnglish: '',
      examplesOriginal: [''],
      myExample: '',
      aiCorrected: '',
      phonetic: '',
      audioUrl: '',
      audioUrlUK: '',
      audioUrlUS: '',
      context: { source: '', scenario: '', url: '' },
      tags: []
    });
    setEditingVocab(null);
  };

  // 添加標籤
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  // 移除標籤
  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // 獲取所有標籤
  const allTags = [...new Set(vocabs.flatMap(v => v.tags))];

  // 篩選單字
  const filteredVocabs = vocabs.filter(v => {
    const matchSearch = v.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       v.definitions.chinese.includes(searchTerm) ||
                       v.definitions.english.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPos = filterPos === 'all' || v.partOfSpeech === filterPos;
    const matchTag = filterTag === 'all' || v.tags.includes(filterTag);
    
    // 日期篩選
    let matchDate = true;
    if (filterDate !== 'all') {
      const vocabDate = new Date(v.addedDate);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      if (filterDate === 'today') {
        matchDate = vocabDate >= today;
      } else if (filterDate === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        matchDate = vocabDate >= weekAgo;
      } else if (filterDate === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        matchDate = vocabDate >= monthAgo;
      }
    }
    
    return matchSearch && matchPos && matchTag && matchDate;
  });

  // 排序
  const sortedVocabs = [...filteredVocabs].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.addedDate) - new Date(a.addedDate);
    } else if (sortBy === 'oldest') {
      return new Date(a.addedDate) - new Date(b.addedDate);
    } else if (sortBy === 'alphabetical') {
      return a.word.localeCompare(b.word);
    }
    return 0;
  });

  // 統計資訊
  const stats = {
    total: vocabs.length,
    today: vocabs.filter(v => {
      const vocabDate = new Date(v.addedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return vocabDate >= today;
    }).length,
    week: vocabs.filter(v => {
      const vocabDate = new Date(v.addedDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return vocabDate >= weekAgo;
    }).length,
    month: vocabs.filter(v => {
      const vocabDate = new Date(v.addedDate);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return vocabDate >= monthAgo;
    }).length
  };

  const posOptions = [
    { value: 'verb', label: '動詞 (v.)' },
    { value: 'noun', label: '名詞 (n.)' },
    { value: 'adjective', label: '形容詞 (adj.)' },
    { value: 'adverb', label: '副詞 (adv.)' },
    { value: 'phrasal-verb', label: '片語動詞 (phr. v.)' },
    { value: 'phrase', label: '片語/慣用語' },
    { value: 'other', label: '其他' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Book className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-800">技術英文詞彙庫</h1>
            </div>
            <button
              onClick={() => {
                if (showAddForm) {
                  setShowAddForm(false);
                  resetForm();
                } else {
                  setShowAddForm(true);
                }
              }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Plus className="w-5 h-5" />
              新增單字
            </button>
          </div>

          {/* 搜尋與篩選 */}
          <div className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜尋單字、中英文定義..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterPos}
                onChange={(e) => setFilterPos(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">所有詞性</option>
                {posOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">所有標籤</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">最新優先</option>
                <option value="oldest">最舊優先</option>
                <option value="alphabetical">字母順序</option>
              </select>
            </div>

            {/* 日期快速篩選 */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">顯示:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterDate('today')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterDate === 'today'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  今天 ({stats.today})
                </button>
                <button
                  onClick={() => setFilterDate('week')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterDate === 'week'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  本週 ({stats.week})
                </button>
                <button
                  onClick={() => setFilterDate('month')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterDate === 'month'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  本月 ({stats.month})
                </button>
                <button
                  onClick={() => setFilterDate('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    filterDate === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  全部 ({stats.total})
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              顯示 {sortedVocabs.length} 個單字
            </div>
          </div>
        </div>

        {/* 新增表單 */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {editingVocab ? '✏️ 編輯單字' : '➕ 新增單字'}
            </h2>
            
            <div className="space-y-4">
              {/* 單字與詞性 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">單字或片語 *</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.word}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, word: e.target.value }));
                        setSpellingSuggestions([]); // 清除舊建議
                      }}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="例如: implement 或 look after"
                    />
                    <button
                      onClick={checkSpelling}
                      disabled={isCheckingSpelling || !formData.word.trim()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 flex items-center gap-2"
                      title="檢查拼字"
                    >
                      {isCheckingSpelling ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>✓</span>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">💡 可以輸入單字或片語(如 give up、engage with)</p>
                  
                  {/* 拼字建議 */}
                  {spellingSuggestions.length > 0 && (
                    <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-yellow-800 mb-2">💡 建議:</p>
                      <div className="flex flex-wrap gap-2">
                        {spellingSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => useSuggestion(suggestion)}
                            className="px-3 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-900 rounded text-sm transition"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setSpellingSuggestions([])}
                        className="mt-2 text-xs text-yellow-700 hover:text-yellow-900 underline"
                      >
                        忽略建議
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">詞性 *</label>
                  <select
                    value={formData.partOfSpeech}
                    onChange={(e) => setFormData(prev => ({ ...prev, partOfSpeech: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    {posOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 劍橋字典連結 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">📖 查詢劍橋字典</p>
                    <p className="text-xs text-blue-600">在新分頁開啟劍橋字典,查看完整資訊</p>
                  </div>
                  <button
                    onClick={openCambridgeDictionary}
                    disabled={!formData.word.trim()}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                  >
                    <Book className="w-4 h-4" />
                    開啟劍橋字典
                  </button>
                </div>
              </div>

              {/* 定義 */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">中文解釋</label>
                  <input
                    type="text"
                    value={formData.definitionChinese}
                    onChange={(e) => setFormData(prev => ({ ...prev, definitionChinese: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="例如: 實作、執行"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">英文解釋</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.definitionEnglish}
                      onChange={(e) => setFormData(prev => ({ ...prev, definitionEnglish: e.target.value }))}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="例如: to put into operation"
                    />
                    {formData.definitionEnglish && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => playPronunciation(formData.definitionEnglish, 'uk', true)}
                          className="px-2 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                          title="播放英式發音"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => playPronunciation(formData.definitionEnglish, 'us', true)}
                          className="px-2 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                          title="播放美式發音"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 發音 */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">音標</label>
                  <input
                    type="text"
                    value={formData.phonetic}
                    onChange={(e) => setFormData(prev => ({ ...prev, phonetic: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="例如: /ˈɪm.plɪ.ment/"
                  />
                </div>
                
                {/* 語音播放按鈕 */}
                {formData.word && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-800 mb-3">🔊 試聽發音</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => playPronunciation(formData.word, 'uk')}
                        disabled={isPlayingAudio === 'uk'}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                      >
                        <Volume2 className={`w-4 h-4 ${isPlayingAudio === 'uk' ? 'animate-pulse' : ''}`} />
                        <span className="text-sm">🇬🇧 英式發音</span>
                      </button>
                      <button
                        onClick={() => playPronunciation(formData.word, 'us')}
                        disabled={isPlayingAudio === 'us'}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                      >
                        <Volume2 className={`w-4 h-4 ${isPlayingAudio === 'us' ? 'animate-pulse' : ''}`} />
                        <span className="text-sm">🇺🇸 美式發音</span>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">🇬🇧 英式發音 URL (選填)</label>
                    <input
                      type="text"
                      value={formData.audioUrlUK}
                      onChange={(e) => setFormData(prev => ({ ...prev, audioUrlUK: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="可手動貼劍橋字典URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">🇺🇸 美式發音 URL (選填)</label>
                    <input
                      type="text"
                      value={formData.audioUrlUS}
                      onChange={(e) => setFormData(prev => ({ ...prev, audioUrlUS: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="可手動貼劍橋字典URL"
                    />
                  </div>
                </div>
              </div>

              {/* 原始例句 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">原始例句 (從文件/書籍看到的)</label>
                <p className="text-xs text-gray-500 mb-2">💡 提示: 可以用 **粗體** 標記重點片語,例如: They **collaborated on** a project</p>
                {formData.examplesOriginal.map((example, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={example}
                      onChange={(e) => {
                        const newExamples = [...formData.examplesOriginal];
                        newExamples[index] = e.target.value;
                        setFormData(prev => ({ ...prev, examplesOriginal: newExamples }));
                      }}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="例如: This method is **deprecated** in v3.0"
                    />
                    {index === formData.examplesOriginal.length - 1 && (
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, examplesOriginal: [...prev.examplesOriginal, ''] }))}
                        className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 我的例句 + AI 修正 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">我的例句</label>
                <div className="space-y-2">
                  <textarea
                    value={formData.myExample}
                    onChange={(e) => setFormData(prev => ({ ...prev, myExample: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows="2"
                    placeholder="寫你自己的例句..."
                  />
                  <button
                    onClick={correctExample}
                    disabled={isCorrectingExample}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    {isCorrectingExample ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        AI 修正中...
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4" />
                        AI 修正
                      </>
                    )}
                  </button>
                  {formData.aiCorrected && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-800 mb-1">AI 修正結果:</p>
                      <p className="text-green-900">{formData.aiCorrected}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 情境 */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">來源</label>
                  <input
                    type="text"
                    value={formData.context.source}
                    onChange={(e) => setFormData(prev => ({ ...prev, context: { ...prev.context, source: e.target.value } }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="例如: React官方文件"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">情境</label>
                  <input
                    type="text"
                    value={formData.context.scenario}
                    onChange={(e) => setFormData(prev => ({ ...prev, context: { ...prev.context, scenario: e.target.value } }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="例如: 讀API文件時遇到"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                  <input
                    type="text"
                    value={formData.context.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, context: { ...prev.context, url: e.target.value } }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* 標籤 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">標籤</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="例如: frontend, react, api"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    新增
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                      <Tag className="w-3 h-3" />
                      {tag}
                      <button onClick={() => removeTag(tag)} className="ml-1 hover:text-indigo-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* 按鈕 */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveVocab}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  <Check className="w-5 h-5" />
                  {editingVocab ? '更新' : '儲存'}
                </button>
                <button
                  onClick={() => { resetForm(); setShowAddForm(false); }}
                  className="flex items-center gap-2 bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  <X className="w-5 h-5" />
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 單字列表 */}
        <div className="space-y-4">
          {sortedVocabs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              {vocabs.length === 0 ? '還沒有單字,點擊上方「新增單字」開始建立你的詞彙庫!' : '找不到符合條件的單字'}
            </div>
          ) : (
            sortedVocabs.map(vocab => (
              <div key={vocab.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">{vocab.word}</h3>
                      <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                        {posOptions.find(p => p.value === vocab.partOfSpeech)?.label}
                      </span>
                      <div className="flex gap-2">
                        {/* Web Speech API 發音按鈕 */}
                        <button
                          onClick={() => playPronunciation(vocab.word, 'uk')}
                          className="text-green-600 hover:text-green-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-green-50"
                          title="播放英式發音"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span className="text-xs">🇬🇧</span>
                        </button>
                        <button
                          onClick={() => playPronunciation(vocab.word, 'us')}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50"
                          title="播放美式發音"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span className="text-xs">🇺🇸</span>
                        </button>
                        
                        {/* 劍橋字典URL連結(如果有的話) */}
                        {vocab.pronunciation.audioUrlUK && (
                          <a
                            href={vocab.pronunciation.audioUrlUK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50"
                            title="劍橋字典英式發音"
                          >
                            <Book className="w-3 h-3" />
                            <span className="text-xs">🇬🇧</span>
                          </a>
                        )}
                        {vocab.pronunciation.audioUrlUS && (
                          <a
                            href={vocab.pronunciation.audioUrlUS}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-50"
                            title="劍橋字典美式發音"
                          >
                            <Book className="w-3 h-3" />
                            <span className="text-xs">🇺🇸</span>
                          </a>
                        )}
                      </div>
                    </div>
                    {vocab.pronunciation.phonetic && (
                      <p className="text-gray-600 text-sm mb-2">{vocab.pronunciation.phonetic}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditVocab(vocab)}
                      className="text-indigo-600 hover:text-indigo-800 p-2 rounded hover:bg-indigo-50"
                      title="編輯"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteVocab(vocab.id)}
                      className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
                      title="刪除"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {vocab.definitions.chinese && (
                    <div>
                      <span className="font-medium text-gray-700">中文: </span>
                      <span className="text-gray-600">{vocab.definitions.chinese}</span>
                    </div>
                  )}
                  {vocab.definitions.english && (
                    <div className="flex items-start gap-2 group">
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">English: </span>
                        <span className="text-gray-600">{vocab.definitions.english}</span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => playPronunciation(vocab.definitions.english, 'uk', true)}
                          className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                          title="英式發音"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => playPronunciation(vocab.definitions.english, 'us', true)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                          title="美式發音"
                        >
                          <Volume2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  {vocab.examples.original.length > 0 && (
                    <div>
                      <p className="font-medium text-gray-700 mb-2">原始例句:</p>
                      <ul className="space-y-2">
                        {vocab.examples.original.map((ex, i) => (
                          <li key={i} className="flex items-start gap-2 group">
                            <div className="flex gap-1 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => playPronunciation(ex.replace(/\*\*/g, ''), 'uk', true)}
                                className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                                title="英式發音"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => playPronunciation(ex.replace(/\*\*/g, ''), 'us', true)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                title="美式發音"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-gray-600 text-sm flex-1">{renderExample(ex)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {vocab.examples.myOwn && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="font-medium text-blue-800 text-sm mb-1">我的例句:</p>
                      <div className="flex items-start gap-2 group">
                        <div className="flex gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => playPronunciation(vocab.examples.myOwn, 'uk', true)}
                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                            title="英式發音"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => playPronunciation(vocab.examples.myOwn, 'us', true)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                            title="美式發音"
                          >
                            <Volume2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-blue-900 text-sm flex-1">{vocab.examples.myOwn}</p>
                      </div>
                      {vocab.examples.aiCorrected && (
                        <div className="mt-2 pt-2 border-t border-blue-200">
                          <p className="font-medium text-green-800 text-sm mb-1">AI 修正:</p>
                          <div className="flex items-start gap-2 group">
                            <div className="flex gap-1 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => playPronunciation(vocab.examples.aiCorrected, 'uk', true)}
                                className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                                title="英式發音"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => playPronunciation(vocab.examples.aiCorrected, 'us', true)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                                title="美式發音"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-green-900 text-sm flex-1">{vocab.examples.aiCorrected}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {(vocab.context.source || vocab.context.scenario) && (
                    <div className="text-sm text-gray-500">
                      {vocab.context.source && <span>📚 {vocab.context.source}</span>}
                      {vocab.context.source && vocab.context.scenario && <span> | </span>}
                      {vocab.context.scenario && <span>💡 {vocab.context.scenario}</span>}
                    </div>
                  )}

                  {vocab.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {vocab.tags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-400 pt-2">
                    <Calendar className="w-3 h-3" />
                    {new Date(vocab.addedDate).toLocaleDateString('zh-TW')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabManager;