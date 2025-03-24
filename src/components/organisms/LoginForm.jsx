import React from 'react';
import FormGroup from '../molecules/FormGroup';
import Button from '../atoms/Button';

const LoginForm = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormGroup
        label="Email"
        type="email"
        name="email"
        id="email"
        required
        placeholder="Enter your email"
      />
      <FormGroup
        label="Password"
        type="password"
        name="password"
        id="password"
        required
        placeholder="Enter your password"
      />
      <div className="flex justify-between items-center">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-700">Ingat Saya</span>
        </label>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          Lupa Password
        </a>
      </div>
      <Button type="submit">Login</Button>
      <p className="text-sm text-center text-gray-700 mt-4">
        Belum punya akun?
        <a href="#" className="text-blue-600 hover:underline ml-1">
          Daftar
        </a>
      </p>
    </form>
  );
};

export default LoginForm; 