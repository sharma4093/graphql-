import userService from "./user.service.js";
import { authGuard } from "../../middlewares/auth_middleware.js";
import logger from "../../utils/logger.js";

const userResolver = {
  Query: {
    getUserDetails: (_, __, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return user;
    },
    
    getUsers: async (_, __, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Unauthorized');
      try {
        return await userService.getAllUsers();
      } catch (error) {
        logger.error(`Failed to get users: ${error.message}`);
        throw error;
      }
    }
  },

  Mutation: {
    signup: async (_, args) => {
      try {
        return await userService.registerUser(args);
      } catch (error) {
        logger.error(`Signup failed: ${error.message}`);
        throw error;
      }
    },

    login: async (_, args) => {
      try {
        return await userService.loginUser(args);
      } catch (error) {
        logger.error(`Login failed: ${error.message}`);
        throw error;
      }
    },

    updateUser: async (_, args, { user }) => {
      if (!user) throw new Error('Not authenticated');
      
      try {
        return await userService.updateUser(user._id, args);
      } catch (error) {
        logger.error(`Update user failed: ${error.message}`);
        throw error;
      }
    },

    deleteUser: async (_, { userId }, { user }) => {
      if (!user || user.role !== 'admin') throw new Error('Only admins can delete users');
      
      try {
        return await userService.deleteUser(userId);
      } catch (error) {
        logger.error(`Delete user failed: ${error.message}`);
        throw error;
      }
    }
  }
};

export default userResolver;
