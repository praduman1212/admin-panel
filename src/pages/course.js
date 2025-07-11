'use client'
import CourseCard from '@/components/Coursecard';
import React, { useState, useEffect } from 'react';
import { Plus, X, Upload, Loader2, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useCourse } from '@/context/Course.context';
import { useAuth } from '@/context/Auth.context';

const Course = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const { user } = useAuth();
    const { isLoading: isLoadingCourses, createCourse, getAllCourses } = useCourse();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        subcategory: '',
        level: 'Beginner',
        duration: '',
        lessons: '',
        price: '',
        originalPrice: '',
        description: '',
        shortDescription: '',
        metaTitle: '',
        metaDescription: '',
        language: 'en',
        features: {
            assignments: false,
            quizzes: false,
            certificate: false,
            downloadableContent: false,
            lifetimeAccess: false,
            mobileAccess: false
        },
        requirements: [],
        learningOutcomes: [],
        tags: [],
        totalQuizzes: 0,
        totalAssignments: 0,
        totalDuration: 0,
        instructorName: '',
        instructorImage: '',
        thumbnail: '',
        isFeatured: false,
        isBestseller: false,
        isFree: false
    });

    // Fetch courses when component mounts
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const coursesData = await getAllCourses();
                // console.log('Fetched courses:', coursesData); // Debug log
                setCourses(coursesData);
            } catch (error) {
                console.error('Error fetching courses:', error);
                toast.error('Failed to fetch courses');
            }
        };

        fetchCourses();
    }, [getAllCourses]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error('You must be logged in to create a course');
            return;
        }

        if (!formData.title.trim()) {
            toast.error('Course title is required');
            return;
        }
        if (!formData.category.trim()) {
            toast.error('Category is required');
            return;
        }

        setIsSubmitting(true);
        try {
            // Create course with all available fields
            await createCourse({
                title: formData.title,
                description: formData.description,
                shortDescription: formData.shortDescription,
                category: formData.category,
                subcategory: formData.subcategory,
                level: formData.level,
                duration: formData.duration,
                lessons: formData.lessons,
                price: parseFloat(formData.price) || 0,
                originalPrice: parseFloat(formData.originalPrice) || 0,
                metaTitle: formData.metaTitle || formData.title,
                metaDescription: formData.metaDescription || formData.description,
                language: formData.language,
                features: formData.features,
                requirements: formData.requirements,
                learningOutcomes: formData.learningOutcomes,
                tags: formData.tags,
                totalQuizzes: parseInt(formData.totalQuizzes) || 0,
                totalAssignments: parseInt(formData.totalAssignments) || 0,
                totalDuration: parseInt(formData.totalDuration) || 0,
                instructorName: formData.instructorName,
                instructorImage: formData.instructorImage,
                thumbnail: formData.thumbnail,
                isFeatured: formData.isFeatured,
                isBestseller: formData.isBestseller,
                isFree: formData.isFree,
                status: 'draft',
                createdAt: new Date(),
                updatedAt: new Date(),
                lastUpdated: new Date()
            });

            // Refresh courses list after creating new course
            const updatedCourses = await getAllCourses();
            setCourses(updatedCourses);
            setIsModalOpen(false);
            resetForm();
            toast.success('Course created successfully!');
        } catch (error) {
            console.error('Error creating course:', error);
            toast.error('Failed to create course');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: '',
            subcategory: '',
            level: 'Beginner',
            duration: '',
            lessons: '',
            price: '',
            originalPrice: '',
            description: '',
            shortDescription: '',
            metaTitle: '',
            metaDescription: '',
            language: 'en',
            features: {
                assignments: false,
                quizzes: false,
                certificate: false,
                downloadableContent: false,
                lifetimeAccess: false,
                mobileAccess: false
            },
            requirements: [],
            learningOutcomes: [],
            tags: [],
            totalQuizzes: 0,
            totalAssignments: 0,
            totalDuration: 0,
            instructorName: '',
            instructorImage: '',
            thumbnail: '',
            isFeatured: false,
            isBestseller: false,
            isFree: false
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    // Filter courses by search term
    const filteredCourses = courses?.filter(course => {
        console.log('Processing course:', course); // Debug log for each course
        const matchesSearch = course.course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.course_category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            course.course_description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    }) || [];

    // Update status filtering to match API values
    const inProgressCourses = filteredCourses.filter(course => course.status === 'pending' || course.status === 'draft');
    const availableCourses = filteredCourses.filter(course => course.status === 'active' || course.status === 'published');
    console.log('Available courses:', availableCourses); // Debug log for available courses

    return (
        <div className="max-w-[1600px] mx-auto px-4 py-6">
            {/* Header Section */}
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Courses
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage and organize your courses
                    </p>
                </div>

                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full sm:w-[300px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            className="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            <Filter className="h-4 w-4" />
                            Filter
                        </button>
                        
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Course
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {isLoadingCourses ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
            ) : (
                <div className="space-y-8">
                    {/* In Progress Courses Section */}
                    {inProgressCourses.length > 0 && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    In Progress
                                </h2>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {inProgressCourses.length} courses
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {inProgressCourses.map(course => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Available Courses Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Available Courses
                            </h2>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {availableCourses.length} courses
                            </span>
                        </div>
                        
                        {availableCourses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {availableCourses.map(course => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                                <div className="max-w-sm mx-auto">
                                    <div className="flex justify-center">
                                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                                            <Plus className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        </div>
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                        No courses available
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        Get started by creating your first course. Click the Add Course button above.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add Course Modal */}
            {/* Add Course Modal */}
{isModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="w-full max-w-6xl max-h-[95vh] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                <div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Add New Course
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Fill in the details to create a new course
                    </p>
                </div>
                <button
                    onClick={closeModal}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-8">
                        {/* Basic Information Section */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">1</span>
                                </div>
                                Basic Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Course Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Enter course title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="e.g., Web Development"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Subcategory
                                    </label>
                                    <input
                                        type="text"
                                        name="subcategory"
                                        value={formData.subcategory}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="e.g., React.js"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Level
                                    </label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Language
                                    </label>
                                    <select
                                        name="language"
                                        value={formData.language}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    >
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="totalDuration"
                                        value={formData.totalDuration}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="120"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Course Content Section */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                    <span className="text-green-600 dark:text-green-400 font-semibold text-sm">2</span>
                                </div>
                                Course Content
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Number of Lessons
                                    </label>
                                    <input
                                        type="number"
                                        name="lessons"
                                        value={formData.lessons}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Total Quizzes
                                    </label>
                                    <input
                                        type="number"
                                        name="totalQuizzes"
                                        value={formData.totalQuizzes}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Total Assignments
                                    </label>
                                    <input
                                        type="number"
                                        name="totalAssignments"
                                        value={formData.totalAssignments}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="99.99"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Descriptions Section */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                                    <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm">3</span>
                                </div>
                                Descriptions
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Short Description
                                    </label>
                                    <textarea
                                        name="shortDescription"
                                        value={formData.shortDescription}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                        placeholder="A brief overview of what students will learn..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Detailed course description..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Instructor & Media Section */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                                    <span className="text-orange-600 dark:text-orange-400 font-semibold text-sm">4</span>
                                </div>
                                Instructor & Media
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Instructor Name
                                    </label>
                                    <input
                                        type="text"
                                        name="instructorName"
                                        value={formData.instructorName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Instructor Image URL
                                    </label>
                                    <input
                                        type="url"
                                        name="instructorImage"
                                        value={formData.instructorImage}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="https://example.com/instructor.jpg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Course Thumbnail URL
                                    </label>
                                    <input
                                        type="url"
                                        name="thumbnail"
                                        value={formData.thumbnail}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="https://example.com/thumbnail.jpg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Course Features Section */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">5</span>
                                </div>
                                Course Features
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                    {Object.keys(formData.features).map((feature) => (
                                        <label key={feature} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name={feature}
                                                checked={formData.features[feature]}
                                                onChange={e => setFormData(prev => ({
                                                    ...prev,
                                                    features: { ...prev.features, [feature]: e.target.checked }
                                                }))}
                                                className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                            />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {feature.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Course Settings Section */}
                        <div>
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 dark:text-red-400 font-semibold text-sm">6</span>
                                </div>
                                Course Settings
                            </h4>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isFeatured"
                                            checked={formData.isFeatured}
                                            onChange={e => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Featured Course
                                        </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isBestseller"
                                            checked={formData.isBestseller}
                                            onChange={e => setFormData(prev => ({ ...prev, isBestseller: e.target.checked }))}
                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Bestseller
                                        </span>
                                    </label>
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="isFree"
                                            checked={formData.isFree}
                                            onChange={e => setFormData(prev => ({ ...prev, isFree: e.target.checked }))}
                                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Free Course
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center transition-colors"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    Create Course
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default Course;