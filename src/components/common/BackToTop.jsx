import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Back to Top 按鈕組件
 * 當使用者向下滾動超過 400px 時顯示
 * 點擊後平滑滾動回頂端
 */
export const BackToTop = () => {
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

  // 滾動到頂端
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50
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
  );
};
