import React, { useState, useEffect } from 'react';

const Carousel = ({ children }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % children.length);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [children.length]);

  return (
    <div className="carousel">
      {children.map((child, index) => (
        <div key={index} className={index === activeIndex ? 'slide active' : 'slide'}>
          {child}
        </div>
      ))}
    </div>
  );
};

export default Carousel;
