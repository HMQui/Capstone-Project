# Giai đoạn 1: Build React App
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Giai đoạn 2: Serve bằng Nginx
FROM nginx:1.23-alpine
# Copy file build từ giai đoạn 1
COPY --from=build /app/dist /usr/share/nginx/html
# Xóa config default của Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Copy file config Nginx của chúng ta
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]