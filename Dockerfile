# Multi-stage build for all-in-one container
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies for both backend and frontend
COPY nst-backend/package*.json ./nst-backend/
COPY nxt-frontend/package*.json ./nxt-frontend/
COPY package*.json ./

RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules

# Build backend
COPY nst-backend/ ./nst-backend/
WORKDIR /app/nst-backend
RUN npm run build

# Build frontend
COPY nxt-frontend/ ./nxt-frontend/
WORKDIR /app/nxt-frontend
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Install PostgreSQL client
RUN apk add --no-cache postgresql-client

# Copy built applications
COPY --from=builder /app/nst-backend/dist ./nst-backend/dist
COPY --from=builder /app/nst-backend/node_modules ./nst-backend/node_modules
COPY --from=builder /app/nst-backend/package*.json ./nst-backend/
COPY --from=builder /app/nst-backend/prisma ./nst-backend/prisma

COPY --from=builder /app/nxt-frontend/.next/standalone ./
COPY --from=builder /app/nxt-frontend/.next/static ./nxt-frontend/.next/static
COPY --from=builder /app/nxt-frontend/public ./nxt-frontend/public

# Copy startup script
COPY start.sh ./
RUN chmod +x start.sh

# Copy database initialization
COPY init-db.sql ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=postgresql://menuuser:password@localhost:5432/menudb
ENV POSTGRES_USER=menuuser
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=menudb

EXPOSE 3000

CMD ["./start.sh"]
