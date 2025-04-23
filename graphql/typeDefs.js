import { mergeTypeDefs } from "@graphql-tools/merge"
import bookTypeDefs from "../modules/book/book.typeDefs.js"
import userTypeDefs from "../modules/user/user.typeDefs.js"

const typeDefs = mergeTypeDefs([bookTypeDefs,userTypeDefs])
export default typeDefs