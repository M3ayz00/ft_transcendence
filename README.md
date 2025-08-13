# ft_transcendence 🏓

A **social Pong gaming platform** powered by a **microservices backend** and a modular modern frontend. Real-time gameplay, chat, notifications, and user profiles—all running via Docker and orchestrated with Nginx, RabbitMQ, Redis, and SQLite.

---

## About the Project

**ft_transcendence** is a production-like microservices project that delivers a real-time multiplayer Pong experience. It includes:

- Secure authentication with **JWT + TOTP 2FA**
- Live chat and friend-management
- Real-time notifications and dashboards
- Tournament and ranking systems
- Event-driven communication via **RabbitMQ**
- Efficient caching and state storage using **Redis**
- Separate **SQLite** databases per service

---

## Core Features

- **Secure Authentication**
  - Registration, login, JWT tokens, secure cookie storage
  - Email- and app-based TOTP 2FA, token rotation, revocation handling
- **Profiles & Relationships**
  - User profiles, avatars, stats
  - Friend requests, blocking, online status detection via WebSockets
- **Chat & Notifications**
  - Real-time messaging with WebSocket endpoints
  - Notifications delivered instantly; persisted and synced upon reconnect
- **Gameplay & Tournaments**
  - Real-time Pong matches hosted in `game-service`
  - Match invitations, play-again workflows, and stats tracking
- **Live Dashboard & Rankings**
  - Real-time user stats updates and leaderboard display via `dashboard-service`
- **Caching & Shared State**
  - Redis stores user session validation, block lists, profile caches
- **Asynchronous Messaging**
  - RabbitMQ mediates all event-driven interactions across services

---

## Repository Structure

ft_transcendence/
├── client/                        # Frontend (Vite, TypeScript, Tailwind)
│   ├── nginx/                         # Nginx gateway config (proxying, TLS, routes)
│   ├── ...
├── server/                        # Backend microservices
│   ├── auth-service/              # Registration, login, JWT, TOTP
│   ├── profile-service/           # Profile CRUD + online status
│   ├── relationships-service/     # Friends, blocking, relationship logic
│   ├── chat-service/              # WebSocket chat
│   ├── notifications-service/     # Notification queueing and delivery
│   ├── game-service/              # Real-time Pong logic
│   ├── dashboard-service/         # Live dashboard updates
│   ├── redis/                     # Redis config and initialization
│   └── docs/                      # API and service documentation
├── docker-compose.yml             # Orchestrates all services & infrastructure
├── Makefile                       # Useful automation (build, up, down)
├── README.md                      # This document
└── .gitignore


---


---

## Architecture Overview

```mermaid
flowchart TD
    A[Frontend (SPA)] --> B[Nginx API Gateway]

    B --> C1[Auth Service]
    B --> C2[Profile Service]
    B --> C3[Relationships Service]
    B --> C4[Chat Service]
    B --> C5[Notifications Service]
    B --> C6[Game Service]
    B --> C7[Dashboard Service]

    C1 --> D1[SQLite]
    C2 --> D2[SQLite]
    C3 --> D3[SQLite]
    C4 --> D4[SQLite]
    C5 --> D5[SQLite]
    C6 --> D6[SQLite]
    C7 --> D7[SQLite]

    C1 --> E[RabbitMQ Message Broker]
    C2 --> E
    C3 --> E
    C4 --> E
    C5 --> E
    C6 --> E
    C7 --> E

    E --> F[Redis (cache, session, blockList)]
```

- **Nginx** handles all incoming HTTP(s) and WebSocket traffic.
- **Backend services** communicate through **RabbitMQ** for event-driven operations.
- **Redis** assists with fast user validation, caching, and blocking logic.
- Each service has its own **SQLite database** for persistence.

---

##  Setup & Running Locally

### Prerequisites
- Docker & Docker Compose
- (Optional) TLS certs if using HTTPS locally

### Startup Steps
```bash
git clone https://github.com/M3ayz00/ft_transcendence.git
cd ft_transcendence

# Copy .env.example files into each service's directory and configure secrets
# (see /client/.env and /server/auth-service/.env, etc.)

# Launch the entire stack
make up
```
---

## Backend Overview

The backend is organized as microservices, each handling a specific domain. Responsibilities include:

- Implementing **JWT + TOTP-based authentication**
- Managing **WebSocket endpoints** for chat, notifications, and online status
- Integrating **RabbitMQ** for event-driven communication across services
- Handling **user validation and caching** using Redis
- Maintaining **per-service SQLite databases** for data isolation
- Configuring **Nginx** as the API gateway for HTTP routing and WebSocket proxying
- Supporting **Docker Compose** deployment for consistent development and testing

---

## Development Commands

```bash
# Build and start all services
make up

# Stop all services
make down

# Rebuild images without cache
make re

# View logs
make logs
```
