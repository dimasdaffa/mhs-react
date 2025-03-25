import React from 'react';
import TableCell from '../atoms/TableCell';
import Button from '../atoms/Button';

const TableRow = ({ nim, nama, onEdit, onDelete }) => {
  return (
    <tr className="border">
      <TableCell>{nim}</TableCell>
      <TableCell>{nama}</TableCell>
      <TableCell>
        <div className="space-x-2">
          <Button 
            onClick={onEdit}
            className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1"
          >
            Edit
          </Button>
          <Button 
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 px-2 py-1"
          >
            Hapus
          </Button>
        </div>
      </TableCell>
    </tr>
  );
};

export default TableRow; 