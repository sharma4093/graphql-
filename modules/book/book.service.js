import { book_model } from "../../models/bookModel.js";
import { NotFoundError, ValidationError } from "../../utils/error.js";
import logger from "../../utils/logger.js";
import { validate, bookSchemas } from "../../utils/validation.js";
import mongoose from "mongoose";

/**
 * Service layer for book operations
 */
class BookService {
  /**
   * Get all books
   * @returns {Promise<Array>} List of books
   */
  async getAllBooks() {
    try {
      return await book_model.find();
    } catch (error) {
      logger.error(`Error fetching books: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get book by ID
   * @param {string} id - Book ID
   * @returns {Promise<Object>} Book object
   */
  async getBookById(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid book ID format');
      }

      const book = await book_model.findById(id);
      if (!book) {
        throw new NotFoundError(`Book with ID ${id} not found`);
      }

      return book;
    } catch (error) {
      logger.error(`Error fetching book by ID: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new book
   * @param {Object} bookData - Book data
   * @returns {Promise<Object>} Created book
   */
  async createBook(bookData) {
    try {
      // Validate input data
      const validatedData = validate(bookData, bookSchemas.createBook);
      
      // Create book with validated data
      const book = await book_model.create({
        ...validatedData,
        time_slot: 60, // Default time slot in minutes
        status: 'free',
        booked_slots: []
      });
      
      logger.info(`Book created with ID: ${book._id}`);
      return book;
    } catch (error) {
      logger.error(`Error creating book: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create multiple books
   * @param {Array} booksData - Array of book data
   * @returns {Promise<Array>} Created books
   */
  async createBulkBooks(booksData) {
    try {
      if (!Array.isArray(booksData) || booksData.length === 0) {
        throw new ValidationError('Invalid books data format');
      }

      // Validate each book
      const validatedBooks = booksData.map(book => 
        validate(book, bookSchemas.createBook)
      );

      // Add default fields
      const booksToInsert = validatedBooks.map(book => ({
        ...book,
        time_slot: 60,
        status: 'free',
        booked_slots: []
      }));

      // Insert books
      const result = await book_model.insertMany(booksToInsert);
      logger.info(`${result.length} books created successfully`);
      return result;
    } catch (error) {
      logger.error(`Error creating bulk books: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a book
   * @param {Object} updateData - Update data with ID
   * @returns {Promise<Object>} Updated book
   */
  async updateBook(updateData) {
    try {
      // Validate update data
      const validatedData = validate(updateData, bookSchemas.updateBook);
      
      const book = await book_model.findByIdAndUpdate(
        validatedData._id,
        { 
          book_name: validatedData.book_name,
          author: validatedData.author
        },
        { new: true, runValidators: true }
      );
      
      if (!book) {
        throw new NotFoundError(`Book with ID ${validatedData._id} not found`);
      }
      
      logger.info(`Book ${book._id} updated successfully`);
      return book;
    } catch (error) {
      logger.error(`Error updating book: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a book
   * @param {string} id - Book ID
   * @returns {Promise<string>} Success message
   */
  async deleteBook(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ValidationError('Invalid book ID format');
      }

      const book = await book_model.findByIdAndDelete(id);
      
      if (!book) {
        throw new NotFoundError(`Book with ID ${id} not found`);
      }
      
      logger.info(`Book ${id} deleted successfully`);
      return `Book deleted successfully`;
    } catch (error) {
      logger.error(`Error deleting book: ${error.message}`);
      throw error;
    }
  }

  /**
   * Book a book for a time slot
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Updated book
   */
  async bookTimeSlot(bookingData) {
    try {
      // Validate booking data
      const validatedData = validate(bookingData, bookSchemas.bookingBook);
      
      const { book_id, from_time, end_time } = validatedData;
      
      // Find the book
      const book = await book_model.findById(book_id);
      if (!book) {
        throw new NotFoundError(`Book with ID ${book_id} not found`);
      }
      
      // Check for booking conflicts
      const hasConflict = book.booked_slots.some(slot => {
        const slotFrom = new Date(slot.from_time);
        const slotEnd = new Date(slot.end_time);
        const newFrom = new Date(from_time);
        const newEnd = new Date(end_time);
        
        // Check if new booking overlaps with existing booking
        return (
          (newFrom >= slotFrom && newFrom < slotEnd) || 
          (newEnd > slotFrom && newEnd <= slotEnd) ||
          (newFrom <= slotFrom && newEnd >= slotEnd)
        );
      });
      
      if (hasConflict) {
        throw new ValidationError('The book is already booked for this time slot');
      }
      
      // Add the new booking slot
      book.booked_slots.push({
        from_time: new Date(from_time),
        end_time: new Date(end_time)
      });
      
      // Update status based on booked slots
      book.status = book.booked_slots.length > 0 ? 'booked' : 'free';
      
      // Save the book
      await book.save();
      
      logger.info(`Book ${book_id} booked successfully for time slot`);
      return book;
    } catch (error) {
      logger.error(`Error booking time slot: ${error.message}`);
      throw error;
    }
  }
}

export default new BookService(); 