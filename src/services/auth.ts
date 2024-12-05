import { 
  signInWithEmailAndPassword as firebaseSignIn,
  signOut as firebaseSignOut,
  User,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export interface UserRole {
  isAdmin: boolean;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
}

export const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await firebaseSignIn(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

export const getUserRole = async (userId: string): Promise<UserRole> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      const defaultUserData = {
        email: auth.currentUser?.email,
        role: 'EMPLOYEE',
        firstName: 'User',
        lastName: '',
        createdAt: new Date()
      };
      
      try {
        await setDoc(doc(db, 'users', userId), defaultUserData);
      } catch (error: any) {
        if (error.code === 'unavailable') {
          return { isAdmin: false, role: 'EMPLOYEE' };
        }
        console.error('Error creating user document:', error);
      }
      
      return { isAdmin: false, role: 'EMPLOYEE' };
    }
    
    const userData = userDoc.data();
    return {
      isAdmin: userData.role === 'ADMIN',
      role: userData.role || 'EMPLOYEE'
    };
  } catch (error: any) {
    if (error.code === 'unavailable') {
      return { isAdmin: false, role: 'EMPLOYEE' };
    }
    throw error;
  }
};

export const initializeAuth = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, callback);
};