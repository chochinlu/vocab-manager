/**
 * 診斷工具：檢查單字資料結構
 * 在瀏覽器 console 執行：node debug-vocab-data.js
 * 或在瀏覽器中直接執行以下程式碼
 */

// 在瀏覽器 Console 中執行：
console.log('='.repeat(60));
console.log('單字資料診斷工具');
console.log('='.repeat(60));

// 取得所有單字
const allVocabs = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key.startsWith('vocab:')) {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      allVocabs.push(data);
    } catch (e) {
      console.error(`解析錯誤 ${key}:`, e);
    }
  }
}

console.log(`\n找到 ${allVocabs.length} 個單字\n`);

// 檢查每個單字的定義結構
allVocabs.forEach((vocab, index) => {
  console.log(`\n【單字 ${index + 1}】${vocab.word}`);
  console.log('資料結構：', {
    'definitions.chinese': vocab.definitions?.chinese || '❌ 無',
    'definitions.english': vocab.definitions?.english || '❌ 無',
    'pronunciation.phonetic': vocab.pronunciation?.phonetic || '❌ 無'
  });

  // 顯示完整的 definitions 物件
  console.log('完整 definitions 物件：', vocab.definitions);
});

// 統計
const withEnglishDef = allVocabs.filter(v => v.definitions?.english).length;
const withChineseDef = allVocabs.filter(v => v.definitions?.chinese).length;

console.log('\n' + '='.repeat(60));
console.log('統計資訊：');
console.log(`- 有中文定義：${withChineseDef}/${allVocabs.length} (${(withChineseDef/allVocabs.length*100).toFixed(1)}%)`);
console.log(`- 有英文定義：${withEnglishDef}/${allVocabs.length} (${(withEnglishDef/allVocabs.length*100).toFixed(1)}%)`);
console.log('='.repeat(60));

// 找出沒有英文定義的單字
const noEnglishDef = allVocabs.filter(v => !v.definitions?.english);
if (noEnglishDef.length > 0) {
  console.log('\n⚠️  以下單字沒有英文定義：');
  noEnglishDef.forEach(v => console.log(`  - ${v.word}`));
}
