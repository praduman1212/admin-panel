import React from 'react';
import { 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  BarChart2, 
  PlayCircle,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import Image from 'next/image';

const CourseCard = ({
  title = "Course Title",
  instructor = "Instructor Name",
  thumbnail,
  duration = "8 weeks",
  students = "0",
  rating = "0.0",
  level = "Beginner",
  progress,
  lessons = "12",
  category = "Development"
}) => {
  // Use a default placeholder image from a reliable source
  const imageUrl = thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800';

  // Determine the level badge color
  const levelColors = {
    Beginner: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Advanced: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
  };

  return (
    <div className="group bg-white dark:bg-[#232936] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-800">
      {/* Course Thumbnail */}
      <div className="relative aspect-video w-full bg-gray-200 dark:bg-gray-800">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white/90 dark:bg-gray-900/90 p-3 rounded-full transform hover:scale-110 transition-transform">
            <PlayCircle className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          </button>
        </div>

        {/* Category & Level Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2 py-1 text-xs font-medium bg-black/50 text-white rounded-lg backdrop-blur-sm">
            {category}
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded-lg ${levelColors[level]}`}>
            {level}
          </span>
        </div>

        {/* Progress Badge */}
        {progress && (
          <div className="absolute top-3 right-3 px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-lg">
            {progress} Complete
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            by {instructor}
          </p>
        </div>

        {/* Course Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            {duration}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <BookOpen className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            {lessons} lessons
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            {students} students
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Star className="w-4 h-4 mr-2 text-yellow-500" />
            {rating} rating
          </div>
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Your Progress</span>
              <span className="text-blue-600 dark:text-blue-500 font-medium">{progress}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: progress }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
            {progress ? (
              <>
                <PlayCircle className="w-4 h-4" />
                <span>Continue</span>
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4" />
                <span>Start Course</span>
              </>
            )}
          </button>
          {progress && (
            <button className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <BarChart2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
