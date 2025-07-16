import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import Sidebar from '@/components/Layout/Sidebar';
import CourseCard from '@/components/Coursecard';
import { db } from '@/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { BookOpen, DollarSign, GraduationCap, Users } from 'lucide-react';

const Dashboard = () => {
  // Read display size and font from localStorage
  const [displaySize, setDisplaySize] = useState('medium');
  const [font, setFont] = useState('Inter');

  useEffect(() => {
    const savedSize = localStorage.getItem('displaySize');
    const savedFont = localStorage.getItem('font');
    if (savedSize) setDisplaySize(savedSize);
    if (savedFont) setFont(savedFont);
  }, []);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  // State for stats and data
  const [courses, setCourses] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all courses
        const coursesSnap = await getDocs(collection(db, 'ncourse'));
        const coursesData = coursesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCourses(coursesData);

        // Fetch recent courses (last 5)
        const recentQuery = query(collection(db, 'ncourse'), orderBy('created_at', 'desc'), limit(5));
        const recentSnap = await getDocs(recentQuery);
        setRecentCourses(recentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        // Fetch users
        const usersSnap = await getDocs(collection(db, 'users'));
        setUsers(usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        setError('Failed to load dashboard data.');
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (!mounted || loading) return <div className="flex items-center justify-center h-screen text-lg">Loading...</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-red-600">{error}</div>;

  // Calculate total revenue (sum of all course prices)
  const totalRevenue = courses.reduce((sum, course) => {
    const price = parseFloat(course['course-price'] || course.price || 0);
    return sum + (isNaN(price) ? 0 : price);
  }, 0);

  // Stat cards with icons and colors
  const stats = [
    {
      label: 'Total Courses',
      value: courses.length,
      icon: <BookOpen className="w-7 h-7 text-blue-500" />,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Total Users',
      value: users.length,
      icon: <Users className="w-7 h-7 text-green-500" />,
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Total Instructors',
      value: users.filter(u => u.role === 'Instructor').length,
      icon: <GraduationCap className="w-7 h-7 text-purple-500" />,
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Total Revenue',
      value: totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      icon: <DollarSign className="w-7 h-7 text-yellow-500" />,
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
  ];

  // Handle sortField for asc/desc (if needed in the future)
  // Example (uncomment and adapt if you want to auto-set sortOrder based on sortField):
  // useEffect(() => {
  //   if (!sortField) return setSortOrder('asc');
  //   if (sortField.endsWith('-desc')) {
  //     setSortOrder('desc');
  //   } else {
  //     setSortOrder('asc');
  //   }
  // }, [sortField]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#1a1f2b]" style={{ fontFamily: font }}>
      <Sidebar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6">
          {/* Overview Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold text-gray-900 dark:text-white"
              style={{
                fontFamily: font,
                fontSize:
                  displaySize === 'small' ? '1.5em'
                  : displaySize === 'large' ? '2.5em'
                  : '2em',
              }}
            >
              Welcome back, Admin
            </h1>
            <p
              className="text-gray-600 dark:text-gray-400 mt-2"
              style={{
                fontFamily: font,
                fontSize:
                  displaySize === 'small' ? '0.9em'
                  : displaySize === 'large' ? '1.2em'
                  : '1em',
              }}
            >
              Here’s an overview of your platform’s activity.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {stats.map(stat => (
              <div
                key={stat.label}
                className={`rounded-lg shadow p-6 flex flex-col items-center ${stat.bg} transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                style={{ fontFamily: font, fontSize: displaySize === 'small' ? '0.95em' : displaySize === 'large' ? '1.15em' : '1em' }}
              >
                <div className="mb-2">{stat.icon}</div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                <span className="text-gray-700 dark:text-gray-300 mt-2 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Recently Added Courses */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" style={{ fontFamily: font, fontSize: displaySize === 'small' ? '1em' : displaySize === 'large' ? '1.5em' : '1.2em' }}>Recently Added Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recentCourses.length === 0 ? (
                <div className="col-span-full text-gray-500 dark:text-gray-400">No recent courses found.</div>
              ) : recentCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          {/* All Courses List */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4" style={{ fontFamily: font, fontSize: displaySize === 'small' ? '1em' : displaySize === 'large' ? '1.5em' : '1.2em' }}>All Courses</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.length === 0 ? (
                <div className="col-span-full text-gray-500 dark:text-gray-400">No courses found.</div>
              ) : courses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>

          {/* Users Table */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2" style={{ fontFamily: font, fontSize: displaySize === 'small' ? '1em' : displaySize === 'large' ? '1.5em' : '1.2em' }}>
              <Users className="w-6 h-6 text-blue-500" /> Users
            </h2>
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-full bg-white dark:bg-gray-800" style={{ fontFamily: font, fontSize: displaySize === 'small' ? '0.9em' : displaySize === 'large' ? '1.15em' : '1em' }}>
                <thead>
                  <tr>
                    <th className="px-4 py-3 border-b text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 border-b text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 border-b text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 border-b text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 border-b text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">No users found.</td>
                    </tr>
                  ) : users.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 border-b text-gray-500 dark:text-gray-400 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 border-b text-gray-900 dark:text-white font-medium">{user.name || user.displayName || 'N/A'}</td>
                      <td className="px-4 py-3 border-b text-gray-700 dark:text-gray-300">{user.email || 'N/A'}</td>
                      <td className="px-4 py-3 border-b text-gray-700 dark:text-gray-300 capitalize">{user.role || 'User'}</td>
                      <td className="px-4 py-3 border-b text-gray-700 dark:text-gray-300">{user.created_at ? new Date(user.created_at.seconds ? user.created_at.seconds * 1000 : user.created_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;