# === STAGE 1: Build Stage ===
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# === STAGE 2: Production Stage ===
FROM nginx:stable-alpine

# 1. Build stage copy for dist folder to nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# 2.  Page Refresh 404 Error copy nginx.conf to nginx config folder
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]