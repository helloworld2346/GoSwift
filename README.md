# 🚀 GoSwift - Real-time WebChat Application

Một ứng dụng webchat realtime đơn giản bằng Golang, phù hợp cho level fresher với các tính năng như Signal nhưng đơn giản hơn.

## 🎯 Mục tiêu dự án

- Webchat realtime đơn giản, dễ hiểu cho fresher
- Tập trung vào các chức năng cơ bản nhưng hiệu quả
- Kiến trúc rõ ràng, dễ maintain và mở rộng
- Học tập các công nghệ modern: Gin, JWT, PostgreSQL, Redis, Kafka, MinIO

## 🛠 Tech Stack

### Backend
- **Framework**: [Gin](https://github.com/gin-gonic/gin) - HTTP web framework
- **Authentication**: [JWT](https://github.com/golang-jwt/jwt) - JSON Web Tokens
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Primary database
- **Migration**: [golang-migrate](https://github.com/golang-migrate/migrate) - Database migrations
- **Cache**: [Redis](https://redis.io/) - In-memory data store
- **Message Queue**: [Kafka](https://kafka.apache.org/) - Event streaming platform
- **File Storage**: [MinIO](https://min.io/) - S3-compatible object storage
- **WebSocket**: [Gorilla WebSocket](https://github.com/gorilla/websocket) - Real-time communication

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) - React framework với App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Beautiful, accessible components
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Lightweight state management
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) - Form validation
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful icons
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/) - Toast notifications

### DevOps
- **Container**: Docker & Docker Compose
- **Environment**: Development, Staging, Production ready

## 📁 Cấu trúc thư mục

```
GoSwift/
├── cmd/
│   └── server/                 # Entry point của ứng dụng
│       └── main.go
├── internal/
│   ├── auth/                   # JWT authentication logic
│   │   ├── handler.go
│   │   ├── middleware.go
│   │   └── service.go
│   ├── chat/                   # Chat business logic
│   │   ├── handler.go
│   │   ├── service.go
│   │   └── websocket.go
│   ├── models/                 # Data models
│   │   ├── user.go
│   │   └── chat.go
│   ├── handlers/               # Gin HTTP handlers
│   │   ├── auth.go
│   │   ├── chat.go
│   │   ├── health.go
│   │   ├── user.go
│   │   └── file.go
│   ├── websocket/              # WebSocket management
│   │   ├── handler.go
│   │   ├── manager.go
│   │   └── upgrader.go
│   ├── database/               # Database connection & migrations
│   │   └── connection.go
│   ├── repository/             # Data access layer (CRUD operations)
│   │   ├── user_repository.go
│   │   ├── conversation_repository.go
│   │   ├── message_repository.go
│   │   └── participant_repository.go
│   ├── service/                # Business logic layer
│   │   ├── auth_service.go
│   │   ├── chat_service.go
│   │   └── user_service.go
│   ├── cache/                  # Redis operations
│   │   └── redis.go
│   ├── queue/                  # Kafka operations
│   │   ├── producer.go
│   │   ├── consumer.go
│   │   └── topics.go
│   ├── storage/                # MinIO operations
│   │   ├── client.go
│   │   ├── upload.go
│   │   └── download.go
│   ├── middleware/             # Gin middleware
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── logging.go
│   │   ├── rate_limit.go
│   │   └── security.go
│   └── router/                 # Router setup
│       ├── router.go
│       ├── auth_routes.go
│       └── websocket_routes.go
├── pkg/
│   ├── encryption/             # Encryption utilities
│   │   ├── aes.go
│   │   └── hash.go
│   ├── jwt/                    # JWT utilities
│   │   ├── token.go
│   │   └── claims.go
│   ├── migrate/                # Database migration utilities
│   │   └── migrate.go
│   └── utils/                  # Common utilities
│       ├── config.go
│       ├── logger.go
│       ├── validator.go
│       ├── errors.go
│       └── hash.go
├── web/                        # Next.js Frontend Application
│   ├── src/
│   │   ├── app/               # Next.js App Router pages
│   │   │   ├── (auth)/        # Auth routes group
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/     # Protected routes
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── auth/         # Auth components
│   │   │   └── layout/       # Layout components
│   │   ├── lib/              # Utilities
│   │   │   ├── api.ts        # API client
│   │   │   ├── validations.ts # Zod schemas
│   │   │   ├── constants.ts  # App constants
│   │   │   └── utils.ts      # Utility functions
│   │   ├── hooks/            # Custom hooks
│   │   ├── stores/           # Zustand stores
│   │   └── types/            # TypeScript types
│   ├── public/               # Static assets
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.js
│   ├── components.json       # shadcn/ui config
│   └── tsconfig.json
├── configs/                    # Configuration files
│   ├── config.yaml
│   ├── config.dev.yaml
│   └── config.prod.yaml
├── migrations/                 # SQL migration files
│   ├── 000001_create_users_table.up.sql
│   ├── 000001_create_users_table.down.sql
│   ├── 000002_create_conversations_table.up.sql
│   ├── 000002_create_conversations_table.down.sql
│   ├── 000003_create_conversation_participants_table.up.sql
│   ├── 000003_create_conversation_participants_table.down.sql
│   ├── 000004_create_messages_table.up.sql
│   └── 000004_create_messages_table.down.sql
├── docker/                     # Docker configurations
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-compose.dev.yml
├── docs/                       # Documentation
│   ├── api.md
│   ├── deployment.md
│   └── development.md
├── scripts/                    # Utility scripts
│   ├── migrate.sh
│   ├── seed.sh
│   └── test.sh
├── tests/                      # Test files
│   ├── integration/
│   └── unit/
├── go.mod
├── go.sum
├── .env.example
├── .gitignore
├── Makefile
└── README.md
```

## 📋 Lộ trình phát triển

### Phase 1: Foundation Setup (Tuần 1) ✅ **COMPLETED**
**Mục tiêu**: Có được một server cơ bản chạy được

#### 1.1 Project Structure Setup ✅
- [x] Tạo cấu trúc thư mục
- [x] Setup `go.mod` với dependencies
- [x] Basic configuration loading
- [x] Environment variables setup

#### 1.2 Docker Environment ✅
- [x] Docker Compose với PostgreSQL, Redis
- [x] Development environment setup

#### 1.3 Database Foundation ✅
- [x] Migration setup với golang-migrate
- [x] Users table migration
- [x] Basic database connection
- [x] Connection pooling

#### 1.4 Gin Server ✅
- [x] Basic HTTP server setup
- [x] Health check endpoint
- [x] Configuration loading
- [x] Basic routing

#### 1.5 Clean Architecture ✅
- [x] Separation of concerns
- [x] Router package
- [x] Handlers package
- [x] Database package

#### 1.6 Swagger Documentation ✅
- [x] API documentation
- [x] Health check endpoints
- [x] Swagger UI accessible

### Phase 2: Authentication System (Tuần 2) ✅ **COMPLETED**
**Mục tiêu**: User có thể đăng ký, đăng nhập với full-stack authentication system

#### 2.1 User Management ✅ **COMPLETED**
- [x] User Model: Tạo struct User với validation
- [x] User Repository: CRUD operations cho database (Clean Architecture)
- [x] Password Hashing: Sử dụng bcrypt với strength validation
- [x] Input Validation: Validate email, password, display_name

#### 2.2 JWT Authentication ✅ **COMPLETED**
- [x] JWT token generation
- [x] Token validation middleware
- [x] Refresh token logic
- [x] Session management

#### 2.3 Auth Endpoints ✅ **COMPLETED**
- [x] Register endpoint (`POST /api/v1/auth/register`)
- [x] Login endpoint (`POST /api/v1/auth/login`)
- [x] Logout endpoint (`POST /api/v1/auth/logout`)
- [x] Refresh token endpoint (`POST /api/v1/auth/refresh`)
- [x] Profile endpoint (`GET /api/v1/auth/profile`)

#### 2.4 Security Features ✅ **COMPLETED**
- [x] Token Blacklisting với Redis
- [x] Rate Limiting (100 requests/minute)
- [x] CORS Configuration (Development/Production)
- [x] JWT Secret Validation
- [x] Enhanced Health Check (Database + Redis)

#### 2.5 Security Headers ✅ **COMPLETED**
- [x] X-Content-Type-Options: nosniff
- [x] X-Frame-Options: DENY
- [x] X-XSS-Protection: 1; mode=block
- [x] Cache-Control: no-store, no-cache, must-revalidate, private
- [x] Referrer-Policy: strict-origin-when-cross-origin
- [x] Content-Security-Policy (basic)
- [x] HSTS (production only)

#### 2.6 Basic Frontend ✅ **COMPLETED**
- [x] **Next.js 15** với TypeScript và App Router
- [x] **shadcn/ui** components (Button, Input, Card, Form, etc.)
- [x] **Login/Register forms** với React Hook Form + Zod validation
- [x] **Token storage** trong localStorage với Zustand persist
- [x] **Protected routes** với client-side authentication
- [x] **Dashboard layout** với responsive sidebar navigation
- [x] **Error handling** với Error Boundaries và toast notifications
- [x] **Loading states** và reusable Loading component
- [x] **Type safety** với TypeScript interfaces và types
- [x] **Modern UI** với Tailwind CSS và responsive design
- [x] **Custom hooks** cho authentication logic
- [x] **Constants** và environment configuration

### Phase 3: Real-time Chat Core (Tuần 3-4)
**Mục tiêu**: Có thể chat real-time cơ bản

#### 3.1 WebSocket Setup ✅ **COMPLETED**
- [x] WebSocket connection management
- [x] Connection hub và client management
- [x] Basic message handling
- [x] Connection authentication

#### 3.2 Chat Database ✅ **COMPLETED**
- [x] Conversations table migration
- [x] Messages table migration
- [x] Conversation participants table
- [x] Basic relationships và indexes

#### 3.3 Chat Logic
- [ ] Send/receive messages
- [ ] Conversation creation (1-1 và group)
- [ ] Message persistence
- [ ] Message broadcasting

#### 3.4 Simple Chat UI
- [ ] Basic chat interface
- [ ] Real-time message display
- [ ] Conversation list
- [ ] Message input và send

### Phase 4: Enhanced Features (Tuần 5-6)
**Mục tiêu**: Thêm các tính năng nâng cao

#### 4.1 Redis Integration ✅ **PARTIALLY COMPLETED**
- [x] Session caching
- [x] Online status management
- [x] Recent messages cache
- [x] Rate limiting ✅ **COMPLETED**

#### 4.2 MinIO File Storage
- [ ] File upload/download endpoints
- [ ] Image sharing support
- [ ] File message types
- [ ] File size limits và validation

#### 4.3 Kafka Integration
- [ ] Message queuing setup
- [ ] Event-driven architecture
- [ ] Message delivery guarantees
- [ ] Scalability preparation

### Phase 5: Polish & Security (Tuần 7-8)
**Mục tiêu**: Hoàn thiện và bảo mật

#### 5.1 Security Features ✅ **PARTIALLY COMPLETED**
- [ ] Message encryption (AES-256)
- [x] Rate limiting implementation ✅ **COMPLETED**
- [x] Input validation và sanitization ✅ **COMPLETED**
- [x] CORS configuration ✅ **COMPLETED**
- [x] Security headers ✅ **COMPLETED**

#### 5.2 HTTPS Setup
- [ ] SSL certificate configuration
- [ ] HTTPS server setup
- [ ] Certificate validation

#### 5.3 Advanced Features
- [ ] Group chat management
- [ ] Message search functionality
- [ ] Message expiration
- [ ] User blocking

#### 5.4 Performance & Testing
- [ ] Database query optimization
- [ ] Unit tests cho core logic
- [ ] Integration tests
- [ ] Load testing

## 🚀 Getting Started

### Prerequisites
- Go 1.21+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- Kafka 3+

### Quick Start

#### Backend Setup
```bash
# Clone repository
git clone <repository-url>
cd GoSwift

# Copy environment file
cp .env.example .env

# Start services with Docker
make up

# Run migrations
make migrate

# Start backend application
make run
```

#### Frontend Setup
```bash
# Navigate to frontend directory
cd web

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start frontend development server
npm run dev
```

#### Access Applications
- **Backend API**: http://localhost:8080
- **Frontend App**: http://localhost:3000
- **Swagger Docs**: http://localhost:8080/swagger/index.html

## 🏗️ Architecture Overview

### Clean Architecture Pattern
```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Handlers  │  │   Router    │  │ Middleware  │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Auth Service│  │ Chat Service│  │User Service │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Data Access Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │User Repo    │  │Chat Repo    │  │Message Repo │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure Layer                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ PostgreSQL  │  │    Redis    │  │   MinIO     │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

### Package Responsibilities

#### Backend
- **Handlers**: HTTP request/response handling
- **Router**: Route definitions and middleware setup
- **Service**: Business logic and orchestration
- **Repository**: Data access and CRUD operations
- **Models**: Data structures and validation
- **Database**: Connection management and migrations
- **Cache**: Redis operations and connection management
- **Middleware**: Authentication, CORS, Rate limiting, Security headers
- **Utils**: Configuration, validation, error handling, hashing

#### Frontend
- **App Router**: Next.js 15 page routing and layouts
- **Components**: Reusable UI components with shadcn/ui
- **Hooks**: Custom React hooks for business logic
- **Stores**: Zustand state management
- **Lib**: API client, validation schemas, utilities
- **Types**: TypeScript type definitions

## 🔒 Security Features Implemented

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Token blacklisting with Redis
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ UUID validation for user IDs

### Rate Limiting & Protection
- ✅ In-memory rate limiting (100 requests/minute)
- ✅ CORS configuration (development/production)
- ✅ Security headers middleware

### Security Headers
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ Cache-Control: no-store, no-cache, must-revalidate, private
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Content-Security-Policy (basic)
- ✅ HSTS (production only)

## 📊 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/profile` - Get user profile

### Health Check
- `GET /health` - Server health status

### WebSocket
- `GET /ws` - WebSocket connection endpoint

### Swagger Documentation
- `GET /swagger/*` - API documentation

## 🛠 Development Commands

### Backend Commands
```bash
# Run application
make run

# Run with hot reload
make dev

# Run tests
make test

# Run migrations
make migrate

# Generate swagger docs
make swagger

# Build for production
make build

# Clean build artifacts
make clean
```

### Frontend Commands
```bash
# Navigate to frontend directory
cd web

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```