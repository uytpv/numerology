# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Sao chép package.json và cài đặt dependencies
COPY package*.json ./
RUN npm ci

# Sao chép toàn bộ mã nguồn và build
COPY . .
RUN npm run build

# Stage 2: Production Runner
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Cài đặt chỉ production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Sao chép kết quả build từ builder
COPY --from=builder /app/dist ./dist

# Mở cổng cho Cloud Run
EXPOSE 8080

CMD ["node", "dist/main"]
