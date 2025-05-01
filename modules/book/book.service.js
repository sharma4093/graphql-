import { NotFoundError, ValidationError } from "../../utils/error.js";
import logger from "../../utils/logger.js";
import { validate, bookSchemas } from "../../utils/validation.js";
import mongoose from "mongoose";
import prisma from "../../database/database.js";


class BookService {

   dummyData = async ()=>{
    try {
      console.log("Adding.....")
const x =     await prisma.library.createMany({
  data: [
    { name: 'Central Library', open_timings: 'Mon-Fri: 9 AM - 6 PM' },
    { name: 'East Side Branch', open_timings: 'Mon-Fri: 10 AM - 5 PM' },
    { name: 'West End Library', open_timings: 'Mon-Sat: 8 AM - 7 PM' },
    { name: 'South Park Library', open_timings: 'Mon-Sun: 9 AM - 8 PM' },
    { name: 'City Plaza Library', open_timings: 'Mon-Fri: 9 AM - 5 PM' },
    { name: 'Downtown Library', open_timings: 'Mon-Fri: 9 AM - 6 PM' },
    { name: 'Maplewood Library', open_timings: 'Mon-Sun: 9 AM - 6 PM' },
    { name: 'Sunset Library', open_timings: 'Mon-Sat: 10 AM - 6 PM' },
    { name: 'Hillcrest Library', open_timings: 'Mon-Fri: 9 AM - 7 PM' },
    { name: 'North Branch Library', open_timings: 'Mon-Sun: 8 AM - 5 PM' },
    { name: 'Riverdale Library', open_timings: 'Mon-Fri: 10 AM - 5 PM' },
    { name: 'Oak Street Library', open_timings: 'Mon-Sat: 9 AM - 8 PM' },
    { name: 'Greenfield Library', open_timings: 'Mon-Sun: 10 AM - 6 PM' },
    { name: 'Lakeside Library', open_timings: 'Mon-Fri: 9 AM - 6 PM' },
    { name: 'Cedar Park Library', open_timings: 'Mon-Sun: 10 AM - 7 PM' },
    { name: 'Silverstone Library', open_timings: 'Mon-Fri: 9 AM - 5 PM' },
    { name: 'Redwood Library', open_timings: 'Mon-Sat: 8 AM - 5 PM' },
    { name: 'Sunrise Library', open_timings: 'Mon-Fri: 10 AM - 7 PM' },
    { name: 'Parkside Library', open_timings: 'Mon-Sun: 9 AM - 6 PM' },
    { name: 'Woodland Library', open_timings: 'Mon-Sun: 9 AM - 8 PM' }
  ],
});

    console.log("added......",x)
      return "Books are added!"
    } catch (error) {
      console.log(error)
    }
  }

  async getAllBooks() {
    try {
      return await book_model.find();
    } catch (error) {
      logger.error(`Error fetching books: ${error.message}`);
      throw error;
    }
  }


  async getBookById(id) {
    try {
      if (!id) {
        throw new ValidationError('Invalid book ID format');
      }
      console.log(typeof id)
      // const book = await prisma.book.findUnique({where:{id:parseInt(id)}});
      const book = await prisma.book.findUnique({
        where: { id: parseInt(id) },
        include: {
          bookavailibilities: {
            include: {
              libs: true,  // Include the library details in the result
              timeslots: true,  // Include timeslot details
            },
          },
        },
      });

      if (!book) {
        throw new NotFoundError(`Book with ID ${id} not found`);
      }
console.log("books", book)
      return book;
    } catch (error) {
      logger.error(`Error fetching book by ID: ${error.message}`);
      throw error;
    }
  }


  async createBook(bookData) {
    try {
      // Validate input data
      const validatedData = validate(bookData, bookSchemas.createBook);
      
      // Create book with validated data
      const book = await prisma.book.create({
        ...validatedData,
        status: 'free',
        booked_slots: []
      });
      
      logger.info(`Book created with ID: ${book.id}`);
      return book;
    } catch (error) {
      logger.error(`Error creating book: ${error.message}`);
      throw error;
    }
  }


  // Insert books
  async createBulkBooks(booksData) {
    try {
      if (!Array.isArray(booksData) || booksData.length === 0) {
        throw new ValidationError('Invalid books data format');
      }


      const validatedBooks = booksData.map(book => 
        validate(book, bookSchemas.createBook)
      );


      const booksToInsert = validatedBooks.map(book => ({
        ...book,
        time_slot: 60,
        status: 'free',
        booked_slots: []
      }));

      const result = await book_model.insertMany(booksToInsert);
      logger.info(`${result.length} books created successfully`);
      return result;
    } catch (error) {
      logger.error(`Error creating bulk books: ${error.message}`);
      throw error;
    }
  }


  async updateBook(updateData) {
    try {
      // Validate update data
      const validatedData = validate(updateData, bookSchemas.updateBook);
      
      const book = await book_model.findByIdAndUpdate(
        validatedData.id,
        { 
          book_name: validatedData.book_name,
          author: validatedData.author
        },
        { new: true, runValidators: true }
      );
      
      if (!book) {
        throw new NotFoundError(`Book with ID ${validatedData.id} not found`);
      }
      
      logger.info(`Book ${book.id} updated successfully`);
      return book;
    } catch (error) {
      logger.error(`Error updating book: ${error.message}`);
      throw error;
    }
  }


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
      
      book.booked_slots.push({
        from_time: new Date(from_time),
        end_time: new Date(end_time)
      });
      
      book.status = book.booked_slots.length > 0 ? 'booked' : 'free';
      
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