# Build stage
FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Build static Next.js export
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy the static build output to the Nginx HTML directory
COPY --from=build /app/out /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose web port
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
