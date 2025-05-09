import config from "../config/env.js";
import logger from "../utils/logger.js";
import {Prisma, PrismaClient} from "@prisma/client"

const prisma = new PrismaClient();
export default prisma;










































































// import mongoose from "mongoose";
// import config from "../config/env.js";
// import logger from "../utils/logger.js";

// // Set mongoose promise to global promise
// mongoose.Promise = global.Promise;

// // Create connection function
// const connectDB = async () => { 
//     try {
//         await mongoose.connect(config.mongoose.url, config.mongoose.options);
//         logger.info("Database connected successfully");
        
//         mongoose.connection.on('error', (err) => {
//             logger.error(`MongoDB connection error: ${err}`);
//             process.exit(1);
//         });
        
//         mongoose.connection.on('disconnected', () => {
//             logger.warn('MongoDB disconnected. Attempting to reconnect...');
//         });
        
//         mongoose.connection.on('reconnected', () => {
//             logger.info('MongoDB reconnected successfully');
//         });
        
//         process.on('SIGINT', async () => {
//             try {
//                 await mongoose.connection.close();
//                 logger.info('MongoDB connection closed due to app termination');
//                 process.exit(0);
//             } catch (err) {
//                 logger.error(`Error during MongoDB connection closure: ${err}`);
//                 process.exit(1);
//             }
//         });
        
//         return mongoose.connection;
//     } catch (error) {
//         logger.error(`Error connecting to MongoDB: ${error.message}`);
//         process.exit(1);
//     }
// };

// export default { connectDB };