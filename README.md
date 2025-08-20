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
- **Framework**: Vanilla JavaScript + WebSocket API
- **UI**: Tailwind CSS
- **Icons**: Heroicons

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
│   │   ├── conversation.go
│   │   ├── message.go
│   │   └── session.go
│   ├── handlers/               # Gin HTTP handlers
│   │   ├── auth.go
│   │   ├── chat.go
│   │   ├── health.go
│   │   ├── user.go
│   │   └── file.go
│   ├── websocket/              # WebSocket management
│   │   ├── connection.go
│   │   ├── hub.go
│   │   └── message.go
│   ├── database/               # Database connection & migrations
│   │   └── connection.go
│   ├── repository/             # Data access layer (CRUD operations)
│   │   ├── user_repository.go
│   │   ├── conversation_repository.go
│   │   └── message_repository.go
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
│   │   └── rate_limit.go
│   └── router/                 # Router setup
│       ├── router.go
│       └── auth_routes.go
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
│       └── validator.go
├── web/
│   ├── static/                 # Static files
│   │   ├── css/
│   │   ├── js/
│   │   └── images/
│   └── templates/              # HTML templates
│       ├── login.html
│       ├── register.html
│       ├── chat.html
│       └── layout.html
├── configs/                    # Configuration files
│   ├── config.yaml
│   ├── config.dev.yaml
│   └── config.prod.yaml
├── migrations/                 # SQL migration files
│   ├── 000001_create_users_table.up.sql
│   ├── 000001_create_users_table.down.sql
│   ├── 000002_create_conversations_table.up.sql
│   ├── 000002_create_conversations_table.down.sql
│   ├── 000003_create_messages_table.up.sql
│   └── 000003_create_messages_table.down.sql
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
**Mục tiêu**: User có thể đăng ký, đăng nhập

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

#### 2.5 Basic Frontend
- [ ] Simple login/register forms
- [ ] Token storage trong localStorage
- [ ] Basic navigation
- [ ] Error handling

### Phase 3: Real-time Chat Core (Tuần 3-4)
**Mục tiêu**: Có thể chat real-time cơ bản

#### 3.1 WebSocket Setup
- [ ] WebSocket connection management
- [ ] Connection hub và client management
- [ ] Basic message handling
- [ ] Connection authentication

#### 3.2 Chat Database
- [ ] Conversations table migration
- [ ] Messages table migration
- [ ] Conversation participants table
- [ ] Basic relationships và indexes

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

#### 5.2 Advanced Features
- [ ] Group chat management
- [ ] Message search functionality
- [ ] Message expiration
- [ ] User blocking

#### 5.3 Performance & Testing
- [ ] Database query optimization
- [ ] Unit tests cho core logic
- [ ] Integration tests
- [ ] Load testing

## 🚀 Getting Started

### Prerequisites
- Go 1.21+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- Kafka 3+

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd GoSwift

# Copy environment file
cp .env.example .env

# Start services with Docker
docker-compose up -d

# Run migrations
make migrate

# Start application
make run
```

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
- **Handlers**: HTTP request/response handling
- **Router**: Route definitions and middleware setup
- **Service**: Business logic and orchestration
- **Repository**: Data access and CRUD operations
- **Models**: Data structures and validation
- **Database**: Connection management and migrations