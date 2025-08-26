FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code (excluding node_modules via .dockerignore)
COPY . .

# Expose port
EXPOSE 3000

# Start development server with proper host binding
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"] 