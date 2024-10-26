import React from 'react';
import './Category.css';

const Category = ({ title, words }) => (
  <div className="category">
    <h2>{title}</h2>
    <div className="words-grid">
      {words.map((word, index) => (
        <div key={index} className="word-box">
          <p>{word.arabic}</p>
          <p>{word.hebrew}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Category;
