import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found : verify-code",
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account Verified Sucessfully : verify-code",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification Code has Expired please sign-up again to get new code : verify-code",
        },
        { status: 500 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification Code : verify-code",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error verifying user : verify-code", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user: verify-code",
      },
      { status: 500 }
    );
  }
}
