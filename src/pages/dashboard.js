import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import Sidebar from '@/components/SIdebar';
import CourseCard from '@/components/Coursecard';

// Course generation helper data

const instructors = [
  { name: 'John Smith', specialization: 'Web Development', rating: 4.9 },
  { name: 'Sarah Johnson', specialization: 'JavaScript', rating: 4.8 },
  { name: 'Mike Wilson', specialization: 'UI/UX Design', rating: 4.7 },
  { name: 'Emily Brown', specialization: 'React', rating: 4.9 },
  { name: 'David Chen', specialization: 'Python', rating: 4.8 },
  { name: 'Lisa Anderson', specialization: 'Data Science', rating: 4.9 },
  { name: 'Alex Martinez', specialization: 'Mobile Development', rating: 4.7 },
  { name: 'Rachel Kim', specialization: 'Machine Learning', rating: 4.8 }
];


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
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, Admin
            </h1>
           
          </div>

          {/* In Progress Courses Section */}
          
        </div>
      </main>
    </div>
  );
};

export default Dashboard;