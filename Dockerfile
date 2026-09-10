# Base image: node:20-alpine (Shared fat base image pattern for Indie Dev setup)
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Development environment
ENV NODE_ENV=development

# Expose Vite dev server port
EXPOSE 5173

# Default command to run dev server
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]
