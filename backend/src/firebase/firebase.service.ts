import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: App;
  private firestoreDb: Firestore;
  private authInstance: Auth;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    
    // Nếu chạy ở chế độ Development và có biến môi trường Emulator
    if (isDev) {
      console.log('--- CHẠY TRÊN HỆ THỐNG EMULATOR ---');
      process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
      
      this.firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp({
        projectId: 'numerology-app-dev',
      });
    } else {
      console.log('--- CHẠY TRÊN HỆ THỐNG PRODUCTION (FIREBASE CLOUD) ---');
      
      const serviceAccountPath = this.configService.get<string>('FIREBASE_CONFIG_PATH');
      if (getApps().length > 0) {
        this.firebaseApp = getApps()[0];
      } else if (serviceAccountPath) {
        this.firebaseApp = initializeApp({
          credential: cert(serviceAccountPath),
          projectId: 'numerology-372119',
        });
      } else {
        this.firebaseApp = initializeApp({
          projectId: 'numerology-372119',
        });
      }
    }

    this.firestoreDb = getFirestore(this.firebaseApp);
    this.authInstance = getAuth(this.firebaseApp);
  }

  db(): Firestore {
    if (!this.firestoreDb) {
      this.firestoreDb = getFirestore(this.firebaseApp || (getApps().length > 0 ? getApps()[0] : initializeApp({ projectId: 'numerology-372119' })));
    }
    return this.firestoreDb;
  }

  auth(): Auth {
    if (!this.authInstance) {
      this.authInstance = getAuth(this.firebaseApp || (getApps().length > 0 ? getApps()[0] : initializeApp({ projectId: 'numerology-372119' })));
    }
    return this.authInstance;
  }
}
