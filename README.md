# Button0

## Overview

**Button0** is a full-stack, cloud-native web application designed as a real-world DevOps showcase project.  
It demonstrates how a modern application is built, deployed, operated, and destroyed using industry-standard DevOps practices and tools.

The project was built with a strong emphasis on:
- Clean architecture
- Infrastructure as Code
- Kubernetes-based deployments
- GitOps workflows
- Environment separation (dev / staging / prod)
- Cost-aware cloud usage

Button0 is not just an application — it is a complete **end-to-end system**.

---

## What Does the Application Do?

At its core, Button0 is a web application composed of:
- A **frontend** web client
- A **backend** API service
- A **database** for persistence

Users access the application through a browser.  
Requests flow through a cloud load balancer, reach the frontend service, and are routed to the backend API when needed.  
The backend handles business logic and communicates with the database.

---

## High-Level Architecture

The system is split into three main layers:

### 1. Application Layer
- Frontend (React + Vite)
- Backend (FastAPI)
- Database (PostgreSQL)

### 2. Platform Layer
- Kubernetes (Amazon EKS)
- Helm charts for deployments
- Ingress for traffic routing

### 3. Infrastructure Layer
- AWS networking (VPC, subnets, gateways)
- Compute (EKS worker nodes)
- Container registry (ECR)
- IAM for permissions
- Terraform for provisioning

Each layer is owned and managed independently, following DevOps best practices.

---

## Repositories Structure

The project is split into multiple repositories, each with a clear responsibility:

### `button0`
**Application repository**
- Frontend and backend source code
- Dockerfiles
- Local development setup
- Application-level configuration

### `button0-infra`
**Infrastructure repository**
- Terraform code
- AWS resource definitions
- EKS cluster provisioning
- Networking setup
- Safe teardown (destroy) procedures

### `button0-gitops`
**Deployment / GitOps repository**
- ArgoCD applications
- Helm values and charts
- Kubernetes manifests
- Environment-specific deployment configuration

This separation allows each concern (code, infrastructure, deployment) to evolve independently.

---

## Environments

The system is designed to support multiple environments:

- **dev** – development and testing
- **staging** – pre-production validation
- **prod** – production (future)

Each environment:
- Has its own infrastructure
- Uses its own configuration
- Can be deployed or destroyed independently

This mirrors how real production systems are managed.

---

## How Everything Connects

1. Infrastructure is provisioned using **Terraform**
2. An **EKS cluster** is created in AWS
3. **ArgoCD** is installed on the cluster
4. ArgoCD watches the GitOps repository
5. Application changes are pulled from Git
6. Helm charts deploy frontend and backend
7. Traffic enters via AWS Load Balancer and Ingress
8. Users access the application through a public endpoint

No manual deployments. No clicking in the console.

---

## Why This Project Exists

Button0 was built to demonstrate:
- Real DevOps workflows
- Production-style cloud architecture
- Kubernetes and GitOps in practice
- Thoughtful infrastructure design
- Operational awareness (costs, teardown, environments)

It is intentionally **not** a toy project.

---

## Where to Go Next

- 👉 See **Infrastructure details** in `button0-infra/README.md`
- 👉 See **Application details** in `button0/README.md`
- 👉 See **Deployment & GitOps flow** in `button0-gitops/README.md`

Each repository contains a dedicated README explaining its role in detail.
