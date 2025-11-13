/**
 * 渲染例句，支援 **粗體** 標記
 * @param {string} text - 例句文字
 * @returns {Array} React 元素陣列
 */
export const renderExample = (text) => {
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
