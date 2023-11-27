import React, { useState } from 'react';

const Search = () => {
   const [query, setQuery] = useState('');
   
  return (
    <div className="mid-section">
    <form >
      <input
        type="text"
        placeholder="Search . . ."
        onChange={e=> setQuery(e.target.value)}
        
      />
      <button type="submit">
        <i className="material-icons">search</i>
      </button>
    </form>
  </div>  )
}

export default Search