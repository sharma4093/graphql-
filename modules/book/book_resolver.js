import bookService from "./book.service.js";
import { authGuard } from "../../middlewares/auth_middleware.js";
import logger from "../../utils/logger.js";

const bookResolver = {
    Query: {
        getBookDetails: async (_, { _id }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            return await bookService.getBookById(_id);
        },

        getBooks: async (_, __, { user }) => {
            try {
                return await bookService.getAllBooks();
            } catch (error) {
                logger.error(`Failed to get books: ${error.message}`);
                throw error;
            }
        }
    },
    
    Mutation: {
        addBook: async (_, args, { user }) => {
            try {
                if (!user) throw new Error('Not authenticated');
                return await bookService.createBook(args);
            } catch (error) {
                logger.error(`Failed to add book: ${error.message}`);
                throw error;
            }
        },
        
        addBooksInBulk: async (_, { books }, { user }) => {
            try {
                if (!user) throw new Error('Not authenticated');
                return await bookService.createBulkBooks(books);
            } catch (error) {
                logger.error(`Failed to add books in bulk: ${error.message}`);
                throw error;
            }
        },
        
        updateBook: async (_, args, { user }) => {
            try {
                if (!user) throw new Error('Not authenticated');
                return await bookService.updateBook(args);
            } catch (error) {
                logger.error(`Failed to update book: ${error.message}`);
                throw error;
            }
        },
        
        deleteBook: async (_, { _id }, { user }) => {
            try {
                if (!user) throw new Error('Not authenticated');
                return await bookService.deleteBook(_id);
            } catch (error) {
                logger.error(`Failed to delete book: ${error.message}`);
                throw error;
            }
        },
        
        booksBooking: async (_, { booking }, { user }) => {
            try {
                if (!user) throw new Error('Not authenticated');
                
                const bookingData = {
                    ...booking,
                    user_id: booking.user_id || user._id // Use provided user_id or default to current user
                };
                
                const result = await bookService.bookTimeSlot(bookingData);
                
                // Add to user's book history if successful
                // This could be better handled through an event system
                // or a transaction in a real-world application
                
                return result;
            } catch (error) {
                logger.error(`Failed to book: ${error.message}`);
                throw error;
            }
        }
    }
};

export default bookResolver;