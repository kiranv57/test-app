#!/usr/bin/env bash
set -e

echo "Deploying production stack..."

IMAGE="${1:-test-app:latest}"
echo "Using image: ${IMAGE}"

docker compose -f docker-compose.prod.yml up -d --remove-orphans

sleep 3
docker compose -f docker-compose.prod.yml ps

echo "Deployment complete."
