import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBDjDbnVLM6yUtDUl0pKpJf7aRfxTEVhPY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "numerology-330e9.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "numerology-330e9",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "numerology-330e9.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "271833886691",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:271833886691:web:c1fb1570ae336d2c62bad6"
};

// Khởi tạo Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Tự động kết nối vào các cổng Emulator cục bộ ở môi trường phát triển local nếu cấu hình cho phép
const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR !== 'false';

if (useEmulator && typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
  // Tránh việc kết nối lặp lại gây lỗi của SDK
  if (!(auth as any)._emulatorActivated) {
    console.log('--- NEXT.JS ĐANG KẾT NỐI FIREBASE AUTH EMULATOR ---');
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    (auth as any)._emulatorActivated = true;
  }
  
  if (!(db as any)._emulatorActivated) {
    console.log('--- NEXT.JS ĐANG KẾT NỐI FIRESTORE EMULATOR ---');
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    (db as any)._emulatorActivated = true;
  }
}

export { app, auth, db };
