#!/bin/bash
# Production deployment script
echo 'Building and deploying Menu App...'

# Clean up any existing containers
docker compose down

# Remove old images to force rebuild
docker compose build --no-cache

# Start services
docker compose up -d

# Show status
echo 'Deployment status:'
docker compose ps

echo 'View logs with: docker compose logs -f'

