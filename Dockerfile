# Use official Node.js image with Debian (Linux)
FROM node:20-bullseye

# Install system dependencies required by 'canvas'
RUN apt-get update && apt-get install -y \
  libcairo2-dev \
  libpango1.0-dev \
  libjpeg-dev \
  libgif-dev \
  librsvg2-dev

# Set working directory inside container
WORKDIR /app

# Copy all files from local project into the container
COPY . .

# Install backend dependencies and rebuild canvas
WORKDIR /app/backend
RUN npm install && npm rebuild canvas --build-from-source

# Build the frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Go back to backend folder
WORKDIR /app/backend

# Expose backend port (must match PORT in .env)
EXPOSE 5000

# Start the backend server
CMD ["node", "index.js"]
