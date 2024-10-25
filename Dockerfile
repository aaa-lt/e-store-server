FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
EXPOSE ${PORT:-3000}
CMD npx sequelize-cli db:migrate && npm run start