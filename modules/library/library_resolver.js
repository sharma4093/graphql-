import LibraryService from "./library.service.js"


const libraryResolver = {
    Query:{
        getLibraryDetails: async(_,args, {user})=>{
            try {console.log("args ", args)
                return await LibraryService.getLibraryDetails(parseInt(args.id))
    
            } catch (error) {
                throw error 
            }
        },
        getLibraries: async ()=>{
            try {
                console.log("called")
                const x = await LibraryService.getLibraries()
                console.log("x",x)
                return x

            } catch (error) {
                throw error 
            }
            
        }
    },
    Mutation:{
       
    }
}


export default libraryResolver