// contexts/AdminContext.js
import { createContext, useState, useContext } from 'react';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [adminStats, setAdminStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 8,
  });

  const updateAdminStats = (newStats) => {
    setAdminStats(prev => ({ ...prev, ...newStats }));
  };

  const incrementStudents = () => {
    setAdminStats(prev => ({ ...prev, totalStudents: prev.totalStudents + 1 }));
  };

  const decrementStudents = () => {
    setAdminStats(prev => ({ ...prev, totalStudents: Math.max(0, prev.totalStudents - 1) }));
  };

  const incrementTeachers = () => {
    setAdminStats(prev => ({ ...prev, totalTeachers: prev.totalTeachers + 1 }));
  };

  const decrementTeachers = () => {
    setAdminStats(prev => ({ ...prev, totalTeachers: Math.max(0, prev.totalTeachers - 1) }));
  };

  const value = {
    adminStats,
    updateAdminStats,
    incrementStudents,
    decrementStudents,
    incrementTeachers,
    decrementTeachers,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};