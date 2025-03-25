import React from 'react';

const NavLink = ({ icon, children, isActive }) => {
  return (
    <a 
      href="#" 
      className={`flex items-center p-3 rounded mt-2 ${
        isActive ? 'bg-blue-700' : 'bg-blue-800 hover:bg-blue-700'
      }`}
    >
      <span className="ml-2">{icon} {children}</span>
    </a>
  );
};

export default NavLink; 