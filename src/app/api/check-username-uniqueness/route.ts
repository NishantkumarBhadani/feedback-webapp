import UserModel from "@/model/User.model"
import { dbConnect } from "@/lib/dbConnect"
import { success, z } from "zod"
import { usernamevalidation } from "@/schemas/signUpSchema"

//query object for checking type
const UsernameQuerySchema = z.object({
    username: usernamevalidation
})

export async function GET(request: Request) {
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        //validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result)
        if (!result.success) {
            const usernameError = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameError?.length > 0 ? usernameError.join(', ') :
                    "Invalid query parameters"
            }, { status: 400 })
        }

        //getting username from result
        const { username } = result.data
        const existingVerifiedUsername = await UserModel.findOne({ username, isVerified: true })
        if (existingVerifiedUsername) {
            return Response.json({
                success: false,
                message: "Username already exit"
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: "Username is unique"

        },{ status: 200 })
    } catch (error) {
        console.error("Error checking username", error);
        return Response.json(
            {
                success: false,
                message: "Error while checking username"
            }, {
            status: 500
        }
        )
    }
}