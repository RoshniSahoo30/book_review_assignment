import React, { useState } from 'react';

const StarRating = ({ 
  rating, 
  interactive = false, 
  onRatingChange = null, 
  size = "xl" 
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const roundedRating = Math.round(rating || 0);
  const stars = [];

  const handleStarClick = (starValue) => {
    if (interactive && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (interactive) {
      setHoveredRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoveredRating(0);
    }
  };

  const getStarClass = (index) => {
    const baseClass = `text-${size}`;
    const isActive = index < (interactive && hoveredRating > 0 ? hoveredRating : roundedRating);
    
    if (interactive) {
      return `${baseClass} cursor-pointer transition-colors duration-200 ${
        isActive ? 'text-yellow-500 hover:text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
      }`;
    } else {
      return `${baseClass} ${isActive ? 'text-yellow-500' : 'text-gray-400'}`;
    }
  };

  for (let i = 0; i < 5; i++) {
    stars.push(
      <span
        key={i}
        className={getStarClass(i)}
        onClick={() => handleStarClick(i + 1)}
        onMouseEnter={() => handleStarHover(i + 1)}
        role={interactive ? "button" : undefined}
        tabIndex={interactive ? 0 : undefined}
        aria-label={interactive ? `Rate ${i + 1} star${i !== 0 ? 's' : ''}` : undefined}
      >
        ★
      </span>
    );
  }

  return (
    <div 
      className="inline-flex gap-0.5" 
      onMouseLeave={handleMouseLeave}
    >
      {stars}
      {interactive && rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating} star{rating !== 1 ? 's' : ''}
        </span>
      )}
    </div>
  );
};

export default StarRating;