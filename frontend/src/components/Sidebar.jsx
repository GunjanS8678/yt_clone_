import React, { useState } from 'react';
import { 
  FaHome, 
  FaMusic, 
  FaGamepad, 
  FaNewspaper, 
  FaGraduationCap,
  FaTrophy
} from 'react-icons/fa';
import '../Sidebar.css';

const Sidebar = ({ onSelectCategory }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { name: 'All', icon: <FaHome /> },
    { name: 'Music', icon: <FaMusic /> },
    { name: 'Gaming', icon: <FaGamepad /> },
    { name: 'News', icon: <FaNewspaper /> },
    { name: 'Education', icon: <FaGraduationCap /> },
    { name: 'Sports', icon: <FaTrophy /> },
  ];

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    onSelectCategory(category);
  };

  return (
    <aside className="sidebar">
      <h2>Categories</h2>
      <ul>
        {categories.map((category) => (
          <li
            key={category.name}
            className={activeCategory === category.name ? 'active' : ''}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.icon}
            <span>{category.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;