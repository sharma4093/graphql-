import { GraphQLError } from 'graphql';

export class ApiError extends Error {
  constructor(message, code = 'INTERNAL_SERVER_ERROR', status = 500, data = null) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.status = status;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }

  // Convert to GraphQL error format
  toGraphQLError() {
    return new GraphQLError(this.message, {
      extensions: {
        code: this.code,
        http: { status: this.status },
        data: this.data,
      },
    });
  }
}

// Authentication errors
export class AuthenticationError extends ApiError {
  constructor(message = 'Authentication required') {
    super(message, 'UNAUTHENTICATED', 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Insufficient permissions') {
    super(message, 'FORBIDDEN', 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super(message, 'NOT_FOUND', 404);
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation error', data = null) {
    super(message, 'BAD_USER_INPUT', 400, data);
  }
}

// Error formatter for Apollo Server
export const formatError = (error) => {
  const { originalError, message, path, extensions } = error;
  
  if (originalError instanceof ApiError) {
    return originalError.toGraphQLError();
  }

  return {
    message,
    path,
    extensions: {
      code: extensions?.code || 'INTERNAL_SERVER_ERROR',
      ...extensions,
    },
  };
}; 