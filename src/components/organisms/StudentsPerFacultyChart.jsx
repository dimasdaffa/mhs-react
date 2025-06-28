import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StudentsPerFacultyChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Jumlah Mahasiswa per Fakultas
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="faculty" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="count" 
            fill="#8884d8" 
            radius={[4, 4, 0, 0]}
            name="Jumlah Mahasiswa"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentsPerFacultyChart;