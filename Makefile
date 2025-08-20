# GoSwift - Simple Makefile

.PHONY: help deps run up down migrate swagger build-swagger

# Default
help:
	@echo "🚀 GoSwift Commands:"
	@echo "  make deps     - Download dependencies"
	@echo "  make run      - Run application"
	@echo "  make up       - Start Docker (PostgreSQL, Redis)"
	@echo "  make down     - Stop Docker"
	@echo "  make migrate  - Run database migrations"

# Dependencies
deps:
	@echo "📦 Downloading dependencies..."
	go mod download
	go mod tidy

# Run app
run:
	@echo "🚀 Starting GoSwift..."
	go run ./cmd/server

# Docker
up:
	@echo "🐳 Starting services..."
	docker-compose -f docker/docker-compose.yml up -d

down:
	@echo "🛑 Stopping services..."
	docker-compose -f docker/docker-compose.yml down

# Database
migrate:
	@echo "🗄️ Running migrations..."
	@if command -v migrate > /dev/null; then \
		migrate -path migrations -database "postgres://goswift:dev2346@localhost:5432/goswift?sslmode=disable" up; \
	else \
		echo "�� Installing migrate tool..."; \
		go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest; \
		migrate -path migrations -database "postgres://goswift:dev2346@localhost:5432/goswift?sslmode=disable" up; \
	fi

# Swagger
swagger:
	@echo "�� Generating Swagger documentation..."
	swag init -g cmd/server/main.go -o docs

# Build with swagger
build-swagger: swagger build