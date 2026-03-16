import UserModel from "@/model/User.model";
import {success, z} from 'zod'
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request:Request){
    await dbConnect();
    try {
        const {username, code}=await request.json()
        const decodedUsername=decodeURIComponent(username);//it is difficult to extract data from raw uri so do this
        const user = await UserModel.findOne({username:decodedUsername})
        
        if(!user){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {status:500}
            )
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpiered=new Date(user.verifyCodeExpiry) > new Date();


        if(isCodeValid && isCodeNotExpiered){
            user.isVerified=true
            await user.save()

            return (
                Response.json({
                    success:true,
                    message:"Account verified succcessfully"
                },{status:200})
            )
        }
        else if(!isCodeNotExpiered){
             return (
                Response.json({
                    success:false,
                    message:"Verification code expired, please signup again"
                },{status:400})
            )
        }
        else{
             return (
                Response.json({
                    success:false,
                    message:"Invalid verification code"
                },{status:400})
            )
        }
    } catch (error) {
        console.log("Error verifying user",error);
        return (
            Response.json({
                success:false,
                message:"Error verifying user."
            },{status:500})
        )
    }
}