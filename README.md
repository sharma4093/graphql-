# Book Booking API

A GraphQL API for a book booking system built with Node.js, Express, Apollo Server, and MongoDB.

## Features

- User authentication and authorization
- Book management (CRUD operations)
- Book booking with time slots
- Input validation
- Error handling
- Structured logging

## Project Structure

```
GQL-be/
├── config/             # Configuration files
├── database/           # Database connection
├── graphql/            # GraphQL schema and resolvers
├── middlewares/        # Middleware functions
├── models/             # MongoDB models
├── modules/            # Domain modules
│   ├── book/           # Book module
│   └── user/           # User module
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

### Running the Server

```
npm start
```
