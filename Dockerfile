# Specify a base image
FROM node:14

LABEL authors="yuqi.guo17@gmail.com"

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Build the application
RUN npm run build

# Start the app by serving the static files from the build directory
CMD ["npx", "serve", "-s", "build"]

