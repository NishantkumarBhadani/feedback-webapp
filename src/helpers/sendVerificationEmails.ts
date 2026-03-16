import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmails";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmails(
    email:string,
    username:string,
    verifyCode:string): Promise<ApiResponse>{
        try {
            await resend.emails.send({
                from:'onboarding@resend.com',
                to: email,
                subject:'feedback-wepapp | Verification code',
                react: VerificationEmail({username,otp:verifyCode}),
            });
            return{ success:true, message:"Verification code send successfully"}
        } catch (emailError) {
            console.log("Error sending verification email.",emailError);
            return {success:false,message:"Failed to send verification email."}
            
        }
    }