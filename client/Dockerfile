# Build stage
FROM node:18-alpine AS builder

WORKDIR /app/client

# Copy package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY client . 

# Build the application
RUN npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app/client

# Install serve to run the built application
RUN npm install -g serve

# Copy built application from builder
COPY --from=builder /app/client/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start application
CMD ["serve", "-s", "dist", "-l", "3000"]
