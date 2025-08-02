import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { toast } from 'sonner';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.data();

          setUser({
            uid: firebaseUser.uid,
            name: userData?.name || firebaseUser.displayName || "User",
            email: firebaseUser.email,
            phone: userData?.phone || "",
            role: userData?.role || "student",
            photoURL: userData?.photoURL || firebaseUser.photoURL,
            provider: userData?.provider || "password",
            emailVerified: firebaseUser.emailVerified,
            isActive: userData?.isActive ?? true,
            createdAt: userData?.createdAt || new Date(),
            updatedAt: userData?.updatedAt || new Date()
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to basic user data
          setUser({
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || "User",
            email: firebaseUser.email,
            role: "student",
            photoURL: firebaseUser.photoURL,
            provider: "password",
            emailVerified: firebaseUser.emailVerified,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, name, phone) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Save additional user data to Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        phone,
        role: "student",
        provider: "password",
        photoURL: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return userCredential.user;
    } catch (error) {
      setIsLoading(false);
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      setIsLoading(false);
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Create new user document for Google sign-in
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          phone: "",
          role: "student",
          provider: "google",
          photoURL: userCredential.user.photoURL,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      return userCredential.user;
    } catch (error) {
      setIsLoading(false);
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw new Error("Failed to sign out");
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(getFirebaseErrorMessage(error.code));
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) throw new Error("No user logged in");

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      }, { merge: true });

      // Update Firebase Auth profile if name or avatar (photoURL) changed
      const profileUpdates = {};
      if (updates.name) profileUpdates.displayName = updates.name;
      if (updates.avatar) profileUpdates.photoURL = updates.avatar;
      if (Object.keys(profileUpdates).length > 0) {
        await updateProfile(auth.currentUser, profileUpdates);
      }

      // Update local state
      setUser(prev => ({
        ...prev,
        ...updates,
        photoURL: updates.avatar || prev.photoURL,
        updatedAt: new Date()
      }));
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signUp,
    login,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper function to convert Firebase error codes to user-friendly messages
const getFirebaseErrorMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No account found with this email address";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    case "auth/email-already-in-use":
      return "An account with this email already exists";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later";
    case "auth/network-request-failed":
      return "Network error. Please check your connection";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled";
    case "auth/operation-not-allowed":
      return "This sign-in method is not enabled. Please contact support";
    default:
      return "An error occurred. Please try again";
  }
};
