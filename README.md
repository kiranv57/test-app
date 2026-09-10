# Test App

A Todo Application built with React, TypeScript, Vite, Docker, Kubernetes, and GitHub Actions.

## Features

- Client-side state management with React Context & custom hooks.
- Task statuses, categories, priorities, due dates, and subtasks.
- Search, filter, and sorting controls.
- Bulk actions for task management.

## Setup & Deployment

### Local Development

```bash
docker compose up -d
```

### Production Build

```bash
docker build -f Dockerfile.prod -t test-app:latest .
```

### Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

## License

MIT
