import React, { useState } from 'react';
import MahasiswaTable from '../components/organisms/MahasiswaTable';
import AdminButton from '../components/atoms/AdminButton';
import Modal from '../components/molecules/Modal';
import FormGroup from '../components/molecules/FormGroup';

const MahasiswaPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mahasiswa, setMahasiswa] = useState([
    { nim: 'A11.2022.14079', nama: 'Supardo' },
    { nim: 'A11.2022.14080', nama: 'Supardi' },
    { nim: 'A11.2022.14081', nama: 'Sapardi' },
  ]);

  const handleEdit = (mhs) => {
    console.log('Edit:', mhs);
  };

  const handleDelete = (mhs) => {
 
    console.log('Delete:', mhs);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Mahasiswa</h2>
      <div className="bg-white p-4 shadow rounded">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-bold">Daftar Mahasiswa</h3>
          <AdminButton 
            onClick={() => setIsModalOpen(true)}
            variant="primary"
          >
            + Tambah Mahasiswa
          </AdminButton>
        </div>
        
        <MahasiswaTable 
          mahasiswa={mahasiswa}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Mahasiswa"
        onSubmit={() => {
          // Implementasi submit
          setIsModalOpen(false);
        }}
      >
        <FormGroup
          label="NIM"
          type="text"
          name="nim"
          id="nim"
          required
          placeholder="Masukkan NIM"
        />
        <FormGroup
          label="Nama"
          type="text"
          name="nama"
          id="nama"
          required
          placeholder="Masukkan Nama"
        />
      </Modal>
    </div>
  );
};

export default MahasiswaPage; 