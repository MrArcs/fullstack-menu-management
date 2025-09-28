#!/bin/bash

# Database initialization script for Menu App

echo "Initializing database..."

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until docker-compose exec postgres pg_isready -U postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

# Run Prisma migrations
echo "Running Prisma migrations..."
docker-compose exec api npx prisma migrate deploy

# Generate Prisma client
echo "Generating Prisma client..."
docker-compose exec api npx prisma generate

echo "Database initialization complete!"
