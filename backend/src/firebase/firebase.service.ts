import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private firebaseApp: any;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const isDev = this.configService.get<string>('NODE_ENV') === 'development';
    
    // Nếu chạy ở chế độ Development và có biến môi trường Emulator
    if (isDev) {
      console.log('--- CHẠY TRÊN HỆ THỐNG EMULATOR ---');
      process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
      process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
      
      this.firebaseApp = admin.initializeApp({
        projectId: 'numerology-app-dev',
      });
    } else {
      console.log('--- CHẠY TRÊN HỆ THỐNG PRODUCTION (FIREBASE CLOUD) ---');
      
      const serviceAccountPath = this.configService.get<string>('FIREBASE_CONFIG_PATH');
      if (serviceAccountPath) {
        this.firebaseApp = admin.initializeApp({
          credential: (admin as any).credential.cert(serviceAccountPath),
        });
      } else {
        this.firebaseApp = admin.initializeApp();
      }
    }
  }

  db(): any {
    return (admin as any).firestore();
  }

  auth(): any {
    return (admin as any).auth();
  }
}
