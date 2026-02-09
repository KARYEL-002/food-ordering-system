import { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import './AnimatedList.css';

const AnimatedList = ({
  items = [],
  onItemSelect = () => {},
  showGradients = true,
  enableArrowNavigation = true,
  displayScrollbar = true,
  renderItem = null,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 5 });

  const scrollIntoView = useCallback((index) => {
    if (index < visibleRange.start) {
      setVisibleRange({ start: index, end: index + 5 });
    } else if (index >= visibleRange.end) {
      setVisibleRange({ start: index - 4, end: index + 1 });
    }
  }, [visibleRange]);

  const handleNext = useCallback(() => {
    const nextIndex = Math.min(selectedIndex + 1, items.length - 1);
    setSelectedIndex(nextIndex);
    scrollIntoView(nextIndex);
    onItemSelect(items[nextIndex], nextIndex);
  }, [selectedIndex, items, onItemSelect, scrollIntoView]);

  const handlePrev = useCallback(() => {
    const prevIndex = Math.max(selectedIndex - 1, 0);
    setSelectedIndex(prevIndex);
    scrollIntoView(prevIndex);
    onItemSelect(items[prevIndex], prevIndex);
  }, [selectedIndex, items, onItemSelect, scrollIntoView]);

  useEffect(() => {
    if (enableArrowNavigation) {
      const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          handleNext();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          handlePrev();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [enableArrowNavigation, handleNext, handlePrev]);

  const handleScroll = (e) => {
    const element = e.target;
    const scrollTop = element.scrollTop;
    const itemHeight = 80;
    const start = Math.floor(scrollTop / itemHeight);
    const end = start + 5;
    setVisibleRange({ start, end });
  };

  return (
    <div className="animated-list-container">
      {/* Top Gradient */}
      {showGradients && <div className="animated-list-gradient-top" />}

      {/* Scrollable List */}
      <div
        className={`animated-list ${displayScrollbar ? 'with-scrollbar' : 'no-scrollbar'}`}
        onScroll={handleScroll}
      >
        <div className="animated-list-content">
          {items.map((item, index) => (
            <div
              key={index}
              className={`animated-list-item ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => {
                setSelectedIndex(index);
                scrollIntoView(index);
                onItemSelect(item, index);
              }}
            >
              {renderItem ? renderItem(item, index) : item}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      {showGradients && <div className="animated-list-gradient-bottom" />}

      {/* Navigation Arrows */}
      {enableArrowNavigation && (
        <div className="animated-list-navigation">
          <button
            onClick={handlePrev}
            disabled={selectedIndex === 0}
            className="arrow-button prev-button"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={selectedIndex === items.length - 1}
            className="arrow-button next-button"
          >
            <ChevronDown size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AnimatedList;
