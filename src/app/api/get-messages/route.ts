import { getServerSession } from "next-auth"; // Provides the current sesion.
import UserModel from "@/model/User.model";
import { User } from "next-auth"; // validate the user type
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";



export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions); // must pass authOption here otherwise it won't get the current session.
    const user: User = session?.user as User //assertion 

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id); //Somatimes while using aggragation pipelines it may happen
                                                        // that you got te wrong type of the varible as out _id is in string, normally mongo take care of that but while aggragation we need to take care of that
    try {
        const user=await UserModel.aggregate([
            {$match:{id: userId}},
            {$unwind :'$messages'}, // unwind is used to unwind the message array it basically create object for every array element with same id, email,username...
            {$sort :{'message.createdAt':-1}}, // sorting based on creaated at -1 is for desending
            {$group :{_id: '$_id',messages :{$push :'$messages'}}} //grouped messages based on the id

        ])
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:401})
        }

        return Response.json({
                success:true,
                messages:user[0].messages,//mongo aggragate always return a array
                message:"successfully fetched messages"
            },{status:200})
    } catch (error) {
        console.log("Error while fetching messages of user");
        return Response.json({
            success:false,
            message:"Error while fething user messages"
        },{status:500})
    }
}