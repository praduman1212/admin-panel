import React, { createContext, useContext, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    getDocs,
    serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from './Auth.context';
import { toast } from 'sonner';

const CourseContext = createContext();

export function CourseProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    // Create a new course
    const createCourse = async (courseData) => {
        if (!user) throw new Error('User must be authenticated');
        setIsLoading(true);
        try {
            // Compose all fields for Firestore
            const fullCourseData = {
                // Legacy/required fields for compatibility
                course_id: String(Date.now()),
                course_title: courseData.title,
                course_description: courseData.description,
                course_price: courseData.price,
                course_duration: courseData.duration,
                course_level: courseData.level,
                course_category: courseData.category,
                course_lessons: courseData.lessons || [],
                instructor_id: user.uid,
                instructor_name: user.displayName || user.email,
                created_at: serverTimestamp(),
                updated_at: serverTimestamp(),
                status: courseData.status || 'active',

                // All extra fields from the form
                subcategory: courseData.subcategory || '',
                originalPrice: courseData.originalPrice || '',
                shortDescription: courseData.shortDescription || '',
                metaTitle: courseData.metaTitle || '',
                metaDescription: courseData.metaDescription || '',
                language: courseData.language || 'en',
                features: courseData.features || {},
                requirements: courseData.requirements || [],
                learningOutcomes: courseData.learningOutcomes || [],
                tags: courseData.tags || [],
                totalQuizzes: courseData.totalQuizzes || 0,
                totalAssignments: courseData.totalAssignments || 0,
                totalDuration: courseData.totalDuration || 0,
                instructorImage: courseData.instructorImage || '',
                thumbnail: courseData.thumbnail || '',
                isFeatured: courseData.isFeatured || false,
                isBestseller: courseData.isBestseller || false,
                isFree: courseData.isFree || false,
                lastUpdated: courseData.lastUpdated || serverTimestamp(),
            };
            // Add course to Firestore
            const courseRef = await addDoc(collection(db, 'courses'), fullCourseData);
            toast.success('Course created successfully!');
            return courseRef.id;
        } catch (error) {
            console.error('Error creating course:', error);
            toast.error('Failed to create course');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Update an existing course
    const updateCourse = async (courseId, courseData) => {
        if (!user) throw new Error('User must be authenticated');
        
        setIsLoading(true);
        try {
            // Update course in Firestore
            const courseRef = doc(db, 'courses', courseId);
            await updateDoc(courseRef, {
                course_title: courseData.title,
                course_description: courseData.description,
                course_price: courseData.price,
                course_duration: courseData.duration,
                course_level: courseData.level,
                course_category: courseData.category,
                course_lessons: courseData.lessons || [],
                updated_at: serverTimestamp()
            });

            toast.success('Course updated successfully!');
        } catch (error) {
            console.error('Error updating course:', error);
            toast.error('Failed to update course');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Delete a course
    const deleteCourse = async (courseId) => {
        if (!user) throw new Error('User must be authenticated');
        
        setIsLoading(true);
        try {
            // Delete course from Firestore
            const courseRef = doc(db, 'courses', courseId);
            await deleteDoc(courseRef);
            
            toast.success('Course deleted successfully!');
        } catch (error) {
            console.error('Error deleting course:', error);
            toast.error('Failed to delete course');
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Get all courses
    const getAllCourses = async () => {
        try {
            const coursesRef = collection(db, 'courses');
            const querySnapshot = await getDocs(coursesRef);
            
            const courses = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data
                };
            });

            console.log('Processed courses:', courses); // Debug log
            return courses;
            
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error('Failed to fetch courses');
            throw error;
        }
    };

    // Get courses by instructor
    const getCoursesByInstructor = async (instructorId) => {
        try {
            const coursesRef = collection(db, 'courses');
            const q = query(coursesRef, where('instructor_id', '==', instructorId));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching instructor courses:', error);
            toast.error('Failed to fetch instructor courses');
            throw error;
        }
    };

    // Get course by ID
    const getCourseById = async (courseId) => {
        try {
            const courseRef = doc(db, 'courses', courseId);
            const courseSnap = await getDocs(courseRef);
            
            if (courseSnap.exists()) {
                return {
                    id: courseSnap.id,
                    ...courseSnap.data()
                };
            }
            return null;
        } catch (error) {
            console.error('Error fetching course:', error);
            toast.error('Failed to fetch course');
            throw error;
        }
    };

    // Get courses by category
    const getCoursesByCategory = async (category) => {
        try {
            const coursesRef = collection(db, 'courses');
            const q = query(coursesRef, where('course_category', '==', category));
            const querySnapshot = await getDocs(q);
            
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error fetching category courses:', error);
            toast.error('Failed to fetch category courses');
            throw error;
        }
    };

    return (
        <CourseContext.Provider value={{
            isLoading,
            createCourse,
            updateCourse,
            deleteCourse,
            getAllCourses,
            getCoursesByInstructor,
            getCourseById,
            getCoursesByCategory
        }}>
            {children}
        </CourseContext.Provider>
    );
}

export const useCourse = () => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error('useCourse must be used within a CourseProvider');
    }
    return context;
};