import React from 'react';
import { Clock, Book, BarChart, Edit2, Trash2, MoreVertical } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCourse } from '@/context/Course.context';
import { useAuth } from '@/context/Auth.context';
import { toast } from 'sonner';
import { useRouter } from 'next/router';

const CourseCard = ({ course }) => {
    const { user } = useAuth();
    const { deleteCourse } = useCourse();
    const router = useRouter();
    console.log('Rendering course:', course); 
    // Ensure course object exists
    if (!course) {
        console.error('Course object is undefined or null');
        return null;
    }

    const isOwner = user?.uid === course.instructor_id;

    // Extract course data with fallbacks
    const {
        course_title = 'Untitled Course',
        course_description = 'No description available',
        course_category = 'Uncategorized',
        course_level = 'All Levels',
        course_duration = 'Not specified',
        course_lessons = '0',
        course_price = '0',
        thumbnail = 'https://via.placeholder.com/400x300?text=Course+Image'
    } = course;

    const handleDelete = async () => {
        try {
            if (window.confirm('Are you sure you want to delete this course?')) {
                await deleteCourse(course.id);
            }
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    const handleEdit = () => {
        toast.info('Edit functionality coming soon!');
    };

    return (
        <div
         onClick={() => router.push(`/course/${course.id}`)}
         className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full">
            {/* Course Image */}
            <div className="relative aspect-video w-full overflow-hidden">
                <img
                    src={"https://i.pinimg.com/originals/4c/75/fc/4c75fca1cdd8b648fab51ac8aaba6ef9.jpg"}
                    alt={course_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Course Status */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 text-xs font-medium bg-[#39b7f1] backdrop-blur-sm text-white rounded-lg">
                        {course_category}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-rose-500/75 backdrop-blur-sm text-white rounded-lg">
                        {course_level}
                    </span>
                </div>

                {/* Course Actions */}
                {isOwner && (
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="p-1 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors">
                                <MoreVertical className="w-5 h-5 text-white" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleEdit}>
                                    <Edit2 className="w-4 h-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    onClick={handleDelete}
                                    className="text-red-600 dark:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            {/* Course Content */}
            <div className="flex flex-col flex-grow p-4">
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {course_title}
                    </h3>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {course_description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{course_duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Book className="w-4 h-4 text-gray-400" />
                            <span>{course_lessons} lessons</span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${course_price}
                    </span>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                        Enroll Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
