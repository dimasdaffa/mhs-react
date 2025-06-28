import React from "react";
import { useChartData } from "../hooks/useChart.js";
import StudentsPerFacultyChart from "../components/organisms/StudentsPerFacultyChart.jsx";
import GenderRatioChart from "../components/organisms/GenderRatioChart.jsx";
import RegistrationTrendChart from "../components/organisms/RegistrationTrendChart.jsx";
import GradeDistributionChart from "../components/organisms/GradeDistributionChart.jsx";
import LecturerRanksChart from "../components/organisms/LecturerRanksChart.jsx";

const DashboardPage = () => {
  const { data = {}, isLoading, isError } = useChartData();

  const {
    students = [],
    genderRatio = [],
    registrations = [],
    gradeDistribution = [],
    lecturerRanks = [],
  } = data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg">Error loading chart data</p>
          <p className="text-gray-600 mt-2">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Akademik</h1>
          <p className="text-gray-600">Visualisasi data mahasiswa, dosen, dan akademik</p>
        </div>

        {/* Grid Layout untuk Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart - Mahasiswa per Fakultas */}
          <StudentsPerFacultyChart data={students} />

          {/* Pie Chart - Gender Ratio */}
          <GenderRatioChart data={genderRatio} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Line Chart - Tren Registrasi */}
          <RegistrationTrendChart data={registrations} />

          {/* Radar Chart - Ranking Dosen */}
          <LecturerRanksChart data={lecturerRanks} />
        </div>

        {/* Area Chart - Distribusi Nilai (Full Width) */}
        <div className="mb-6">
          <GradeDistributionChart data={gradeDistribution} />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-sm font-medium text-gray-600">Total Mahasiswa</h4>
            <p className="text-2xl font-bold text-blue-600">
              {students.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-sm font-medium text-gray-600">Total Dosen</h4>
            <p className="text-2xl font-bold text-green-600">
              {lecturerRanks.reduce((sum, item) => sum + item.count, 0)}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-sm font-medium text-gray-600">Fakultas Terbesar</h4>
            <p className="text-2xl font-bold text-purple-600">
              {students.length > 0 ? 
                students.reduce((prev, current) => (prev.count > current.count) ? prev : current).faculty 
                : '-'
              }
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h4 className="text-sm font-medium text-gray-600">Registrasi Terakhir</h4>
            <p className="text-2xl font-bold text-orange-600">
              {registrations.length > 0 ? 
                registrations[registrations.length - 1].total 
                : '-'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;