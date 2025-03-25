import React from 'react';

const AdminButton = ({ type = 'button', onClick, children, variant = 'primary', className = '' }) => {
  const baseStyle = 'px-4 py-2 rounded transition-colors duration-200';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-400 hover:bg-gray-500 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default AdminButton; 