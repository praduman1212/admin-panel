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
            // Add course to Firestore
            const courseRef = await addDoc(collection(db, 'courses'), {
                course_id: String(Date.now()), // Generate a unique course ID
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
                status: 'active'
            });

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
                console.log('Course data from Firestore:', data); // Debug log
                return {
                    id: doc.id,
                    ...data,
                    // Ensure all required fields have default values
                    course_title: data.course_title || data.title || 'Untitled Course',
                    course_description: data.course_description || data.description || 'No description available',
                    course_category: data.course_category || data.category || 'Uncategorized',
                    course_level: data.course_level || data.level || 'All Levels',
                    course_duration: data.course_duration || data.duration || 'Not specified',
                    course_lessons: data.course_lessons || data.lessons || '0',
                    course_price: data.course_price || data.price || '0',
                    status: data.status || 'active'
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