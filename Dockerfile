# Use an official Node.js runtime as a parent image for the build stage
FROM node:16 AS build

# Set the working directory in the container
WORKDIR /usr/local/app

# Copy package.json and package-lock.json to the container
COPY ./ /usr/local/app/

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Angular app
RUN npm run build

# Use NGINX as the base image for serving the application
FROM nginx:latest

# Copy the built Angular app from the build stage to the NGINX web server directory
COPY --from=build /usr/local/app/dist/movies-collection /usr/share/nginx/html

# Expose the port that NGINX will listen on
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
