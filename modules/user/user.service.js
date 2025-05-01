import { AuthenticationError, NotFoundError, ValidationError } from "../../utils/error.js";
import logger from "../../utils/logger.js";
import { validate, userSchemas } from "../../utils/validation.js";
import generateToken from "../../middlewares/generate_token.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import prisma from "../../database/database.js";
// import pkg from "@prisma/client"
// const {PrismaClient} = pkg
// const prisma  = new PrismaClient();

class UserService {
  

  async registerUser(userData) {
    try {

      const validatedData = validate(userData, userSchemas.createUser);
      
      const existingUser = await prisma.user.findUnique({where:{email:userData.email}});
      if (existingUser) {
        throw new ValidationError('Email already exist. ');
      }
      console.log("existing ", existingUser)
      const hashedPassword = await bcrypt.hash(validatedData.password,12);
      console.log("paylload", userData)
      const user = await prisma.user.create({data : {...validatedData,password: hashedPassword, role:1}});

    console.log("user data", user)
      const token = generateToken(user);
      
      logger.info(`User registered with ID: ${user.id}`);
      
      return {
        token,
        user
      };
    } catch (error) {
      logger.error(`User registration error: ${error.message}`);
      throw error;
    }
  }


  async loginUser(loginData) {
    try {
      const validatedData = validate(loginData, userSchemas.loginUser);
      
      const user = await prisma.user.findUnique({where: {email: loginData.email}});
      if (!user) {
        throw new AuthenticationError('Invalid email ');
      }
      console.log("validate data", validatedData)
      console.log("user ", user)
      const isPasswordValid = await bcrypt.compare(validatedData.password,user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid password');
      }
      
      
      const token = generateToken(user);
      
      logger.info(`User logged in: ${user.id}`);
      
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
      if (!id) {
        throw new ValidationError('Invalid user ID format');
      }

      const user = await prisma.user.findUnique({where:{id}});
      if (!user) {
        throw new NotFoundError(`User with ID ${id} not found`);
      }

      return user;
    } catch (error) {
      logger.error(`Error fetching user by ID: ${error.message}`);
      throw error;
    }
  }


  async getAllUsers() {
    try {
      
      return  await prisma.user.findMany();
   
    } catch (error) {
      logger.error(`Error fetching users: ${error.message}`);
      throw error;
    }
  }


  async updateUser(userId, updateData) {
    try {
      console.log("upadte data", updateData)
      if (!userId) {
        throw new ValidationError('Invalid user ID format');
      }
      
      const validatedData = validate(updateData, userSchemas.updateUser);
      
      const updates = {};
      if (validatedData.name) updates.name = validatedData.name;
      
      // if (validatedData.email) updates.email = validatedData.email;
      // if (validatedData.password) {
      //   updates.password = await bcrypt.hash(validatedData.password, 12);
      // }
      
      const user = await prisma.user.update({
        where:{id: Number(userId)},
        data:{
          isActive:updateData.isActive,
          role: updateData.role,
          name: updateData.name
        }
      });
      
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


  async deleteUser(userId) {
    try {
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
  

  async addBookToHistory(userId, bookId, fromTime, endTime) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(bookId)) {
        throw new ValidationError('Invalid ID format');
      }
      
      if (new Date(fromTime) >= new Date(endTime)) {
        throw new ValidationError('End time must be after start time');
      }
      
      const user = await user_model.findById(userId);
      if (!user) {
        throw new NotFoundError(`User with ID ${userId} not found`);
      }
      
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