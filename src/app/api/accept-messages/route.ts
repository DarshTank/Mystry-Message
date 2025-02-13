import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;
  //   const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Auhenticated : accept-messages",
      },
      { status: 401 }
    );
  }

  const userID = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userID,
      {
        isAcceptingMessage: acceptMessages,
      },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message:
            "Fail to update user status to accept messages : accept-messages",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "Message Acceptance status updated sucessfully : accept-messages",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Fail to update user status to accept messages : accept-messages"
    );
    return Response.json(
      {
        success: false,
        message:
          "Fail to update user status to accept messages : accept-messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  const user: User = session?.user as User;
  //   const user = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Auhenticated : accept-messages",
      },
      { status: 401 }
    );
  }

  const userID = user._id;

  try {
    const foundUser = await UserModel.findById(userID);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found : accept-messages",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(
      "Fail to update user status to accept messages : accept-messages"
    );
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status : accept-messages",
      },
      { status: 500 }
    );
  }
}
