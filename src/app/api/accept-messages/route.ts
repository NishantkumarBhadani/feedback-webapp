import { getServerSession } from "next-auth"; // Provides the current sesion.
import UserModel from "@/model/User.model";
import { User } from "next-auth"; // validate the user type
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/option";


//for updating the user accepting message
export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions); // must pass authOption here otherwise it won't get the current session.
    const user: User = session?.user as User //assertion 

    if (!session || !user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = user._id;
    const { acceptMessages } = await request.json()
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,
            { isAcceptingMessages: acceptMessages },
            { new: true } //return updated value
        )
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, { status: 401 })
        }
        return Response.json({
            success: true,
            message: "Message acceptance status updated successfully",
            updatedUser
        }, { status: 200 })
    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })
    }
}

// for cgecking is user accepting messages
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

    const userId = user._id;

    const foundUser = await UserModel.findById(userId);
    try {
        if (!foundUser) {
        return Response.json({
            success: false,
            message: "Failed to found the user"
        }, { status: 404 })
    }

            return Response.json({
            success: true,
            isAcceptingMessages:foundUser.isAcceptingMessages,
            message: "Successfully checked user is accepting message or not"
        }, { status: 401 })
    } catch (error) {
        console.log("Error in getting user acceptance messages or not")
        return Response.json({
            success: false,
            message: "Error in getting user acceptance messages or not"
        }, { status: 500 })
    }
}