import React from 'react';

const TableHeader = ({ children }) => {
  return (
    <th className="p-2 text-left">{children}</th>
  );
};

export default TableHeader; 