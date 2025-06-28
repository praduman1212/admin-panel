import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  ChevronDown,
  LogOut,
  Bell,
  BarChart2
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  {
    title: 'Main Menu',
    items: [
      {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
      },
      {
        title: 'Analytics',
        icon: BarChart2,
        href: '/analytics',
      },
      {
        title: 'Notifications',
        icon: Bell,
        href: '/notifications',
        badge: '3',
      },
    ],
  },
  {
    title: 'Academic',
    items: [
      {
        title: 'Courses',
        icon: BookOpen,
        href: '/courses',
        submenu: [
          { title: 'All Courses', href: '/courses' },
          { title: 'Add Course', href: '/courses/add' },
          { title: 'Categories', href: '/courses/categories' },
        ],
      },
      {
        title: 'Students',
        icon: Users,
        href: '/students',
      },
      {
        title: 'Teachers',
        icon: GraduationCap,
        href: '/teachers',
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: 'Schedule',
        icon: Calendar,
        href: '/schedule',
      },
      {
        title: 'Assignments',
        icon: FileText,
        href: '/assignments',
      },
      {
        title: 'Discussion',
        icon: MessageSquare,
        href: '/discussion',
      },
    ],
  },
];

export default function Sidebar() {
  const router = useRouter();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const isActive = (href) => router.pathname === href;

  const toggleSubmenu = (title) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };

  return (
    <div className="w-64 h-screen bg-white dark:bg-[#232936] border-r border-gray-200 dark:border-gray-800 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="p-2 w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              LMS
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Learning System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            <p className="px-3 mb-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <div key={item.title}>
                  <button
                    onClick={() => item.submenu ? toggleSubmenu(item.title) : router.push(item.href)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-500'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </div>
                    {item.submenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openSubmenu === item.title ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                    {item.badge && (
                      <span className="ml-auto bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-500 text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                  {item.submenu && openSubmenu === item.title && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-1 ml-9 space-y-1"
                    >
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.title}
                          href={subitem.href}
                          className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                            isActive(subitem.href)
                              ? 'text-blue-600 dark:text-blue-500'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => router.push('/settings')}
          className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button
          onClick={() => router.push('/login')}
          className="w-full flex items-center space-x-3 px-3 py-2 mt-1 text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}