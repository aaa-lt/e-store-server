FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . ./
EXPOSE ${PORT:-3000}
CMD npx sequelize-cli db:migrate && npm run dev