// src/firebase/auth.ts
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import type { AdminUser } from '../types/admin.types';

// Convert Firebase User to AdminUser
const convertFirebaseUserToAdmin = async (firebaseUser: FirebaseUser): Promise<AdminUser | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || userData.name || 'Admin User',
        role: userData.role || 'admin',
        lastLogin: new Date()
      };
    }
    return null;
  } catch (error) {
    console.error('Error converting Firebase user to admin:', error);
    return null;
  }
};

// Admin login
export const loginAdmin = async (email: string, password: string): Promise<AdminUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const adminUser = await convertFirebaseUserToAdmin(userCredential.user);
    
    if (!adminUser) {
      throw new Error('User is not authorized as admin');
    }

    // Update last login
    await setDoc(doc(db, 'admins', userCredential.user.uid), {
      lastLogin: new Date(),
      email: userCredential.user.email,
      name: adminUser.name,
      role: adminUser.role
    }, { merge: true });

    return adminUser;
  } catch (error: any) {
    console.error('Admin login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

// Create admin user (for initial setup)
export const createAdminUser = async (email: string, password: string, name: string, role: 'admin' | 'super_admin' = 'admin'): Promise<AdminUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile
    await updateProfile(userCredential.user, { displayName: name });
    
    // Create admin document
    const adminData = {
      email,
      name,
      role,
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true
    };
    
    await setDoc(doc(db, 'admins', userCredential.user.uid), adminData);
    
    return {
      id: userCredential.user.uid,
      email,
      name,
      role,
      lastLogin: new Date()
    };
  } catch (error: any) {
    console.error('Create admin error:', error);
    throw new Error(error.message || 'Failed to create admin user');
  }
};

// Admin logout
export const logoutAdmin = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Admin logout error:', error);
    throw new Error(error.message || 'Logout failed');
  }
};

// Auth state listener
export const onAdminAuthStateChanged = (callback: (user: AdminUser | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const adminUser = await convertFirebaseUserToAdmin(firebaseUser);
      callback(adminUser);
    } else {
      callback(null);
    }
  });
};

// Check if user is authenticated admin
export const getCurrentAdmin = async (): Promise<AdminUser | null> => {
  const firebaseUser = auth.currentUser;
  if (firebaseUser) {
    return await convertFirebaseUserToAdmin(firebaseUser);
  }
  return null;
};

// Verify admin role
export const verifyAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const adminDoc = await getDoc(doc(db, 'admins', userId));
    return adminDoc.exists() && adminDoc.data()?.isActive === true;
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return false;
  }
};