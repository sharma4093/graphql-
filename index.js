import express from "express"
import {ApolloServer} from "@apollo/server"
import {expressMiddleware} from "@apollo/server/express4"
import typeDefs from "./schema/typeDefs.js";
import { resolvers } from "./resolvers/resolver.js";
import database from "./database/database.js"
import morgan from "morgan";

const app = express();
const port = 5000;
app.use(express.json());
app.use(morgan("dev"));


const server = new ApolloServer({typeDefs,resolvers,introspection:true});

await server.start();
app.use(expressMiddleware(server,app.get("/graphql",(req,res)=>{
    try {
        console.log("server is running  ")
        res.send("server is running").status(200);
    } catch (error) {
        res.send("error").status(400)
    }
})));





app.listen(port,async()=>{
    try {
        await database.connectDB();
        console.log("server is running")
    } catch (error) {
        console.log("error",error)
    }
})