FROM node:20
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install
COPY . ./
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start"]