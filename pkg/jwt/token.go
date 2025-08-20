package jwt

import (
	"context"
	"fmt"
	"time"

	"goswift/internal/cache"
	"goswift/internal/models"

	"github.com/golang-jwt/jwt/v5"
)

type JWTManager struct {
	secretKey     string
	tokenDuration time.Duration
	redisClient   *cache.RedisClient
}

type Claims struct {
	UserID   string `json:"user_id"`
	Email    string `json:"email"`
	Username string `json:"username"`
	jwt.RegisteredClaims
}

func NewJWTManager(secretKey string, tokenDuration time.Duration, redisClient *cache.RedisClient) *JWTManager {
	return &JWTManager{
		secretKey:     secretKey,
		tokenDuration: tokenDuration,
		redisClient:   redisClient,
	}
}

// GenerateToken generates a new JWT token for a user
func (manager *JWTManager) GenerateToken(user *models.User) (string, error) {
	claims := &Claims{
		UserID:   user.ID.String(),
		Email:    user.Email,
		Username: user.DisplayName,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(manager.tokenDuration)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "goswift",
			Subject:   user.ID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(manager.secretKey))
}

// ValidateToken validates the JWT token and returns the claims
func (manager *JWTManager) ValidateToken(accessToken string) (*Claims, error) {
	// Check if token is blacklisted
	if manager.IsTokenBlacklisted(accessToken) {
		return nil, fmt.Errorf("token is blacklisted")
	}

	token, err := jwt.ParseWithClaims(
		accessToken,
		&Claims{},
		func(token *jwt.Token) (interface{}, error) {
			_, ok := token.Method.(*jwt.SigningMethodHMAC)
			if !ok {
				return nil, fmt.Errorf("unexpected token signing method: %v", token.Header["alg"])
			}

			return []byte(manager.secretKey), nil
		},
	)

	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	claims, ok := token.Claims.(*Claims)
	if !ok {
		return nil, fmt.Errorf("invalid token claims")
	}

	return claims, nil
}

// BlacklistToken adds token to blacklist
func (manager *JWTManager) BlacklistToken(token string, expiration time.Duration) error {
	ctx := context.Background()
	key := "blacklist:" + token

	// Get token expiration time
	parsedToken, _ := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(manager.secretKey), nil
	})

	if claims, ok := parsedToken.Claims.(jwt.MapClaims); ok {
		if exp, ok := claims["exp"].(float64); ok {
			expTime := time.Unix(int64(exp), 0)
			remainingTime := time.Until(expTime)

			if remainingTime > 0 {
				return manager.redisClient.GetClient().Set(ctx, key, "1", remainingTime).Err()
			}
		}
	}

	// Fallback to default expiration
	return manager.redisClient.GetClient().Set(ctx, key, "1", expiration).Err()
}

// IsTokenBlacklisted checks if token is blacklisted
func (manager *JWTManager) IsTokenBlacklisted(token string) bool {
	ctx := context.Background()
	key := "blacklist:" + token

	_, err := manager.redisClient.GetClient().Get(ctx, key).Result()
	return err == nil
}

// GenerateRefreshToken generates a refresh token
func (manager *JWTManager) GenerateRefreshToken(user *models.User) (string, error) {
	claims := &Claims{
		UserID:   user.ID.String(),
		Email:    user.Email,
		Username: user.DisplayName,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(manager.tokenDuration * 7)), // 7 days
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "goswift",
			Subject:   user.ID.String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(manager.secretKey))
}
