# Development stage
FROM node:24-alpine as development

# Install PostgreSQL client tools and wget for health checks
RUN apk add --no-cache postgresql-client wget

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose port
EXPOSE 3001

CMD ["sh", "-c", "echo 'Waiting for PostgreSQL to be ready...' && until pg_isready -h postgres -p 5432 -U postgres; do echo 'PostgreSQL is unavailable - sleeping'; sleep 2; done && echo 'PostgreSQL is ready!' && echo 'Running Prisma migrations...' && npx prisma migrate deploy && echo 'Starting NestJS application...' && exec npm run start:dev"]

# Production stage
FROM node:24-alpine as production

# Install PostgreSQL client tools and wget for health checks
RUN apk add --no-cache postgresql-client wget

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=development /app/dist ./dist
COPY --from=development /app/prisma ./prisma
COPY --from=development /app/node_modules/.prisma ./node_modules/.prisma

# Generate Prisma client for production
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

CMD ["sh", "-c", "echo 'Waiting for PostgreSQL to be ready...' && until pg_isready -h postgres -p 5432 -U postgres; do echo 'PostgreSQL is unavailable - sleeping'; sleep 2; done && echo 'PostgreSQL is ready!' && echo 'Running Prisma migrations...' && npx prisma migrate deploy && echo 'Starting NestJS application...' && exec node dist/main.js"]