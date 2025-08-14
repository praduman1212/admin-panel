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
    Sun,
    Moon,
    Award,
    BookOpen,
    GraduationCap,
    User,
    Phone
} from "lucide-react";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/Auth.context";
import { toast } from "sonner";

export default function SignUpPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("");
    const [dob, setDob] = useState("");
    const [address, setAddress] = useState("");
    const [gender, setGender] = useState("");
    const { isLoading, signUp, signInWithGoogle } = useAuth();
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    const validateForm = () => {
        if (!name.trim()) {
            toast.error("Please enter your name");
            return false;
        }
        if (!email.trim()) {
            toast.error("Please enter your email");
            return false;
        }
        if (!email.includes("@") || !email.includes(".")) {
            toast.error("Please enter a valid email address");
            return false;
        }
        if (!phone.trim()) {
            toast.error("Please enter your phone number");
            return false;
        }
        if (phone.length < 10) {
            toast.error("Please enter a valid phone number");
            return false;
        }
        if (!password) {
            toast.error("Please enter a password");
            return false;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }
        if (!role) {
            toast.error("Please select a role");
            return false;
        }
        if (!dob) {
            toast.error("Please enter your date of birth");
            return false;
        }
        if (!gender) {
            toast.error("Please select your gender");
            return false;
        }
        if (!address.trim()) {
            toast.error("Please enter your address");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            await signUp(email, password, name, role, dob, gender, address, phone);
            toast.success("Account created successfully! Please log in.");
            router.push("/login");
        } catch (error) {
            console.error("Signup error:", error);
            // Handle specific Firebase error codes
            switch (error.code) {
                case 'auth/email-already-in-use':
                    toast.error("This email is already registered. Please log in instead.");
                    break;
                case 'auth/invalid-email':
                    toast.error("Please enter a valid email address.");
                    break;
                case 'auth/weak-password':
                    toast.error("Password is too weak. Please use a stronger password.");
                    break;
                default:
                    toast.error(error.message || "Error creating account. Please try again.");
            }
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
            toast.success("Signed in successfully!");
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
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-blue-100 via-white to-blue-300 dark:from-[#1a1f2b] dark:via-[#232936] dark:to-[#232936] text-gray-900 dark:text-gray-100">
            {/* Animated gradient and floating shapes for visual appeal */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-900 opacity-30 dark:opacity-0 rounded-full blur-3xl animate-pulse -z-10" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900 opacity-30 dark:opacity-0 rounded-full blur-3xl animate-pulse -z-10" />
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-pink-900 opacity-20 dark:opacity-0 rounded-full blur-2xl animate-bounce -z-10" />
            {/* Theme toggle button removed as requested */}
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
                {/* Left Side - Features */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="space-y-8"
                >
                    <div className="flex items-center space-x-3">
                        <div className="p-2 w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl border-2 border-white/40">
                            <GraduationCap className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">
                                LMS
                            </h1>
                            <p className="text-gray-200 font-medium">
                                Learn. Grow. Succeed.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-extrabold text-white leading-tight drop-shadow-lg tracking-tight">
                            Transform Your Learning Journey
                        </h2>
                        <p className="text-xl text-gray-200 leading-relaxed font-medium">
                            Join thousands of learners and educators in our comprehensive
                            learning management system.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <FeatureBox
                            Icon={Users}
                            label="12,000+"
                            description="Active Students"
                            iconColor="text-blue-100"
                        />
                        <FeatureBox
                            Icon={BookOpen}
                            label="500+"
                            description="Courses"
                            iconColor="text-blue-100"
                        />
                        <FeatureBox
                            Icon={Award}
                            label="98%"
                            description="Success Rate"
                            iconColor="text-green-200"
                        />
                        <FeatureBox
                            Icon={BarChart3}
                            label="24/7"
                            description="Support"
                            iconColor="text-purple-200"
                        />
                    </div>
                </motion.div>

                {/* Right Side - Sign Up Form */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <div className="bg-white/90 dark:bg-black rounded-3xl p-10 shadow-2xl backdrop-blur-lg border border-white/40 dark:border-gray-700/40 relative">
                        {/* Stepper indicator */}
                        <div className="flex justify-center mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                                <span className="w-3 h-3 rounded-full bg-purple-400 opacity-50" />
                                <span className="w-3 h-3 rounded-full bg-pink-400 opacity-30" />
                            </div>
                        </div>
                        {/* Avatar placeholder with hover */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800 transition-transform duration-300 hover:scale-105 cursor-pointer">
                                <User className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="mb-8">
                            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center tracking-tight">
                                Create an Account
                            </h3>
                            <p className="mt-2 text-center text-gray-600 dark:text-gray-400 font-medium">
                                Join our learning community today
                            </p>
                        </div>

                        {/* Google Sign In Button */}
                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200 mb-6 shadow-md focus:ring-2 focus:ring-blue-400"
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
                            <span className="text-gray-900 dark:text-white font-semibold">
                                Continue with Google
                            </span>
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <Separator className="w-full" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white/90 dark:bg-[#232936]/90 px-2 text-gray-500 dark:text-gray-400 font-semibold">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* ...existing code... */}
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-black border border-blue-200 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-black border border-purple-200 dark:border-purple-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-lg text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="relative">
                                <input
                                    type="date"
                                    placeholder="Date of Birth"
                                    value={dob}
                                    onChange={e => setDob(e.target.value)}
                                    className="w-full pl-4 pr-4 py-3 bg-white/80 dark:bg-black border border-blue-200 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400" />
                                <select
                                    value={gender}
                                    onChange={e => setGender(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-black border border-pink-200 dark:border-pink-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:shadow-lg text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div className="relative">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2h5" /></svg>
                                <input
                                    type="text"
                                    placeholder="Address"
                                    value={address}
                                    onChange={e => setAddress(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-black border border-green-200 dark:border-green-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:shadow-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-black border border-blue-200 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white/80 dark:bg-black border border-blue-200 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all duration-200"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password (min. 6 characters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3 bg-white/80 dark:bg-black border border-blue-200 dark:border-blue-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm transition-all duration-200"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-extrabold transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl text-lg focus:ring-2 focus:ring-blue-400 relative overflow-hidden"
                                style={{ position: 'relative' }}
                                onMouseDown={e => {
                                    const btn = e.currentTarget;
                                    const ripple = document.createElement('span');
                                    ripple.className = 'absolute bg-white/30 rounded-full pointer-events-none animate-ripple';
                                    ripple.style.left = `${e.nativeEvent.offsetX}px`;
                                    ripple.style.top = `${e.nativeEvent.offsetY}px`;
                                    ripple.style.width = ripple.style.height = '100px';
                                    ripple.style.transform = 'translate(-50%, -50%)';
                                    btn.appendChild(ripple);
                                    setTimeout(() => ripple.remove(), 600);
                                }}
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>

                            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 font-medium">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
                                >
                                    Sign in
                                </Link>
                            </p>
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