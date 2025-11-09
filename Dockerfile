# Use Node.js 20 with build tools
FROM node:20-bullseye

# Install dependencies required for canvas and native modules
RUN apt-get update && apt-get install -y \
  build-essential \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev \
  python3 \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy everything
COPY . .

# --- Backend ---
WORKDIR /app/backend
RUN npm install && npm rebuild canvas --build-from-source

# --- Frontend ---
WORKDIR /app/frontend

# 🩹 Fix npm + rolldown issue
RUN rm -rf node_modules package-lock.json && npm cache clean --force
RUN npm install --omit=dev && npm install vite@5.4.8 --force
RUN npm run build

# --- Final setup ---
WORKDIR /app/backend
EXPOSE 5000

CMD ["node", "index.js"]
