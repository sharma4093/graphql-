import bookService from "./book.service.js";
import logger from "../../utils/logger.js";
import prisma from "../../database/database.js";
import LibraryService from "../library/library.service.js";



const bookResolver = {
    Query: {
        getBookDetails: async (_, { id }, { user }) => {
            if (!user) throw new Error('Not authenticated');
            return await bookService.getBookById(id);
        },

        getBooks: async (_, args, { user }) => {
            try {   
                const page = args.page
                const size = args.size
                const skip =( page-1 )* size
                return await prisma.book.findMany({skip:skip, take:size});
            } catch (error) {
                logger.error(`Failed to get books: ${error.message}`);
                throw error;
            }
        },
        dummyBooks: async()=>{
            try {
                await bookService.dummyData();
                console.log("Done ");
                return "books are added"
            } catch (error) {
                console.log(error)
            }

        }
    },
    
    // Book: {
    //     book_availibility: (parent) => parent.bookavailibilities
    // },
    
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
        
        deleteBook: async (_, { id }, { user }) => {
            try {
                if (!user) throw new Error('Not authenticated');
                return await bookService.deleteBook(id);
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
                    user_id: booking.user_id || user.id // Use provided user_id or default to current user
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
        },

        addBookToLibrary: async(_,args,{user})=>{
            try {
                const {library_id, book_id, start_time, end_time} = args
                
                return await LibraryService.addBookToLibrary(library_id, book_id, start_time, end_time);
            } catch (error) {
                throw error
            }
        }
    }
};

export default bookResolver;