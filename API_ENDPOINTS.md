# Legal Content Management API Endpoints

This document outlines the API endpoints required to support the dynamic legal content management system.

## Base URL

```
http://localhost:5000/api/legal
```

## Endpoints

### 1. Get All Legal Content

**GET** `/api/legal`

Retrieves all legal content (privacy policy, terms of service, cookie policy, about us).

**Response:**

```json
{
  "success": true,
  "data": {
    "privacyPolicy": {
      "content": "<h1>Privacy Policy</h1><p>Your privacy policy content...</p>",
      "lastUpdated": "2024-01-15T10:30:00Z"
    },
    "termsOfService": {
      "content": "<h1>Terms of Service</h1><p>Your terms content...</p>",
      "lastUpdated": "2024-01-15T10:30:00Z"
    },
    "cookiePolicy": {
      "content": "<h1>Cookie Policy</h1><p>Your cookie policy content...</p>",
      "lastUpdated": "2024-01-15T10:30:00Z"
    }
  }
}
```

### 2. Get Legal Content by Type

**GET** `/api/legal/:type`

Retrieves legal content for a specific type.

**Parameters:**

- `type` - One of: `privacyPolicy`, `termsOfService`, `cookiePolicy`, `aboutUs`

**Response:**

```json
{
  "success": true,
  "data": {
    "type": "privacyPolicy",
    "content": "<h1>Privacy Policy</h1><p>Your privacy policy content...</p>",
    "lastUpdated": "2024-01-15T10:30:00Z"
  }
}
```

### 3. Update Legal Content

**PUT** `/api/legal/:type`

Updates legal content for a specific type.

**Parameters:**

- `type` - One of: `privacyPolicy`, `termsOfService`, `cookiePolicy`, `aboutUs`

**Request Body:**

```json
{
  "content": "<h1>Updated Privacy Policy</h1><p>Updated content...</p>"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "type": "privacyPolicy",
    "content": "<h1>Updated Privacy Policy</h1><p>Updated content...</p>",
    "lastUpdated": "2024-01-15T11:00:00Z"
  },
  "message": "Legal content updated successfully"
}
```

### 4. Create Legal Content

**POST** `/api/legal`

Creates new legal content for a specific type.

**Request Body:**

```json
{
  "type": "aboutUs",
  "content": "<h1>About Us</h1><p>Initial content...</p>"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "type": "privacyPolicy",
    "content": "<h1>Privacy Policy</h1><p>Initial content...</p>",
    "lastUpdated": "2024-01-15T10:30:00Z"
  },
  "message": "Legal content created successfully"
}
```

## Database Schema

### Legal Content Table

```sql
CREATE TABLE legal_content (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data
INSERT INTO legal_content (type, content) VALUES
('privacyPolicy', '<h1>Privacy Policy</h1><p>Default privacy policy content...</p>'),
('termsOfService', '<h1>Terms of Service</h1><p>Default terms content...</p>'),
('cookiePolicy', '<h1>Cookie Policy</h1><p>Default cookie policy content...</p>'),
('aboutUs', '<h1>About Us</h1><p>Default about us content...</p>');
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Invalid content type",
  "message": "Content type must be one of: privacyPolicy, termsOfService, cookiePolicy"
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": "Content not found",
  "message": "Legal content for type 'privacyPolicy' not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "Database error",
  "message": "Failed to update legal content"
}
```

## Authentication

All endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

- GET requests: 100 requests per minute
- POST/PUT requests: 10 requests per minute

## Content Validation

- Content must not be empty
- Content must be valid HTML
- Maximum content length: 50,000 characters
- Allowed HTML tags: h1, h2, h3, p, strong, em, u, ul, ol, li, blockquote, a, br
- Allowed HTML attributes: href (for links), class, id

## Frontend Integration

The frontend will:

1. Fetch all legal content on page load
2. Allow editing of content with rich text editor
3. Preview content before saving
4. Show last updated timestamps
5. Handle errors gracefully with user notifications
6. Support HTML formatting and links
