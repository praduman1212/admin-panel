import { useState } from "react";
import MainLayout from "@/components/Layout/MainLayout";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, Users, GraduationCap, DollarSign, BookOpen } from "lucide-react";

// Mock data for charts
const userGrowthData = [
    { month: "Jan", users: 400 },
    { month: "Feb", users: 600 },
    { month: "Mar", users: 800 },
    { month: "Apr", users: 1000 },
    { month: "May", users: 1400 },
    { month: "Jun", users: 1800 },
];

const revenueData = [
    { month: "Jan", revenue: 5000 },
    { month: "Feb", revenue: 7000 },
    { month: "Mar", revenue: 8500 },
    { month: "Apr", revenue: 10000 },
    { month: "May", revenue: 12000 },
    { month: "Jun", revenue: 15000 },
];

const courseEnrollmentData = [
    { name: "Web Development", students: 1200 },
    { name: "Data Science", students: 800 },
    { name: "Mobile Dev", students: 600 },
    { name: "UI/UX Design", students: 400 },
    { name: "DevOps", students: 300 },
];

const userTypeData = [
    { name: "Students", value: 3000 },
    { name: "Instructors", value: 150 },
    { name: "Admin", value: 20 },
];

const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7"];

export default function AnalyticsPage() {
    const [timeRange, setTimeRange] = useState("6m"); // 6m, 1y, all

    // Calculate metrics
    const totalUsers = userTypeData.reduce((acc, curr) => acc + curr.value, 0);
    const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalCourses = courseEnrollmentData.length;
    const totalEnrollments = courseEnrollmentData.reduce((acc, curr) => acc + curr.students, 0);

    const metrics = [
        {
            title: "Total Users",
            value: totalUsers.toLocaleString(),
            change: "+12.5%",
            trend: "up",
            icon: Users,
            color: "blue",
        },
        {
            title: "Total Revenue",
            value: `$${totalRevenue.toLocaleString()}`,
            change: "+8.2%",
            trend: "up",
            icon: DollarSign,
            color: "green",
        },
        {
            title: "Total Courses",
            value: totalCourses,
            change: "+5.0%",
            trend: "up",
            icon: BookOpen,
            color: "purple",
        },
        {
            title: "Total Enrollments",
            value: totalEnrollments.toLocaleString(),
            change: "-2.3%",
            trend: "down",
            icon: GraduationCap,
            color: "indigo",
        },
    ];

    return (

        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Overview</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Track your platform's performance and growth</p>
                </div>

                {/* Time Range Selector */}
                <div className="flex items-center gap-2 mb-6">
                    {["6m", "1y", "all"].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${timeRange === range
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                        >
                            {range === "6m" ? "6 Months" : range === "1y" ? "1 Year" : "All Time"}
                        </button>
                    ))}
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {metrics.map((metric) => (
                        <div
                            key={metric.title}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                        >
                            <div className="flex items-center justify-between">
                                <div className={`p-2 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/30`}>
                                    <metric.icon className={`w-5 h-5 text-${metric.color}-600 dark:text-${metric.color}-400`} />
                                </div>
                                <div className="flex items-center gap-1">
                                    <span
                                        className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                            }`}
                                    >
                                        {metric.change}
                                    </span>
                                    {metric.trend === "up" ? (
                                        <ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                                    )}
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</h3>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Growth Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={userGrowthData}>
                                    <defs>
                                        <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                    <XAxis dataKey="month" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgb(31, 41, 55)",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            color: "#fff",
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="#3b82f6"
                                        fillOpacity={1}
                                        fill="url(#userGrowth)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                    <XAxis dataKey="month" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgb(31, 41, 55)",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            color: "#fff",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ fill: "#10b981", strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Course Enrollment Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Enrollments</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={courseEnrollmentData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                    <XAxis dataKey="name" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgb(31, 41, 55)",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            color: "#fff",
                                        }}
                                    />
                                    <Bar dataKey="students" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* User Distribution Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userTypeData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {userTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "rgb(31, 41, 55)",
                                            border: "none",
                                            borderRadius: "0.5rem",
                                            color: "#fff",
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}