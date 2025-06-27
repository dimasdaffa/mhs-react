import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

const FormGroup = ({ label, type, name, id, required, placeholder, defaultValue, value, onChange }) => {
  return (
    <div className="mb-4">
      <Label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </Label>
      <Input
        type={type}
        name={name}
        id={id}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default FormGroup;