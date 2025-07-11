import React from 'react';
import Navbar from '../Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '@/context/Auth.context';
import { useRouter } from 'next/router';
import { Loader2 } from 'lucide-react';

const MainLayout = ({ children }) => {
    const { isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated && typeof window !== 'undefined') {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1a1f2b]">
            {/* Navbar - Fixed at top */}
            <Navbar />
            
            <div className="flex h-screen pt-16"> {/* Add pt-16 to account for navbar height */}
                {/* Sidebar - Fixed at left */}
                <Sidebar />
                
                {/* Main Content Area - Scrollable */}
                <main className="flex-1 overflow-auto ml-64 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout; 