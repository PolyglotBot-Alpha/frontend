# Specify a base image
FROM node:16-alpine AS build

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

FROM node:16-alpine AS production
WORKDIR /app

COPY --from=build /app/build ./build

EXPOSE 3000

# Start the app by serving the static files from the build directory
CMD ["npx", "serve", "-l", "3000", "-s", "build"]

