import React from 'react';
import Label from '../atoms/Label';
import Input from '../atoms/Input';

const FormGroup = ({ label, type, name, id, required, placeholder }) => {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        name={name}
        id={id}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormGroup; 