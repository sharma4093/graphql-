

import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String!
  }

  
  type Query {
    hello: String!
    getUsers: [User]
  }

  type Mutation {
    createUser(name: String!, email: String!, password: String!): User
  }
`;

export default typeDefs;

