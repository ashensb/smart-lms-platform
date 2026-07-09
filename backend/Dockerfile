# 1. Base image 
FROM node:20-alpine

# 2. Container  (Working Directory)
WORKDIR /app

# 3. Package files copy
COPY package*.json ./

# 4. Dependencies install
RUN npm install

# 5. another copy to container
COPY . .

# 6. Backend port
EXPOSE 5000

# 7. app start
CMD ["npm", "start"]