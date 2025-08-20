package database

import (
	"database/sql"
	"fmt"
	"log"

	"goswift/pkg/utils"

	_ "github.com/lib/pq"
)

type DB struct {
	*sql.DB
}

func NewConnection(config *utils.Config) (*DB, error) {
	// Create connection string
	dsn := config.GetDBConnectionString()

	log.Printf("🔌 Connecting to database: %s:%s/%s", config.DBHost, config.DBPort, config.DBName)

	// Open database connection
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Test connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Println("✅ Database connected successfully!")

	return &DB{db}, nil
}

func (db *DB) Close() error {
	log.Println("🔌 Closing database connection...")
	return db.DB.Close()
}

func (db *DB) HealthCheck() error {
	return db.Ping()
}
