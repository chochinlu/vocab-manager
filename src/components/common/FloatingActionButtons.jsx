import React, { useState, useEffect } from 'react';
import { Plus, ArrowUp } from 'lucide-react';

/**
 * 浮動動作按鈕組件
 * 包含「新增單字」和「回到頂部」兩個按鈕
 * 當使用者向下滾動超過 400px 時顯示
 */
export const FloatingActionButtons = ({ onAddVocab }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 簡單的 throttle 實作，避免 scroll 事件觸發太頻繁
    let timeoutId = null;

    const handleScroll = () => {
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        setIsVisible(window.pageYOffset > 400);
        timeoutId = null;
      }, 100);
    };

    // 監聽滾動事件
    window.addEventListener('scroll', handleScroll);

    // 清理事件監聽器
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // 新增單字
  const handleAddVocab = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    // 延遲展開表單，等滾動完成
    setTimeout(() => {
      onAddVocab();
    }, 300);
  };

  // 滾動到頂端
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-3">
      {/* 新增單字按鈕 */}
      <button
        onClick={handleAddVocab}
        className={`
          w-12 h-12 rounded-full
          bg-blue-500 hover:bg-blue-600
          shadow-xl
          flex items-center justify-center
          text-white
          transition-all duration-300
          hover:scale-110 hover:-translate-y-0.5
          cursor-pointer
          ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-label="新增單字"
        title="新增單字"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* 回到頂部按鈕 */}
      <button
        onClick={scrollToTop}
        className={`
          w-12 h-12 rounded-full
          bg-white/95 backdrop-blur-sm
          border border-white/20
          shadow-xl
          flex items-center justify-center
          text-blue-600
          transition-all duration-300
          hover:bg-white hover:scale-110 hover:-translate-y-0.5
          cursor-pointer
          ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        aria-label="回到頂端"
        title="回到頂端"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};
