import {gql} from "graphql-tag"
const bookTypeDefs = gql`
   
  scalar Date

  type booked_slots{
    from_time: Date
    end_time: Date
  }

  input BookInput{
    book_name:String
    author: String
  }

  input bookBookingInput{
    book_id: ID!
    user_id: ID!
    from_time: Date
    end_time: Date
  }

  type Book {
    _id: ID!
    book_name: String!
    author: String!
    time_slot: Int!
    status: String!
    booked_slots: [booked_slots]!
  }


    type Query {
        getBookDetails: Book
        getBooks: [Book]
    }

    type Mutation {
        addBook(book_name: String!, author: String!): Book
        addBooksInBulk(books: [BookInput!]!): Book
        updateBook(_id: ID!, book_name: String!,author:String!): Book
        deleteBook(_id: ID!): String
        booksBooking(booking: bookBookingInput ):Book
    }

`;

export default bookTypeDefs
