import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Bật rawBody phục vụ việc đối chiếu chữ ký webhook bảo mật (Lemon Squeezy)
  const app = await NestFactory.create(AppModule, { rawBody: true });

  // Bật CORS cho phép Next.js Client kết nối
  app.enableCors({
    origin: '*', // Trong môi trường thực tế nên giới hạn domain cụ thể
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Áp dụng Global Validation Pipe theo chuẩn UyFullStack
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động lọc các trường ngoài DTO
      transform: true, // Tự động cast kiểu dữ liệu
    }),
  );

  const port = process.env.PORT ?? 8000;
  await app.listen(port);
  console.log(`=== BACKEND ĐÃ KHỞI CHẠY TẠI CỔNG ${port} ===`);
}
bootstrap();
