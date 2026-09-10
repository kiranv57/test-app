#!/usr/bin/env bash
set -e

if ! command -v kubectl &> /dev/null; then
    echo "kubectl command not found."
    exit 0
fi

echo "Applying Kubernetes manifests..."
kubectl apply -f k8s/

echo "Checking rollout status..."
kubectl rollout status deployment/test-app-deployment --timeout=60s || true

echo "Cluster resources:"
kubectl get pods,svc,ingress
