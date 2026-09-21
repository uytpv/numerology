import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { AIService } from './ai.service';

describe('AIService - Hardened AI Synthesis', () => {
  it('should throw InternalServerErrorException when GEMINI_API_KEY is not configured', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(null),
          },
        },
      ],
    }).compile();

    const service = module.get<AIService>(AIService);

    await expect(
      service.generatePersonalizedReport({
        fullName: 'Nguyễn Văn An',
        dob: '15/08/1990',
        map: { life_path: 8, expression: 1 },
        tier: 3,
      })
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException when Gemini API call fails (No Silent Fallback)', async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AIService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'GEMINI_API_KEY') return 'test_key';
              if (key === 'GEMINI_MODEL') return 'gemini-3.6-flash';
              return null;
            }),
          },
        },
      ],
    }).compile();

    const service = module.get<AIService>(AIService);

    (service as any).genAI = {
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockRejectedValue(new Error('402 Payment Required: Your prepayment credits are depleted')),
      }),
    };

    await expect(
      service.generatePersonalizedReport({
        fullName: 'Nguyễn Văn An',
        dob: '15/08/1990',
        map: { life_path: 8, expression: 1 },
        tier: 3,
      })
    ).rejects.toThrow(InternalServerErrorException);
  });
});
