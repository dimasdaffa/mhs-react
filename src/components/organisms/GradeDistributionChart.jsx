import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const GradeDistributionChart = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Distribusi Nilai per Program Studi
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="A" 
            stackId="1" 
            stroke="#8884d8" 
            fill="#8884d8" 
            name="Grade A"
          />
          <Area 
            type="monotone" 
            dataKey="B" 
            stackId="1" 
            stroke="#82ca9d" 
            fill="#82ca9d" 
            name="Grade B"
          />
          <Area 
            type="monotone" 
            dataKey="C" 
            stackId="1" 
            stroke="#ffc658" 
            fill="#ffc658" 
            name="Grade C"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GradeDistributionChart;