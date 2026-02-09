# Button0 – Application README

## Overview

This repository contains the **application layer** of Button0.

It includes:
- Frontend (React + Vite)
- Backend (Python + FastAPI)
- Dockerfiles for containerization
- Helm charts for Kubernetes deployment

This repository does NOT provision cloud infrastructure.
Infrastructure is managed separately using Terraform.

---

## Application Architecture

Button0 is a full-stack web application composed of:

Client (Browser)
↓
Frontend (React + Vite)
↓
Backend API (FastAPI)
↓
PostgreSQL Database

Each component is containerized and deployed to Kubernetes.

---

## Frontend

### Technology
- React
- Vite
- TypeScript

### Responsibilities
- User interface
- API communication with backend
- Environment-based configuration

### Runtime
- Runs on port `5173`
- Served behind Kubernetes Service + Ingress (ALB)

---

## Backend

### Technology
- Python
- FastAPI
- Uvicorn

### Responsibilities
- API endpoints
- Business logic
- Database access
- Health checks

### Runtime
- Runs on port `8000`

### Health Endpoints
Used by Kubernetes probes and load balancers:

- `/api/v1/health/live`
- `/api/v1/health/ready`

---

## Database

### Current State
- PostgreSQL (for deployed environments)
- In local/dev, repository mode may be in-memory

### Why PostgreSQL
- Relational data model
- ACID compliance
- Industry standard
- Easy migration to managed services (RDS)

---

## Environment Variables

### Backend
- `DATABASE_URL`
- `HOST`
- `PORT`
- `CORS_ORIGINS`
- `REPOSITORY_MODE`

### Frontend
- `VITE_API_BASE_URL`

Environment variables are injected:
- Locally via `.env`
- In Kubernetes via Helm values

---

## Docker & Containers

Each service has its own Dockerfile:

- `backend/Dockerfile`
- `Dockerfile.frontend`

Containers are:
- Built in CI
- Pushed to Amazon ECR
- Pulled by Kubernetes nodes

---

## Kubernetes Deployment

The application is deployed using Helm charts:

helm/
├── backend/
└── frontend/

Each chart defines:
- Deployment
- Service
- Resource limits
- Probes
- Image configuration

Ingress routing:
- `/` → frontend
- `/api` → backend

---

## Local Development

Run locally using Docker Compose:

docker-compose up --build

This starts:
- Frontend
- Backend
- PostgreSQL

Used for fast iteration and debugging.

---

## CI/CD Integration

This repository is designed to be used with CI pipelines that:

1. Build Docker images
2. Tag images with commit SHA
3. Push images to ECR
4. Let ArgoCD deploy changes automatically

---

## Scope Boundaries

This repository does NOT:
- Create AWS resources
- Manage Kubernetes clusters
- Handle GitOps orchestration

Those concerns are handled by:
- button0-infra
- button0-gitops

---

## Summary

This repository represents the **runtime heart** of Button0.

It demonstrates:
- Clean frontend / backend separation
- Container-first design
- Kubernetes-native application patterns
- Production-ready health checks and configuration
