# SalesOne Backend API Documentation

This document provides a comprehensive overview of the backend API endpoints available for frontend developers. The API follows RESTful principles and most endpoints require authentication using Bearer token.

## Base URL

Base Url: https://api.salesone.co.kr/

## Authentication

Most endpoints require authentication with a Bearer token. Include the token in your requests as follows:

```
Authorization: Bearer <your_access_token>
```

Endpoints marked with `[Public]` do not require authentication.

## API Endpoints

### Authentication

#### Sign In
- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth Required:** No `[Public]`
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response:** 
```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwidXNlcm5hbWUiOiJ5b29uZ3VrNTEwIiwiaWF0IjoxNzQzNjczNTI0LCJleHAiOjE3NDM2NzcxMjR9.Lq3_1E2vbbXBfQENBJp3sqkWH7c_59POGqgsclzXs4M"
  }
  ```

#### Sign Up
- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth Required:** No `[Public]`
- **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response:** User ID and registration confirmation
If success
```json
{
  "userId": 9
}
```
If already exists
```json
{
  "errorCode": "0003",
  "statusCode": 409,
  "timestamp": "2025-04-03T10:57:58.874Z",
  "path": "/auth/register",
  "description": "Username already exists",
  "detail": ""
}
```

#### Create OAuth Endpoint
- **URL:** `/auth/oauth/endpoint`
- **Method:** `GET`
- **Auth Required:** Yes
- **Success Response:** OAuth endpoint URL for authentication

#### Update OAuth Token
- **URL:** `/auth/oauth/token`
- **Method:** `POST`
- **Auth Required:** Yes
- **Query Parameters:**
  ```json
  {
    "userId": "number",
    "code": "string",
    "state": "string"
  }
  ```
- **Success Response:** OAuth token update confirmation

### User Management

#### Delete User
- **URL:** `/users`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "userId": "number"
  }
  ```
- **Success Response:** User deletion confirmation

### Business Services

#### Search Businesses
- **URL:** `/businesses/search`
- **Method:** `GET`
- **Auth Required:** No `[Public]`
- **Query Parameters:** Search criteria parameters
- **Success Response:** List of businesses matching the search criteria

### Campaign Management

#### Create Campaign
- **URL:** `/campaigns`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "leadlistIds": [number],
    "title": "string"
  }
  ```
- **Success Response:** Campaign ID
  ```json
  {
    "campaignId": "number"
  }
  ```

#### Get User's Campaigns
- **URL:** `/campaigns`
- **Method:** `GET`
- **Auth Required:** Yes
- **Success Response:** List of campaigns for the authenticated user
  ```json
  {
    "userId": "number",
    "campaignList": [
      {
        "campaignId": "number",
        "title": "string",
        "leadlistIds": [number]
      }
    ]
  }
  ```

#### Get Campaign by ID
- **URL:** `/campaigns/:campaignId`
- **Method:** `GET`
- **Auth Required:** Yes
- **Success Response:** Campaign details
  ```json
  {
    "campaignId": "number",
    "title": "string",
    "leadlistIds": [number]
  }
  ```

#### Delete Campaign
- **URL:** `/campaigns/:campaignId`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Success Response:** Campaign deletion confirmation

### Lead List Management

#### Create Lead List
- **URL:** `/leadlists`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:** Lead list creation parameters
- **Success Response:** Lead list ID
  ```json
  {
    "leadlistId": "number"
  }
  ```

#### Get User's Lead Lists
- **URL:** `/leadlists`
- **Method:** `GET`
- **Auth Required:** Yes
- **Success Response:** List of lead lists for the authenticated user

#### Get Lead List by ID
- **URL:** `/leadlists/:leadlistId`
- **Method:** `GET`
- **Auth Required:** Yes
- **Success Response:** Lead list details

#### Delete Lead List
- **URL:** `/leadlists/:leadlistId`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Success Response:** Lead list deletion confirmation

### Email Management

#### Send Email
- **URL:** `/emails/send`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:** Email sending parameters
  ```json
  {
    // Email parameters
  }
  ```
- **Success Response:** Email sending confirmation

## Error Handling

All API endpoints return standard HTTP status codes to indicate the success or failure of a request:

- `200 OK`: The request was successful
- `201 Created`: The resource was successfully created
- `400 Bad Request`: The request was malformed or invalid
- `401 Unauthorized`: Authentication is required or has failed
- `403 Forbidden`: The authenticated user doesn't have permission
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An unexpected error occurred on the server

Error responses will include a descriptive message to help identify the issue.

```json
{
  "statusCode": 400,
  "message": "Error description",
  "error": "Bad Request"
}
```

## Authentication Flow

1. Register a new user via `/auth/register`
2. Login via `/auth/login` to obtain an authentication token
3. Include the authentication token in subsequent requests

## Notes for Frontend Developers

- All authenticated endpoints require a valid JWT token in the Authorization header
- Date fields are in ISO 8601 format
- IDs are numeric
- For pagination, use the appropriate query parameters for endpoints that support them