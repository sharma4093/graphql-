import express from "express"
import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from "@apollo/server/express4"
import typeDefs from "./graphql/typeDefs.js"
import resolvers from "./graphql/resolver.js"
import morgan from "morgan";
import helmet from "helmet";
import auth from "./middlewares/auth_middleware.js";
import config from "./config/env.js";
import logger from "./utils/logger.js";
import { formatError } from "./utils/error.js";
import {WebSocketServer} from "ws"
import {createServer} from "http"


const app = express();

const httpServer = createServer(app);
const port = 5000;
app.use(express.json());
app.use(morgan("dev"));


const wsServer = new WebSocketServer({server: httpServer});
console.log("websocket server ", wsServer)





app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false }));


const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError,
  introspection: config.env !== 'production',
  
});

await server.start();
app.use(
  "/graphql",
  expressMiddleware(server, { context: auth })
);
app.get("/", (req, res) => {
  res.json({ status: "healthy", message: "Book booking API is running" });
})

app.listen(config.port, async () => {
  try {
    // await database.connectDB();
    logger.info(`Server running on port ${config.port} in ${config.env} mode`);
  } catch (error) {
    logger.error(`Server failed to start: ${error.message}`);
    await server.stop();
    process.exit(1);
  }
})

process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  logger.error(`Unhandled Rejection: ${error.message}`, error);
  process.exit(1);
});