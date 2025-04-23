

import {mergeResolvers} from '@graphql-tools/merge'
import bookResolver from '../modules/book/book_resolver.js'
import userResolver from '../modules/user/user_resolver.js'

const resolvers = mergeResolvers([bookResolver,userResolver])
export default resolvers
