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
        level: 'Beginner',
        duration: '',
        lessons: '',
        price: '',
        description: ''
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
            await createCourse({
                title: formData.title,
                description: formData.description,
                category: formData.category,
                level: formData.level,
                duration: formData.duration,
                price: formData.price,
                lessons: formData.lessons || []
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
            level: 'Beginner',
            duration: '',
            lessons: '',
            price: '',
            description: ''
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
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-500 bg-opacity-75">
                    <div className="min-h-screen px-4 text-center">
                        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
                        <div className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Add New Course
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Course Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Level
                                    </label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                                    >
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 8 weeks"
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Number of Lessons
                                    </label>
                                    <input
                                        type="number"
                                        name="lessons"
                                        value={formData.lessons}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Price
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="e.g., $99.99"
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm"
                                    />
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            'Create Course'
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