import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Sidebar from '@/components/SIdebar';


const Dashboard = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#1a1f2b]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your learning management system overview
          </p>
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;