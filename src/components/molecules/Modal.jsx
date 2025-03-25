import React from 'react';
import AdminButton from '../atoms/AdminButton';

const Modal = ({ isOpen, onClose, title, children, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        {children}
        <div className="flex justify-end space-x-2 mt-4">
          <AdminButton 
            onClick={onClose}
            variant="secondary"
          >
            Batal
          </AdminButton>
          <AdminButton 
            onClick={onSubmit}
            variant="primary"
          >
            Simpan
          </AdminButton>
        </div>
      </div>
    </div>
  );
};

export default Modal; 