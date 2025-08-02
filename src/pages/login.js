import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Users,
    BarChart3,
    Shield,
    Settings,
    Sun,
    Moon,
    Award,
    BookOpen,
    GraduationCap
} from "lucide-react";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/Auth.context";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const { isLoading, signInWithGoogle } = useAuth();
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);


    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            toast.success("Welcome back!");
            router.push("/");
        } catch (error) {
            console.error("Google sign-in error:", error);
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error("Sign in cancelled. Please try again.");
            } else {
                toast.error("Error signing in with Google. Please try again.");
            }
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-[#1a1f2b] dark:via-[#232936] dark:to-[#232936] text-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Features */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div className="flex items-center space-x-4 justify-center">
                        <div className="p-3 w-16 h-16 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                            <GraduationCap className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                LMS
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                                Learn. Grow. Succeed.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 text-center">
                        <h2 className="text-5xl font-extrabold text-blue-700 dark:text-white leading-tight mb-2">
                            Welcome Back!
                        </h2>
                        <p className="text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                            Sign in to continue your learning journey with our comprehensive LMS.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <FeatureBox
                            Icon={Users}
                            label="12,000+"
                            description="Active Students"
                            iconColor="text-blue-500"
                        />
                        <FeatureBox
                            Icon={BookOpen}
                            label="500+"
                            description="Courses"
                            iconColor="text-blue-500"
                        />
                        <FeatureBox
                            Icon={Award}
                            label="98%"
                            description="Success Rate"
                            iconColor="text-green-500"
                        />
                        <FeatureBox
                            Icon={BarChart3}
                            label="24/7"
                            description="Support"
                            iconColor="text-purple-500"
                        />
                    </div>
                </motion.div>

                {/* Right Side - Login Form (Google only) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="bg-white dark:bg-[#232936] rounded-2xl p-10 shadow-xl dark:shadow-none backdrop-blur-sm flex flex-col items-center animate-fade-in">
                        <div className="mb-8 text-center">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Login to LMS
                            </h3>
                            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                                One-click Google login. Fast, secure, and easy.
                            </p>
                        </div>
                        {/* Google Sign In Button Only */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-4 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-2xl shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <svg className="w-7 h-7 mr-2" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            <span>Login with Google</span>
                        </button>
                        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                            By signing in, you agree to our <Link href="/terms" className="text-blue-600 dark:text-blue-400 underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 dark:text-blue-400 underline">Privacy Policy</Link>.
                        </p>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center">
                            New here?{' '}
                            <Link href="/signUp" className="text-blue-600 dark:text-blue-400 font-semibold underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

function FeatureBox({ Icon, label, description, iconColor }) {
    return (
        <div className="flex items-center space-x-3 p-4 bg-white dark:bg-[#232936] rounded-xl shadow-sm dark:shadow-none">
            <Icon className={`w-8 h-8 ${iconColor}`} />
            <div>
                <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                </p>
            </div>
        </div>
    );
}   