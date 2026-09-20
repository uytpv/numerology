import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Bật rawBody phục vụ việc đối chiếu chữ ký webhook bảo mật (Lemon Squeezy)
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Bật CORS cho phép Next.js Client kết nối bảo mật
  app.enableCors({
    origin: (origin: any, callback: (err: Error | null, allow?: boolean) => void) => {
      // Cho phép request không có origin (như curl, mobile app, webhook từ SePay server)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        'https://lifemaps.web.app',
        'https://numerology-330e9.web.app',
        'https://numerology-330e9.firebaseapp.com',
        'http://localhost:3000',
        'http://localhost:3001',
      ];
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.web.app') ||
        origin.endsWith('.firebaseapp.com')
      ) {
        callback(null, true);
      } else {
        callback(null, true); // Trong giai đoạn soft launch mở rộng tương thích
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Áp dụng Global Validation Pipe theo chuẩn UyFullStack
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động lọc các trường ngoài DTO
      transform: true, // Tự động cast kiểu dữ liệu
    }),
  );

  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`=== LIFE MAPS BACKEND ĐÃ KHỞI CHẠY TẠI CỔNG ${port} (0.0.0.0) ===`);
}
bootstrap();
