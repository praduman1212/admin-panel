import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Star, Clock, Users, BookOpen, Award, Download, Smartphone, FileText, Trophy, CheckCircle, Play, Globe, Calendar, Tag, ArrowLeft, Heart, Share2, User, DollarSign, BarChart3, PlayCircle, Monitor, Zap, Shield, Headphones, Database, Code, Coffee, Target, Lightbulb, Flame, Sparkles, Image, Video, MessageSquare, GraduationCap } from 'lucide-react';

const CourseDetails = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareClicked, setShareClicked] = useState(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'ncourse', id);
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

  // Helper functions
  const getField = (obj, keys, fallback = '') => {
    for (const key of keys) {
      if (obj && obj[key] !== undefined && obj[key] !== null && obj[key] !== '') return obj[key];
    }
    return fallback;
  };

  const formatDuration = (minutes) => {
    const num = parseInt(minutes);
    if (isNaN(num)) return minutes;
    const hours = Math.floor(num / 60);
    const mins = num % 60;
    if (hours === 0) return `${mins} min`;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price) => {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const formatNumber = (num) => {
    const number = parseInt(num);
    if (isNaN(number)) return num;
    return number.toLocaleString();
  };

  // Get field values with proper fallbacks
  const title = getField(courseData, ['course-title', 'title'], 'Untitled Course');
  const description = getField(courseData, ['course-description', 'description'], 'No description available');
  const instructor = getField(courseData, ['course-instructor', 'instructor'], 'Unknown Instructor');
  const category = getField(courseData, ['course-category', 'category'], 'General');
  const duration = getField(courseData, ['course-duration', 'duration'], '0');
  const lessons = getField(courseData, ['course-lessons', 'lessons'], '0');
  const price = getField(courseData, ['course-price', 'price'], '0');
  const assignments = getField(courseData, ['course-assignments', 'assignments'], '0');
  const quizzes = getField(courseData, ['course-quizzes', 'quizzes'], '0');
  const thumbnailUrl = getField(courseData, ['course-thumbnailUrl', 'thumbnailUrl', 'thumbnail'], '');
  const previewLink = getField(courseData, ['preview-link', 'preview_link'], '');

  const handleShareClick = () => {
    setShowShare((prev) => !prev);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareClicked(true);
      setTimeout(() => setShareClicked(false), 400);
      setShowShare(false);
    } catch {
      // Optionally show error
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The course you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'content', label: 'Content', icon: PlayCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-300">
      <div className="max-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
            onClick={() => router.push('/course')}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Courses</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {/* Course Thumbnail */}
              {thumbnailUrl && (
                <div className="relative h-64 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img 
                    src={thumbnailUrl} 
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center space-x-2 text-white">
                      <Tag className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">{category}</span>
                    </div>
                  </div>
                  {/* Fallback for broken image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white hidden">
                    <Video className="w-16 h-16 opacity-50" />
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 capitalize">
                      {title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                      {description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 ml-6">
                    <button
                      onClick={() => setIsBookmarked(!isBookmarked)}
                      className={`p-2 rounded-full border-2 transition-all ${
                        isBookmarked 
                          ? 'bg-red-500 border-red-500 text-white animate-heart-pop' 
                          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500'
                      }`}
                    >
                      <Heart className="w-5 h-5" />
                    </button>
                    <div className="relative">
                      <button
                        className={`p-2 rounded-full border-2 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all ${shareClicked ? 'animate-share-pop' : ''}`}
                        onClick={handleShareClick}
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                      {showShare && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                          <button
                            onClick={handleCopyLink}
                            className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg flex items-center gap-2"
                          >
                            Copy Link
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                    <PlayCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(lessons)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Lessons</div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(assignments)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Assignments</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                    <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(quizzes)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Quizzes</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg text-center">
                    <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{formatDuration(duration)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{instructor}</p>
                  </div>
                </div>

                {/* Course ID */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Database className="w-4 h-4" />
                    <span>Course ID: {courseData.id}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Overview</h3>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {description}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What's Included</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                          <span className="text-gray-700 dark:text-gray-300">{formatNumber(lessons)} Video Lessons</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                          <span className="text-gray-700 dark:text-gray-300">{formatNumber(assignments)} Practice Assignments</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                          <span className="text-gray-700 dark:text-gray-300">{formatNumber(quizzes)} Knowledge Quizzes</span>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
                          <span className="text-gray-700 dark:text-gray-300">Certificate of Completion</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'content' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Content</h3>
                      <div className="space-y-4">
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h4 className="font-medium text-gray-900 dark:text-white">Video Lessons</h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {formatNumber(lessons)} lessons • {formatDuration(duration)} total
                          </p>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Comprehensive video content covering all aspects of {category}
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <h4 className="font-medium text-gray-900 dark:text-white">Assignments</h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {formatNumber(assignments)} practical assignments
                          </p>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Hands-on exercises to reinforce your learning
                          </div>
                        </div>
                        
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center space-x-3 mb-3">
                            <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            <h4 className="font-medium text-gray-900 dark:text-white">Quizzes</h4>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {formatNumber(quizzes)} knowledge assessments
                          </p>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Test your understanding with interactive quizzes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Raw data tab removed */}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Pricing Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {formatPrice(price)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      One-time payment
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 mb-3">
                    Enroll Now
                  </button>
                  
                  <a
                    href={previewLink || '#'}
                    target={previewLink ? '_blank' : undefined}
                    rel={previewLink ? 'noopener noreferrer' : undefined}
                    className={`w-full block border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 font-medium py-3 px-6 rounded-lg transition-all duration-200 text-center ${previewLink ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                    aria-disabled={!previewLink}
                  >
                    Preview Course
                  </a>
                </div>

                {/* Course Features */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">This course includes:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{formatNumber(lessons)} video lessons</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{formatNumber(assignments)} assignments</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{formatNumber(quizzes)} quizzes</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Mobile access</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Lifetime access</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Course Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatDuration(duration)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Instructor</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{instructor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Content</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {parseInt(lessons) + parseInt(assignments) + parseInt(quizzes)} items
                    </span>
                  </div>
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