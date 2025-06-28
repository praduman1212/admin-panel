import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
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

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("admin@gmail.com");
    const [password, setPassword] = useState("admin");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // For demo purposes, we're using hardcoded credentials
            if (email === "admin@gmail.com" && password === "admin") {
                await router.push("/dashboard");
            } else {
                alert("Invalid credentials! Please use admin@gmail.com/admin");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred during login");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            await router.push("/dashboard");
        } catch (error) {
            console.error("Google sign-in error:", error);
            alert("An error occurred during Google sign-in");
        } finally {
            setIsLoading(false);
        }
    };

    if (!mounted) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1a1f2b] text-gray-900 dark:text-gray-100 flex items-center justify-center p-4">
            <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="fixed top-4 right-4 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                ) : (
                    <Moon className="w-5 h-5" />
                )}
            </button>
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - Features */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                LMS
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Learn. Grow. Succeed.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                            Transform Your Learning Journey
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                            Join thousands of learners and educators in our comprehensive
                            learning management system.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="bg-white dark:bg-[#232936] rounded-2xl p-8 shadow-lg dark:shadow-none backdrop-blur-sm">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                                Welcome Back
                            </h3>
                            <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
                                Sign in to your account
                            </p>
                        </div>

                                    {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white dark:bg-[#2a303c] border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-[#313844] transition-colors duration-200 mb-6"
            >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                            <span className="text-gray-900 dark:text-white font-medium">
                                Continue with Google
                            </span>
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-[#232936] px-2 text-gray-500 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-[#2a303c] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-[#2a303c] border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>


                            <div className="flex items-center justify-between">
                                <label className="flex items-center space-x-2 text-sm">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#2a303c] text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                                    />
                                    <span className="text-gray-600 dark:text-gray-400">
                                        Remember me
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Sign In</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
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