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
│   │   ├── user.go
│   │   └── file.go
│   ├── websocket/              # WebSocket management
│   │   ├── connection.go
│   │   ├── hub.go
│   │   └── message.go
│   ├── database/               # PostgreSQL operations
│   │   ├── connection.go
│   │   ├── user_repository.go
│   │   ├── conversation_repository.go
│   │   └── message_repository.go
│   ├── cache/                  # Redis operations
│   │   ├── client.go
│   │   ├── session.go
│   │   └── message.go
│   ├── queue/                  # Kafka operations
│   │   ├── producer.go
│   │   ├── consumer.go
│   │   └── topics.go
│   ├── storage/                # MinIO operations
│   │   ├── client.go
│   │   ├── upload.go
│   │   └── download.go
│   └── middleware/             # Gin middleware
│       ├── auth.go
│       ├── cors.go
│       ├── logging.go
│       └── rate_limit.go
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

### Phase 2: Authentication System (Tuần 2)
**Mục tiêu**: User có thể đăng ký, đăng nhập

#### 2.1 User Management
- [ ] User model và repository
- [ ] Password hashing với bcrypt
- [ ] User CRUD operations
- [ ] Input validation

#### 2.2 JWT Authentication
- [ ] JWT token generation
- [ ] Token validation middleware
- [ ] Refresh token logic
- [ ] Session management

#### 2.3 Auth Endpoints
- [ ] Register endpoint (`POST /api/auth/register`)
- [ ] Login endpoint (`POST /api/auth/login`)
- [ ] Logout endpoint (`POST /api/auth/logout`)
- [ ] Refresh token endpoint (`POST /api/auth/refresh`)

#### 2.4 Basic Frontend
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

#### 4.1 Redis Integration
- [ ] Session caching
- [ ] Online status management
- [ ] Recent messages cache
- [ ] Rate limiting

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

#### 5.1 Security Features
- [ ] Message encryption (AES-256)
- [ ] Rate limiting implementation
- [ ] Input validation và sanitization
- [ ] CORS configuration

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