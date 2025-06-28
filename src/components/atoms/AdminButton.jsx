import React from 'react';

const AdminButton = ({ type = 'button', onClick, children, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = 'px-4 py-2 rounded transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: disabled 
      ? 'bg-blue-300 text-blue-100 cursor-not-allowed' 
      : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: disabled 
      ? 'bg-gray-300 text-gray-400 cursor-not-allowed' 
      : 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500',
    warning: disabled 
      ? 'bg-yellow-300 text-yellow-100 cursor-not-allowed' 
      : 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500',
    danger: disabled 
      ? 'bg-red-300 text-red-100 cursor-not-allowed' 
      : 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  };

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default AdminButton;