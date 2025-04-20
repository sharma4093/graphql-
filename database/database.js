import mongoose from "mongoose";

const connectDB = async () => { 
    try {
        await mongoose.connect("mongodb+srv://graphdbuser:psRr8kKsbHOBP4LU@graphscluster.kyaozwu.mongodb.net/")
        console.log("databae is connected successfully"); 
    } catch (error) {
        return console.log("Error connecting to MongoDB:", error.message);
    }
}

export default {connectDB}