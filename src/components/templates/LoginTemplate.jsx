import React from 'react';
import LoginForm from '../organisms/LoginForm';

const LoginTemplate = ({ onSubmit }) => {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
        Login
      </h2>
      <LoginForm onSubmit={onSubmit} />
    </div>
  );
};

export default LoginTemplate; 