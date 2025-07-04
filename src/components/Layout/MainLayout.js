import React from 'react';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <Sidebar />
      
      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16">
        <div className="p-4 sm:p-6 lg:p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 