# Dùng image Node.js 18
FROM node:18-alpine
# Đặt thư mục làm việc trong container là /app
WORKDIR /app
# Copy file package.json trước để tận dụng cache
COPY package*.json ./
# Cài đặt thư viện
RUN npm install
# Copy toàn bộ code
COPY . .
# Mở cổng 3001
EXPOSE 3001
# Lệnh chạy khi container khởi động
CMD ["npm", "start"]