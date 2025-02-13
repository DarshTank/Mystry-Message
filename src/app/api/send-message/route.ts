import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";
import { request } from "http";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found : send-messages",
        },
        { status: 404 }
      );
    }

    // is user accepting the message

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "Not accepting the messages : send-messages",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully : send-messages",
      },
      { status: 403 }
    );
  } catch (error) {
    console.log("Error adding messages", error);

    return Response.json(
      {
        success: false,
        message: "Internal Server Error : send-messages",
      },
      { status: 500 }
    );
  }
}
