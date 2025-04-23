import jwt from 'jsonwebtoken';
import { user_model } from "../models/user_models.js"
import config from '../config/env.js';
import { AuthenticationError, ForbiddenError } from '../utils/error.js';
import logger from '../utils/logger.js';


const auth = async ({ req }) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return { user: null };

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await user_model.findById(decoded.id);
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    return { user };
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      logger.warn(`Invalid token: ${err.message}`);
      return { user: null };
    }
    
    if (err.name === 'TokenExpiredError') {
      logger.warn('Token expired');
      return { user: null };
    }
    
    logger.error(`Authentication error: ${err.message}`);
    return { user: null };
  }
};


export const authGuard = (roles = []) => {
  return (resolver) => {
    return (parent, args, context, info) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }
      
      if (roles.length && !roles.includes(context.user.role)) {
        throw new ForbiddenError(`Requires ${roles.join(' or ')} role`);
      }
      
      return resolver(parent, args, context, info);
    };
  };
};


export default auth;
