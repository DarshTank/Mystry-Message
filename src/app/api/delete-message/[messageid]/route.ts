import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";
import type { User } from "next-auth";

export async function DELETE(
  request: NextRequest,
  context: { params: { messageid?: string } }
): Promise<NextResponse> {
  const { params } = context;

  // Validate message ID parameter
  if (!params?.messageid) {
    return NextResponse.json(
      { success: false, message: "Message ID is required" },
      { status: 400 }
    );
  }

  // Connect to the database
  await dbConnect();

  // Retrieve session and ensure user is authenticated
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const user = session.user as User & { _id: string };

  // Validate that the user has an ID
  if (!user._id) {
    return NextResponse.json(
      { success: false, message: "User ID is missing" },
      { status: 400 }
    );
  }

  try {
    // Update the user document by pulling the message with the given messageid from the messages array
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: params.messageid } } }
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message Deleted Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in delete message route:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
