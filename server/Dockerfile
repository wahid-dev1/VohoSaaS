FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci || npm i
COPY . .
EXPOSE 4000
CMD ["sh","-c","npx sequelize-cli db:migrate && node src/index.js"]
