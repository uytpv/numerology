jest.mock('firebase-admin/auth', () => ({
  getAuth: jest.fn(),
}));
jest.mock('firebase-admin/firestore', () => ({
  getFirestore: jest.fn(),
  FieldValue: { increment: jest.fn() },
}));
jest.mock('firebase-admin/app', () => ({
  initializeApp: jest.fn(),
  getApps: jest.fn(() => []),
  cert: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { SePayService } from './sepay.service';
import { FirebaseService } from '../firebase/firebase.service';
import { PaymentService } from './payment.service';

describe('SePayService Webhook Security & Processing', () => {
  let service: SePayService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'SEPAY_SECRET_KEY') return 'TEST_SEPAY_SECRET_KEY_123';
      return null;
    }),
  };

  const mockFirebaseService = {
    db: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(),
          update: jest.fn(),
        })),
        add: jest.fn(),
      })),
    })),
  };

  const mockPaymentService = {
    processSuccessfulOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SePayService,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: FirebaseService, useValue: mockFirebaseService },
        { provide: PaymentService, useValue: mockPaymentService },
      ],
    }).compile();

    service = module.get<SePayService>(SePayService);
  });

  describe('verifyWebhookAuth()', () => {
    it('should return false if authHeader is missing or undefined', () => {
      expect(service.verifyWebhookAuth(undefined)).toBe(false);
      expect(service.verifyWebhookAuth('')).toBe(false);
    });

    it('should return false if authHeader contains wrong secret key', () => {
      expect(service.verifyWebhookAuth('Apikey WRONG_KEY')).toBe(false);
      expect(service.verifyWebhookAuth('Bearer WRONG_KEY')).toBe(false);
    });

    it('should return true for valid Apikey and Bearer formats', () => {
      expect(service.verifyWebhookAuth('Apikey TEST_SEPAY_SECRET_KEY_123')).toBe(true);
      expect(service.verifyWebhookAuth('Bearer TEST_SEPAY_SECRET_KEY_123')).toBe(true);
      expect(service.verifyWebhookAuth('TEST_SEPAY_SECRET_KEY_123')).toBe(true);
    });
  });

  describe('extractOrderCode()', () => {
    it('should extract TSH followed by 6 digits from raw bank transaction content', () => {
      expect(service.extractOrderCode('CHUYEN TIEN TSH123456 NGUYEN VAN A')).toBe('TSH123456');
      expect(service.extractOrderCode('tsh998877 thanh toan don hang')).toBe('TSH998877');
      expect(service.extractOrderCode('MBVCB.1234567.TSH654321.CT TU 0123')).toBe('TSH654321');
    });

    it('should return null when no TSH code is found', () => {
      expect(service.extractOrderCode('CHUYEN TIEN KHONG CO MA DON')).toBeNull();
      expect(service.extractOrderCode('TSH123')).toBeNull(); // Less than 6 digits
      expect(service.extractOrderCode('')).toBeNull();
    });
  });

  describe('processWebhook() Security Gate', () => {
    it('should reject and throw UnauthorizedException when secret key is invalid or missing', async () => {
      const payload: any = {
        id: 1001,
        gateway: 'ACB',
        transferType: 'in',
        transferAmount: 39000,
        content: 'TSH123456',
      };

      await expect(service.processWebhook(payload, 'Apikey WRONG_KEY')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
