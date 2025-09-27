#!/bin/bash

# Start PostgreSQL
pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/data/postgresql.log start

# Wait for PostgreSQL to be ready
until pg_isready -h localhost -p 5432 -U menuuser; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

# Run database migrations
cd nst-backend
npx prisma migrate deploy
npx prisma generate

# Start the application
cd ..
node nxt-frontend/server.js &
node nst-backend/dist/main.js
