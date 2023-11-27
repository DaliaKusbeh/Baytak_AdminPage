import React, { useState } from 'react';
import './Brightness.css'

const Brightness = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`brightness ${isDarkMode ? 'dark' : 'light'}`}>
      <button onClick={toggleMode}>Toggle Mode</button>
      <span>Brightness</span>
    </div>
  );
};

export default Brightness;
