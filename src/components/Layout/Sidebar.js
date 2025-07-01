import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import {
  Layout,
  BookOpen,
  Users,
  BarChart2,
  Settings,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

const Sidebar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Wait until mounted on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      title: 'Dashboard',
      icon: <Layout className="w-5 h-5" />,
      href: '/'
    },
    {
      title: 'Courses',
      icon: <BookOpen className="w-5 h-5" />,
      href: '/course'
    },
    {
      title: 'Students',
      icon: <Users className="w-5 h-5" />,
      href: '/students'
    },
    {
      title: 'Analytics',
      icon: <BarChart2 className="w-5 h-5" />,
      href: '/analytics'
    },
    {
      title: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      href: '/settings'
    }
  ];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-transform
          lg:translate-x-0 lg:w-64
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
        `}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6 px-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-semibold text-gray-800 dark:text-white">
                LMS Admin
              </span>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mounted && (
                theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                )
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-500'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=50"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  John Smith
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Administrator
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;