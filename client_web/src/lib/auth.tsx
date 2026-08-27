'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isCoach: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  grantAdminAccess: () => Promise<boolean>;
}

const ADMIN_EMAILS = [
  'traphucvinhuy@gmail.com',
  'uytpv@gmail.com',
  'admin@numerology.vn',
  'admin@lifemaps.vn',
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  isCoach: false,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  grantAdminAccess: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userEmail = (currentUser.email || '').toLowerCase();
          const isHardcodedAdmin = ADMIN_EMAILS.includes(userEmail) || userEmail.includes('vinhuy') || userEmail.includes('uytpv');

          // Kiểm tra / Tạo hồ sơ User trong Firestore
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (!userDocSnap.exists()) {
            const initialRole = isHardcodedAdmin ? 'admin' : 'user';
            await setDoc(userDocRef, {
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: initialRole,
              credits: isHardcodedAdmin ? 9999 : 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            setIsAdmin(isHardcodedAdmin);
            setIsCoach(isHardcodedAdmin);
          } else {
            const data = userDocSnap.data();
            const hasAdminRole = data?.role === 'admin' || isHardcodedAdmin;
            
            // Tự động nâng cấp quyền Admin trong Firestore nếu là admin email
            if (isHardcodedAdmin && data?.role !== 'admin') {
              await setDoc(userDocRef, { role: 'admin', credits: 9999 }, { merge: true });
            }

            setIsAdmin(hasAdminRole);
            setIsCoach(data?.role === 'coach' || hasAdminRole || !!data?.isCoach);
          }
        } catch (error) {
          console.error('Lỗi khi đọc/ghi thông tin người dùng từ Firestore:', error);
          // Fallback check email
          const userEmail = (currentUser.email || '').toLowerCase();
          const isHardcodedAdmin = ADMIN_EMAILS.includes(userEmail) || userEmail.includes('vinhuy') || userEmail.includes('uytpv');
          setIsAdmin(isHardcodedAdmin);
          setIsCoach(isHardcodedAdmin);
        }
      } else {
        setIsAdmin(false);
        setIsCoach(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const grantAdminAccess = async (): Promise<boolean> => {
    if (!user) return false;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { role: 'admin', credits: 9999, updatedAt: new Date().toISOString() }, { merge: true });
      setIsAdmin(true);
      setIsCoach(true);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.error('Lỗi đăng nhập Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isCoach, loading, loginWithGoogle, logout, grantAdminAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
