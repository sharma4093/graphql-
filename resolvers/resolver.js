import { User } from "../models/user_models.js"

export const resolvers = {
    Query:{
        hello: ()=>console.log("this is quesry response"),
        getUsers:async ()=>{
            console.log("usres list")
            return await User.find();
        }
    },
    Mutation: {
        createUser: async(_,{name,email,password})=>{
            try {
           const user= await User.create({name,email,password});
           return user;
            } catch (error) {
                return error
            }
        }
    }


}