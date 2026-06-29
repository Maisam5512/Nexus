# 🏢 Business Nexus

![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat&logo=kubernetes&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Azure](https://img.shields.io/badge/Azure_AKS-0078D4?style=flat&logo=microsoftazure&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=flat&logo=nginx&logoColor=white)

> A full-stack MERN platform connecting **entrepreneurs and investors** — containerized with Docker and deployed on Azure Kubernetes Service (AKS).

🔗 **Live App (Vercel):** [nexus-six-zeta.vercel.app](https://nexus-six-zeta.vercel.app)  
🐳 **Docker Hub — Backend:** [maisam12/myproject-backend](https://hub.docker.com/r/maisam12/myproject-backend)  
🐳 **Docker Hub — Frontend:** [maisam12/myproject-frontend](https://hub.docker.com/r/maisam12/myproject-frontend)  
☸️ **Azure Public URL:** http://68.210.73.233

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Docker Setup](#-docker-setup)
- [Kubernetes Deployment (AKS)](#️-kubernetes-deployment-azure-aks)
- [Environment Variables](#-environment-variables)
- [Author](#-author)

---

## ✨ Features

- 🔐 **Role-based authentication** — separate flows for Entrepreneurs and Investors
- 🛡️ **JWT-secured REST APIs** with protected routes
- 🔌 **Real-time notifications** via WebSockets
- 📦 **Multi-stage Docker builds** for optimized, production-ready images
- ☸️ **Kubernetes orchestration** on Azure AKS with LoadBalancer services
- 🚀 **CI/CD pipeline** via Jenkins + GitHub Webhooks (auto-builds on every push)
- ⚡ **Frontend performance** optimized with Vite + Nginx serving static assets
- 🌐 **Dual deployment** — Vercel (frontend) & Azure AKS (full stack)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express.js, Nodemon |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens) |
| Real-time | WebSockets |
| Containerization | Docker, Docker Hub |
| Orchestration | Kubernetes (Azure AKS) |
| Web Server | Nginx (serving built frontend) |
| CI/CD | Jenkins + GitHub Webhooks |
| Hosting | Vercel (frontend), Azure AKS (full stack) |

---

## 📁 Project Structure

```
Nexus/
├── backend/                    # Express.js API server
│   ├── config/                 # DB and app configuration
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Auth & other middleware
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route definitions
│   ├── services/               # Business logic
│   ├── sockets/                # WebSocket handlers
│   ├── utils/                  # Helper utilities
│   ├── server.js               # Entry point
│   └── Dockerfile              # Backend Docker image
├── src/                        # React frontend source
├── public/                     # Static assets
├── K8s/
│   ├── backend-deployment.yml  # K8s backend deployment + service
│   └── frontend-deployment.yml # K8s frontend deployment + service
├── Dockerfile                  # Frontend Docker image (multi-stage + Nginx)
├── .dockerignore
├── vite.config.ts
└── vercel.json
```

---

## 🚀 Local Setup

### Prerequisites

- Node.js v18+
- MongoDB Atlas connection string (or local MongoDB)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/Maisam5512/Nexus.git
cd Nexus
```

### 2. Run the Backend

```bash
cd backend
npm install
# Create a .env file (see Environment Variables section)
npm run dev
# Server runs on http://localhost:5000
```

### 3. Run the Frontend

```bash
# From the root directory
npm install
npm run dev
# App runs on http://localhost:5173
```

---

## 🐳 Docker Setup

### Build & Run Backend

```bash
# Build the backend image
docker build -t myproject-backend:v1 ./backend

# Run the backend container
docker run \
  -e MONGO_URI="your_mongodb_connection_string" \
  -p 5000:5000 \
  myproject-backend:v1
```

### Build & Run Frontend

```bash
# Build the frontend image (multi-stage: Node build → Nginx serve)
docker build -t myproject-frontend:v1 .

# Run the frontend container
docker run -p 3000:80 myproject-frontend:v1
# App accessible at http://localhost:3000
<img width="831" height="447" alt="image" src="https://github.com/user-attachments/assets/7d6c3c1f-574f-4532-906c-92519d883a58" />

```

### Push to Docker Hub

```bash
# Tag images
docker tag myproject-backend:v1 maisam12/myproject-backend:v1
docker tag myproject-frontend:v1 maisam12/myproject-frontend:v1

# Push to Docker Hub
docker push maisam12/myproject-backend:v1
docker push maisam12/myproject-frontend:v1

<img width="816" height="309" alt="image" src="https://github.com/user-attachments/assets/213d4034-9f61-4c50-a663-575c9efdef5e" />

```

---

## ☸️ Kubernetes Deployment (Azure AKS)

### Prerequisites

- Azure CLI installed and authenticated
- `kubectl` configured with your AKS cluster credentials

### Connect to AKS Cluster

```bash
az aks get-credentials --resource-group rg-midterm --name aks-midterm
```

### Deploy to AKS

```bash
# Apply backend deployment and service
kubectl apply -f K8s/backend-deployment.yml

# Apply frontend deployment and service
kubectl apply -f K8s/frontend-deployment.yml
<img width="848" height="510" alt="image" src="https://github.com/user-attachments/assets/8410f442-98d3-4b32-86b3-f64d1d7c6869" />

```

### Verify Deployments

```bash
# Check deployments (should show 2/2 READY)
kubectl get deployments

# Check pods (all should show STATUS: Running)
kubectl get pods

# Get public IPs (via LoadBalancer)
kubectl get svc
```

### AKS Service Endpoints

| Service | Type | External IP | Port |
|---|---|---|---|
| frontend-service | LoadBalancer | 68.210.73.233 | 80:31307/TCP |
| backend-service | LoadBalancer | 68.210.120.2 | 80:30179/TCP |

**Public App URL:** http://68.210.73.233

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 👤 Author

**Syed Maisam Abbas**  
Full Stack Developer | MERN Stack | Docker | Kubernetes | Azure  
📧 [syedmaisamabbas95@gmail.com](mailto:syedmaisamabbas95@gmail.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/syedmaisamabbass)  
🐙 [GitHub](https://github.com/Maisam5512)

