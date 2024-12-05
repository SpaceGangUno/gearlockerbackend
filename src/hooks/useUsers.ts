import { useState, useEffect, useCallback } from 'react';
import { collection, query, onSnapshot, doc, updateDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { useAuthStore } from '../stores/authStore';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  createdAt: Date;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userRole } = useAuthStore();

  useEffect(() => {
    if (!userRole?.isAdmin) {
      setError('Unauthorized access');
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(
      q, 
      { includeMetadataChanges: true },
      (snapshot) => {
        if (snapshot.metadata.fromCache && !snapshot.metadata.hasPendingWrites) {
          console.log('Data retrieved from cache');
        }
        
        const userData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        })) as User[];
        setUsers(userData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userRole]);

  const updateUserRole = useCallback(async (userId: string, newRole: string) => {
    if (!userRole?.isAdmin) throw new Error('Unauthorized');
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { 
        role: newRole,
        updatedAt: new Date()
      });
    } catch (error: any) {
      console.error('Error updating role:', error);
      throw new Error(error.message || 'Failed to update role');
    }
  }, [userRole]);

  const addUser = useCallback(async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  }) => {
    if (!userRole?.isAdmin) throw new Error('Unauthorized');

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );

      // Create user document
      const userDoc = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', userCredential.user.uid), userDoc);
    } catch (error: any) {
      console.error('Error adding user:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak');
      }
      throw new Error(error.message || 'Failed to add user');
    }
  }, [userRole]);

  const refetch = useCallback(() => {
    setLoading(true);
  }, []);

  return {
    users,
    loading,
    error,
    updateUserRole,
    addUser,
    refetch
  };
};