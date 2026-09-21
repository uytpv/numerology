'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  credits: number;
  userData: any;
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
  'traphucvinhuy012022@gmail.com',
  'admin@lifemap.vn'
];

const AuthContext = createContext<AuthContextType>({
  user: null,
  credits: 0,
  userData: null,
  isAdmin: false,
  isCoach: false,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  grantAdminAccess: async () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(0);
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (currentUser) {
        try {
          const userEmail = (currentUser.email || '').toLowerCase();
          const isHardcodedAdmin = ADMIN_EMAILS.includes(userEmail) || userEmail.includes('vinhuy') || userEmail.includes('uytpv');

          // Kiểm tra / Tạo hồ sơ User trong Firestore nếu chưa có
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (!userDocSnap.exists()) {
            const initialRole = isHardcodedAdmin ? 'admin' : 'user';
            await setDoc(userDocRef, {
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              role: initialRole,
              credits: 0, // Bắt đầu từ 0 lượt, nạp bao nhiêu dùng bấy nhiêu
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          } else {
            const data = userDocSnap.data();
            // Tự động nâng cấp quyền Admin trong Firestore nếu là admin email (KHÔNG ghi đè credits)
            if (isHardcodedAdmin && data?.role !== 'admin') {
              await setDoc(userDocRef, { role: 'admin' }, { merge: true });
            }

            // Tự sửa lỗi: Nếu tài khoản từng bị gán nhầm 9999 credits, tự động tính lại credits theo đúng số giao dịch đã thanh toán (PAID)
            if (data?.credits === 9999) {
              try {
                const qPaid = query(
                  collection(db, 'orders'),
                  where('userId', '==', currentUser.uid),
                  where('status', '==', 'PAID')
                );
                const paidSnap = await getDocs(qPaid);
                let realCredits = 0;
                paidSnap.forEach(d => {
                  realCredits += (d.data().creditsGranted || 1);
                });
                await setDoc(userDocRef, { credits: realCredits }, { merge: true });
              } catch (recErr) {
                console.warn('Không thể tự động khôi phục credits:', recErr);
              }
            }
          }

          // LẮNG NGHE REALTIME THAY ĐỔI CỦA USER DOCUMENT (ĐẶC BIỆT LÀ CREDITS VÀ ROLE)
          unsubscribeSnapshot = onSnapshot(userDocRef, (snap) => {
            if (snap.exists()) {
              const d = snap.data();
              const cr = typeof d?.credits === 'number' ? d.credits : 0;
              setCredits(cr);
              setUserData({ id: snap.id, ...d });
              
              const hasAdminRole = d?.role === 'admin' || isHardcodedAdmin;
              setIsAdmin(hasAdminRole);
              setIsCoach(d?.role === 'coach' || hasAdminRole || !!d?.isCoach);
            }
          }, (err) => {
            console.error('Lỗi onSnapshot users:', err);
          });

        } catch (error) {
          console.error('Lỗi khi đọc/ghi thông tin người dùng từ Firestore:', error);
          const userEmail = (currentUser.email || '').toLowerCase();
          const isHardcodedAdmin = ADMIN_EMAILS.includes(userEmail) || userEmail.includes('vinhuy') || userEmail.includes('uytpv');
          setIsAdmin(isHardcodedAdmin);
          setIsCoach(isHardcodedAdmin);
        }
      } else {
        setCredits(0);
        setUserData(null);
        setIsAdmin(false);
        setIsCoach(false);
      }
      
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
      }
    };
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
    <AuthContext.Provider value={{ user, credits, userData, isAdmin, isCoach, loading, loginWithGoogle, logout, grantAdminAccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
