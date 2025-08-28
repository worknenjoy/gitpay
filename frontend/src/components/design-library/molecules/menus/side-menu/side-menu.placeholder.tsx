import React from 'react';
import './side-menu.placeholder.styles.css';

const SidebarMenuPlaceholder = () => {
  return (
    <div className="sidebar-placeholder">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="sidebar-placeholder-line"
          style={{ width: `${80 + Math.random() * 20}%` }}
        />
      ))}
    </div>
  );
}

export default SidebarMenuPlaceholder;
