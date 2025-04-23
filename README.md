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

## API Documentation

### Authentication

#### Signup
```graphql
mutation {
  signup(name: "John Doe", email: "john@example.com", password: "password123") {
    token
    user {
      _id
      name
      email
      role
    }
  }
}
```

#### Login
```graphql
mutation {
  login(email: "john@example.com", password: "password123") {
    token
    user {
      _id
      name
      email
      role
    }
  }
}
```

### Books

#### Get All Books
```graphql
query {
  getBooks {
    _id
    book_name
    author
    status
    booked_slots {
      from_time
      end_time
    }
  }
}
```

#### Get Book Details
```graphql
query {
  getBookDetails(_id: "book_id_here") {
    _id
    book_name
    author
    status
    booked_slots {
      from_time
      end_time
    }
  }
}
```

#### Add Book
```graphql
mutation {
  addBook(book_name: "The Great Gatsby", author: "F. Scott Fitzgerald") {
    _id
    book_name
    author
  }
}
```

#### Book a Time Slot
```graphql
mutation {
  booksBooking(booking: {
    book_id: "book_id_here",
    user_id: "user_id_here",
    from_time: "2023-10-24T10:00:00Z",
    end_time: "2023-10-24T12:00:00Z"
  }) {
    _id
    book_name
    author
    status
    booked_slots {
      from_time
      end_time
    }
  }
}
```

## Error Handling

The API returns standardized error responses with the following structure:

```json
{
  "errors": [
    {
      "message": "Error message",
      "extensions": {
        "code": "ERROR_CODE",
        "http": {
          "status": 400
        }
      }
    }
  ]
}
```

## License

MIT 