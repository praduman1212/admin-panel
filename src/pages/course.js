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
        'course-title': '',
        'course-category': '',
        'course-description': '',
        'course-duration': '',
        'course-instructor': '',
        'course-lessons': '',
        'course-assignments': '',
        'course-quizess': '',
        'course-price': '',
        'course-thumbnailUrl': '',
        'preview-link': '',
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

        if (!formData['course-title'].trim()) {
            toast.error('Course title is required');
            return;
        }
        if (!formData['course-category'].trim()) {
            toast.error('Category is required');
            return;
        }

        setIsSubmitting(true);
        try {
            // Create course with all available fields
            await createCourse({
                'course-title': formData['course-title'],
                'course-category': formData['course-category'],
                'course-description': formData['course-description'],
                'course-duration': formData['course-duration'],
                'course-instructor': formData['course-instructor'],
                'course-lessons': formData['course-lessons'],
                'course-assignments': formData['course-assignments'],
                'course-quizess': formData['course-quizess'],
                'course-price': formData['course-price'],
                'course-thumbnailUrl': formData['course-thumbnailUrl'],
                'preview-link': formData['preview-link'],
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
            'course-title': '',
            'course-category': '',
            'course-description': '',
            'course-duration': '',
            'course-instructor': '',
            'course-lessons': '',
            'course-assignments': '',
            'course-quizess': '',
            'course-price': '',
            'course-thumbnailUrl': '',
            'preview-link': '',
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetForm();
    };


    // Sorting state for filter
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');

    // Sorting logic
    const getSortedCourses = (list) => {
        if (!sortField) return list;
        const sorted = [...list].sort((a, b) => {
            let aValue, bValue;
            switch (sortField) {
                case 'title':
                    aValue = (a['course-title'] || '').toLowerCase();
                    bValue = (b['course-title'] || '').toLowerCase();
                    break;
                case 'created_at':
                    aValue = a.created_at?.seconds ? a.created_at.seconds : new Date(a.created_at || 0).getTime();
                    bValue = b.created_at?.seconds ? b.created_at.seconds : new Date(b.created_at || 0).getTime();
                    break;
                case 'rating':
                    aValue = parseFloat(a.rating || a['course-rating'] || 0);
                    bValue = parseFloat(b.rating || b['course-rating'] || 0);
                    break;
                case 'price':
                    aValue = parseFloat(a['course-price'] || 0);
                    bValue = parseFloat(b['course-price'] || 0);
                    break;
                default:
                    aValue = '';
                    bValue = '';
            }
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    };

    // Only search filter
    const filteredCourses = courses?.filter(course => {
        return (
            (course['course-title'] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course['course-category'] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course['course-description'] || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    }) || [];


    // For now, treat all as available (no status field)
    const availableCourses = filteredCourses;
    const inProgressCourses = [];

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
                        onClick={() => setFilterModalOpen(true)}
                        className="px-4 py-2 flex items-center gap-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <Filter className="h-4 w-4" />
                        Sort
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 flex items-center gap-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Add Course
                    </button>
                </div>
            {/* Sort Modal */}
            {filterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="w-full max-w-xs bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sort Courses</h3>
                            <button onClick={() => setFilterModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort by</label>
                                <select
                                    value={sortField + (sortOrder === 'desc' ? '-desc' : '')}
                                    onChange={e => {
                                        const val = e.target.value;
                                        if (val.endsWith('-desc')) {
                                            setSortField(val.replace('-desc', ''));
                                            setSortOrder('desc');
                                        } else {
                                            setSortField(val);
                                            setSortOrder('asc');
                                        }
                                    }}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <optgroup label="Title">
                                        <option value="title">A-Z</option>
                                        <option value="title-desc">Z-A</option>
                                    </optgroup>
                                    <optgroup label="Date">
                                        <option value="created_at">Newest</option>
                                        <option value="created_at-desc">Oldest</option>
                                    </optgroup>
                                    <optgroup label="Rating">
                                        <option value="rating">High-Low</option>
                                        <option value="rating-desc">Low-High</option>
                                    </optgroup>
                                    <optgroup label="Cost">
                                        <option value="price">Low-High</option>
                                        <option value="price-desc">High-Low</option>
                                    </optgroup>
                                    <option value="">Default</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                onClick={() => {
                                    setSortField('');
                                    setSortOrder('asc');
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => setFilterModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                                {getSortedCourses(availableCourses).map(course => (
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
                                        name="course-title"
                                        value={formData['course-title']}
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
                                        name="course-category"
                                        value={formData['course-category']}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="e.g., Web Development"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="course-description"
                                        value={formData['course-description']}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                                        placeholder="Detailed course description..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        name="course-duration"
                                        value={formData['course-duration']}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="120"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Instructor
                                    </label>
                                    <input
                                        type="text"
                                        name="course-instructor"
                                        value={formData['course-instructor']}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Lessons
                                    </label>
                                    <input
                                        type="number"
                                        name="course-lessons"
                                        value={formData['course-lessons']}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="10"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Assignments
                                    </label>
                                    <input
                                        type="number"
                                        name="course-assignments"
                                        value={formData['course-assignments']}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Quizzes
                                    </label>
                                    <input
                                        type="number"
                                        name="course-quizess"
                                        value={formData['course-quizess']}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="course-price"
                                        value={formData['course-price']}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="99.99"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Thumbnail URL
                                    </label>
                                    <input
                                        type="url"
                                        name="course-thumbnailUrl"
                                        value={formData['course-thumbnailUrl']}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="https://example.com/thumbnail.jpg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Preview Link
                                    </label>
                                    <input
                                        type="url"
                                        name="preview-link"
                                        value={formData['preview-link']}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="https://example.com/preview"
                                    />
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