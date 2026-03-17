import UserModel from "@/model/User.model";
import { dbConnect } from "@/lib/dbConnect";
import {Message} from "@/model/User.model"

export async function POST(request:Request) {
    await dbConnect();

    const {username,content}=await request.json()

    try {
        const user= await UserModel.findOne({username})
        if(!user){
            return Response.json({
            success: false,
            message: "User not found"
        }, { status: 401 })
        }
    //is usesr accepting message
    if(!user.isAcceptingMessages){
          return Response.json({
            success: false,
            message: "User is not accepting messages"
        }, { status: 403 })
    }

    const newMessage={content, createdAt:new Date()}
    user.message.push(newMessage as Message);
    await user.save();
      return Response.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200})
    } catch (error) {
        console.log("Error while sending message");
          return Response.json({
            success: false,
            message: "Error while sending message"
        }, { status: 500 })
    }
}
