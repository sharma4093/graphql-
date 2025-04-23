import { user_model } from "../../models/user_models.js";
import { AuthenticationError, NotFoundError, ValidationError } from "../../utils/error.js";
import logger from "../../utils/logger.js";
import { validate, userSchemas } from "../../utils/validation.js";
import generateToken from "../../middlewares/generate_token.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";


class UserService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Auth payload with token and user
   */
  async registerUser(userData) {
    try {
      // Validate user data
      const validatedData = validate(userData, userSchemas.createUser);
      
      // Check if user with this email already exists
      const existingUser = await user_model.findOne({ email: validatedData.email });
      if (existingUser) {
        throw new ValidationError('Email already in use');
      }
      
      // Create new user
      const user = await user_model.create({
        ...validatedData,
        role: 'user', // Default role
        books_history: []
      });
      
      // Generate token
      const token = generateToken(user);
      
      logger.info(`User registered with ID: ${user._id}`);
      
      return {
        token,
        user
      };
    } catch (error) {
      logger.error(`User registration error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Login a user
   * @param {Object} loginData - User login credentials
   * @returns {Promise<Object>} Auth payload with token and user
   */
  async loginUser(loginData) {
    try {
      // Validate login data
      const validatedData = validate(loginData, userSchemas.loginUser);
      
      // Find user by email
      const user = await user_model.findOne({ email: validatedData.email });
      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }
      
      // Check password
      const isPasswordValid = await user.comparePassword(validatedData.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }
      
      // Generate token
      const token = generateToken(user);
      
      logger.info(`User logged in: ${user._id}`);
      
      return {
        token,
        user
      };
    } catch (error) {
      logger.error(`User login error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object>} User object
   */
  async getUserById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid user ID format');
      }

      const user = await user_model.findById(id);
      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      logger.error(`Error fetching user by ID: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get all users
   * @returns {Promise<Array>} List of users
   */
  async getAllUsers() {
    try {
      return await user_model.find();
    } catch (error) {
      logger.error(`Error fetching users: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update user
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(userId, updateData) {
    try {
      // Validate user ID
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ValidationError('Invalid user ID format');
      }
      
      // Validate update data
      const validatedData = validate(updateData, userSchemas.updateUser);
      
      // Prepare update object
      const updates = {};
      if (validatedData.name) updates.name = validatedData.name;
      if (validatedData.email) updates.email = validatedData.email;
      if (validatedData.password) {
        updates.password = await bcrypt.hash(validatedData.password, 12);
      }
      
      // Update user
      const user = await user_model.findByIdAndUpdate(
        userId,
        updates,
        { new: true, runValidators: true }
      );
      
      if (!user) {
        throw new NotFoundError(`User with ID ${userId} not found`);
      }
      
      logger.info(`User ${userId} updated successfully`);
      return user;
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {string} userId - User ID
   * @returns {Promise<string>} Success message
   */
  async deleteUser(userId) {
    try {
      // Validate user ID
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ValidationError('Invalid user ID format');
      }
      
      const user = await user_model.findByIdAndDelete(userId);
      
      if (!user) {
        throw new NotFoundError(`User with ID ${userId} not found`);
      }
      
      logger.info(`User ${userId} deleted successfully`);
      return 'User deleted successfully';
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Add book to user's history
   * @param {string} userId - User ID
   * @param {string} bookId - Book ID
   * @param {Date} fromTime - Start time
   * @param {Date} endTime - End time
   * @returns {Promise<Object>} Updated user
   */
  async addBookToHistory(userId, bookId, fromTime, endTime) {
    try {
      // Validate IDs
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
        throw new ValidationError('Invalid ID format');
      }
      
      // Validate dates
      if (new Date(fromTime) >= new Date(endTime)) {
        throw new ValidationError('End time must be after start time');
      }
      
      // Find user
      const user = await user_model.findById(userId);
      if (!user) {
        throw new NotFoundError(`User with ID ${userId} not found`);
      }
      
      // Add book to history
      user.books_history.push({
        book_id: bookId,
        reading_status: 'pending',
        from_time: fromTime,
        end_time: endTime
      });
      
      await user.save();
      
      logger.info(`Book ${bookId} added to user ${userId} history`);
      return user;
    } catch (error) {
      logger.error(`Error adding book to user history: ${error.message}`);
      throw error;
    }
  }
}

export default new UserService(); 