'use client'
import CourseCard from '@/components/Coursecard';
import React, { useState } from 'react'

const course = () => {
    const courseTopics = [
        {
            title: 'Web Development',
            image: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=800',
            levels: ['Beginner', 'Intermediate', 'Advanced'],
            category: 'Development'
        },
        {
            title: 'JavaScript Mastery',
            image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=800',
            levels: ['Beginner', 'Intermediate', 'Advanced'],
            category: 'Programming'
        },
        {
            title: 'UI/UX Design',
            image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=800',
            levels: ['Beginner', 'Intermediate'],
            category: 'Design'
        },
        {
            title: 'React & Next.js',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800',
            levels: ['Intermediate', 'Advanced'],
            category: 'Development'
        },
        {
            title: 'Python Programming',
            image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?q=80&w=800',
            levels: ['Beginner', 'Advanced'],
            category: 'Programming'
        },
        {
            title: 'Data Science',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
            levels: ['Intermediate', 'Advanced'],
            category: 'Data'
        },
        {
            title: 'Mobile App Development',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800',
            levels: ['Beginner', 'Intermediate', 'Advanced'],
            category: 'Development'
        },
        {
            title: 'Machine Learning',
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800',
            levels: ['Advanced'],
            category: 'AI'
        }
    ];
    const [courses] = useState(courseTopics);
    const inProgressCourses = courses.filter(course => course.progress);
    const notStartedCourses = courses.filter(course => !course.progress);
    return (
        <div>
            {inProgressCourses.length > 0 && (
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Continue Learning
                        </h2>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {inProgressCourses.length} in progress
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {inProgressCourses.map((course, index) => (
                            <CourseCard key={`in-progress-${index}`} {...course} />
                        ))}
                    </div>
                </div>
            )}

            {/* Available Courses Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Available Courses
                    </h2>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {notStartedCourses.length} courses available
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {notStartedCourses.map((course, index) => (
                        <CourseCard key={`not-started-${index}`} {...course} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default course