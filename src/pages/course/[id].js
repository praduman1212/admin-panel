import React, { useState, useEffect } from 'react';
import { Star, Clock, Users, BookOpen, Award, Download, Smartphone, FileText, Trophy, CheckCircle, Play, Globe, Calendar, Tag } from 'lucide-react';
import { useRouter } from 'next/router';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CourseDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'courses', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCourseData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setCourseData(null);
        }
      } catch (error) {
        setCourseData(null);
      }
      setLoading(false);
    };
    fetchCourse();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!courseData) return <div>Course not found.</div>;

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price) => {
    const currency = courseData?.currency || 'USD'; // fallback to USD
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price ?? 0); // fallback to 0 if price is undefined
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
      />
    ));
  };

  const features = [
    { icon: Download, text: 'Downloadable Content', enabled: courseData.features?.downloadableContent },
    { icon: Smartphone, text: 'Mobile Access', enabled: courseData.features?.mobileAccess },
    { icon: FileText, text: 'Quizzes', enabled: courseData.features?.quizzes },
    { icon: Award, text: 'Certificate', enabled: courseData.features?.certificate },
    { icon: BookOpen, text: 'Assignments', enabled: courseData.features?.assignments },
    { icon: Trophy, text: 'Lifetime Access', enabled: courseData.features?.lifetimeAccess }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="md:flex">
            {/* Course Image */}
            <div className="md:w-1/3">
              <img 
                src={courseData.thumbnail || 'https://via.placeholder.com/400x300?text=Course+Image'} 
                alt={courseData.title || 'Course Image'}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            
            {/* Course Info */}
            <div className="md:w-2/3 p-6 md:p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {courseData.isNew && (
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                    New
                  </span>
                )}
                {courseData.isBestseller && (
                  <span className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
                    Bestseller
                  </span>
                )}
                {courseData.isFeatured && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {courseData.title || 'Untitled Course'}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {courseData.shortDescription || 'No short description available.'}
              </p>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(courseData.averageRating)}
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                    {courseData.averageRating} ({courseData.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {courseData.enrollmentCount?.toLocaleString() || '0'} students
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <img 
                    src={courseData.instructorImage || 'https://via.placeholder.com/40x40?text=Instructor'} 
                    alt={courseData.instructorName || 'Unknown Instructor'}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {courseData.instructorName || 'Unknown Instructor'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  {formatDuration(courseData.totalDuration)}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen className="w-4 h-4" />
                  {courseData.totalLessons} lessons
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatPrice(courseData.price)}
                  </span>
                  <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(courseData.originalPrice)}
                  </span>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-8 px-6">
                  {['overview', 'curriculum', 'instructor', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors duration-200 ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Course Description
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {courseData.description || 'No description available.'}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        What You'll Learn
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {courseData.learningOutcomes?.map((outcome, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-gray-300">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                        Requirements
                      </h3>
                      <ul className="space-y-2">
                        {courseData.requirements?.map((req, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600 dark:text-gray-300">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeTab === 'curriculum' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Course Curriculum
                    </h3>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((section) => (
                        <div key={section} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                          <div className="p-4 bg-gray-50 dark:bg-gray-750">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              Section {section}: React Fundamentals
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {Math.floor(Math.random() * 10) + 5} lessons • {Math.floor(Math.random() * 60) + 30} minutes
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'instructor' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      About the Instructor
                    </h3>
                    <div className="flex items-start gap-4">
                      <img 
                        src={courseData.instructorImage || 'https://via.placeholder.com/40x40?text=Instructor'} 
                        alt={courseData.instructorName || 'Unknown Instructor'}
                        className="w-16 h-16 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {courseData.instructorName || 'Unknown Instructor'}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 mt-2">
                          Experienced React developer with over 5 years of teaching experience. 
                          Passionate about helping students master modern web development.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Student Reviews
                    </h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((review) => (
                        <div key={review} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-gray-900 dark:text-white">Student {review}</span>
                                <div className="flex">{renderStars(5)}</div>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm">
                                Great course! Really helped me understand React concepts better.
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Course Features
              </h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <feature.icon className={`w-5 h-5 ${feature.enabled ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`text-sm ${feature.enabled ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Course Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Level</span>
                  <span className="text-gray-900 dark:text-white capitalize">{courseData.level || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="text-gray-900 dark:text-white">{formatDuration(courseData.totalDuration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Lessons</span>
                  <span className="text-gray-900 dark:text-white">{courseData.totalLessons || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Quizzes</span>
                  <span className="text-gray-900 dark:text-white">{courseData.totalQuizzes || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Assignments</span>
                  <span className="text-gray-900 dark:text-white">{courseData.totalAssignments || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Language</span>
                  <span className="text-gray-900 dark:text-white">{courseData.language || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;