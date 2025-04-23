import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import logger from '../utils/logger.js';

/**
 * Generate a JWT token for user authentication
 * @param {Object} user - User object with _id, email, and role
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  try {
    if (!user || !user._id) {
      throw new Error('Invalid user data for token generation');
    }
    
    // Create payload with minimal necessary information
    const payload = { 
      id: user._id, 
      email: user.email, 
      role: user.role 
    };
    
    // Sign token with secret and expiration from config
    return jwt.sign(
      payload,
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  } catch (error) {
    logger.error(`Error generating token: ${error.message}`);
    throw error;
  }
};

export default generateToken;
