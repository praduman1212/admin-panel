import React from 'react';
import Image from 'next/image';
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

import { useState } from 'react';

const CourseCard = ({ course }) => {
    const { user } = useAuth();
    const { deleteCourse } = useCourse();
    const router = useRouter();
    const [showShare, setShowShare] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [heartClicked, setHeartClicked] = useState(false);

    console.log('Rendering course:', course); 
    // Share logic
    const handleShareClick = (e) => {
        e.stopPropagation();
        setShowShare((prev) => !prev);
    };

    const handleCopyLink = async (e) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/course/${course.id}`);
            toast.success('Course link copied!');
            setShowShare(false);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    // Favorite logic with special effect
    const handleFavorite = (e) => {
        e.stopPropagation();
        setIsFavorite((prev) => !prev);
        setHeartClicked(true);
        setTimeout(() => setHeartClicked(false), 400); // Reset effect after animation
    };

    // Ensure course object exists
    if (!course) {
        console.error('Course object is undefined or null');
        return null;
    }

    const isOwner = user?.uid === course.instructor_id;

    // Extract course data with support for both new and legacy field names
    const {
        // New field names
        ['course-title']: courseTitle,
        ['course-description']: courseDescription,
        ['course-category']: courseCategory,
        ['course-duration']: courseDuration,
        ['course-lessons']: courseLessons,
        ['course-price']: coursePrice,
        ['course-thumbnailUrl']: courseThumbnailUrl,
        ['preview-link']: previewLink,
        // Legacy field names as fallback
        course_title,
        course_description,
        course_category,
        course_duration,
        course_lessons,
        course_price,
        thumbnail,
        preview_link
    } = course;

    // Use new fields if present, otherwise fallback to legacy
    const displayTitle = courseTitle || course_title || 'Untitled Course';
    const displayDescription = courseDescription || course_description || 'No description available';
    const displayCategory = courseCategory || course_category || 'Uncategorized';
    const displayDuration = courseDuration || course_duration || 'Not specified';
    const displayLessons = courseLessons || course_lessons || '0';
    const displayPrice = coursePrice || course_price || '0';
    const displayThumbnail = courseThumbnailUrl || thumbnail || 'https://via.placeholder.com/400x300?text=Course+Image';
    const displayPreviewLink = previewLink || preview_link || '';

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
        <div>
            {/* Card Body */}
            <div
                onClick={() => router.push(`/course/${course.id}`)}
                className="group cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-full"
            >
                {/* Course Image */}
                <div className="relative aspect-video w-full overflow-hidden">
                    <img
                        src={displayThumbnail}
                        alt={displayTitle}
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ objectFit: 'cover' }}
                        priority={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Course Status */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        <span className="px-2 py-1 text-xs font-medium bg-[#39b7f1] backdrop-blur-sm text-white rounded-lg">
                            {displayCategory}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-rose-500/75 backdrop-blur-sm text-white rounded-lg">
                            All Levels
                        </span>
                    </div>
                    {isOwner && (
                        <div className="absolute top-12 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                            {displayTitle}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {displayDescription}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{displayDuration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Book className="w-4 h-4 text-gray-400" />
                                <span>{displayLessons} lessons</span>
                            </div>
                        </div>
                        {/* Preview Link */}
                        {displayPreviewLink && (
                            <div className="mt-2">
                                <a
                                    href={displayPreviewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                >
                                    Preview Course
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ${displayPrice}
                        </span>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                            Enroll Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CourseCard;
