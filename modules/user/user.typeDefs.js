import {gql} from "graphql-tag"
const userTypeDefs = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUserDetails: User
    getUsers: [User]
  }

  type Mutation {
  signup(name: String!, email: String!, password: String!): AuthPayload
  login(email: String!, password: String!): AuthPayload
  updateUser(name: String, email: String, password: String): User
  deleteUser(userId: ID!): String
}
`;

export default userTypeDefs;
