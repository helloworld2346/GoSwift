package middleware

import (
	"github.com/gin-gonic/gin"
)

// SecurityHeaders adds security headers to responses
func SecurityHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Prevent MIME type sniffing
		c.Header("X-Content-Type-Options", "nosniff")

		// Prevent clickjacking
		c.Header("X-Frame-Options", "DENY")

		// Enable XSS protection
		c.Header("X-XSS-Protection", "1; mode=block")

		// Force HTTPS (only in production)
		if c.GetString("ENV") == "production" {
			c.Header("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
		}

		// Prevent caching of sensitive data
		c.Header("Cache-Control", "no-store, no-cache, must-revalidate, private")

		// Referrer Policy
		c.Header("Referrer-Policy", "strict-origin-when-cross-origin")

		// Content Security Policy (basic)
		c.Header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'")

		c.Next()
	}
}
