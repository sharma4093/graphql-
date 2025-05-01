import prisma from "../../database/database.js";


class LibraryService{
    getLibraries = async()=>{
        try {
            return  await prisma.library.findMany();
              
        } catch (error) {
            throw error 
        }
    }
    getLibraryDetails = async(libraryId)=>{
        try {
            console.log("this is id", parseInt(libraryId))
            return await prisma.library.findUnique({where:{id:parseInt(libraryId)}});
        } catch (error) {
            throw error 
        }
    }

    addBookToLibrary = async (libraryId, bookId, start_time, end_time) => {
        try {
          return await prisma.bookAvailibility.create({
            data: {
              bookId: parseInt(bookId),
              libsId: parseInt(libraryId),
              timeslots: {
                create: [
                  {
                    start_time: new Date(start_time),
                    end_time: new Date(end_time),
                  },
                ],
              },
            },
            include: {
              timeslots: true,
            },
          });
        } catch (error) {
          throw error;
        }
      };
      




}


export default new LibraryService()