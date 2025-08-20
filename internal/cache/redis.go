package cache

import (
	"context"
	"time"

	"goswift/pkg/utils"

	"github.com/go-redis/redis/v8"
)

type RedisClient struct {
	client *redis.Client
}

func NewRedisConnection(config *utils.Config) (*RedisClient, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     config.GetRedisConnectionString(),
		Password: config.RedisPassword,
		DB:       config.RedisDB,
	})

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := client.Ping(ctx).Result()
	if err != nil {
		return nil, err
	}

	return &RedisClient{client: client}, nil
}

func (r *RedisClient) Close() error {
	return r.client.Close()
}

func (r *RedisClient) GetClient() *redis.Client {
	return r.client
}

// HealthCheck checks Redis connection
func (r *RedisClient) HealthCheck() error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.client.Ping(ctx).Result()
	return err
}
