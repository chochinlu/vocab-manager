import React, { useState, useEffect } from 'react';
import { Plus, ArrowUp } from 'lucide-react';

/**
 * Floating Action Buttons Component
 * Contains "Add Word" and "Back to Top" buttons
 * Shown when user scrolls down more than 400px
 */
export const FloatingActionButtons = ({ onAddVocab }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simple throttle implementation to avoid too frequent scroll events
    let timeoutId = null;

    const handleScroll = () => {
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        setIsVisible(window.pageYOffset > 400);
        timeoutId = null;
      }, 100);
    };

    // Listen to scroll events
    window.addEventListener('scroll', handleScroll);

    // Clean up event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Add word
  const handleAddVocab = () => {
    // Simply trigger the callback - scrolling is now handled by VocabForm
    onAddVocab();
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-3">
      {/* Add word button */}
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
        aria-label="Add Word"
        title="Add Word"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Back to top button */}
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
        aria-label="Back to Top"
        title="Back to Top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </div>
  );
};
