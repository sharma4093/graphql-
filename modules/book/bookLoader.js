import DataLoader from "dataloader"
import prisma from "../../database/database";



const bookBatches = async(userId)=>{
    const {rows } = await prisma.book.findMany({where:{userId: userId}});
    return userId.map(userId=> rows.filter(book=>book.userId === userId));
}


const bookLoader = new DataLoader(bookBatches);


