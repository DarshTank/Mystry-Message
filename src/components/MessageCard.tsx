"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User.model";
import { useToast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { Toast } from "./ui/toast";
import dayjs from "dayjs";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageID: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  const toast = useToast();

  const handleDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}` // Ensure correct URL formatting
    );
    Toast({
      title: response.data.message,
    });
    onMessageDelete(message._id as any);
  };

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{message.content}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
        </div>
      </CardHeader>
      <CardContent className="p-4 bg-white rounded-b-lg">
        {/* {" "}
        <CardDescription className="text-gray-700">
          {message.content}
          {" "}
        </CardDescription> */}
      </CardContent>
    </Card>
    // <Card className="border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
    //   <CardHeader className="p-4 bg-gray-100 rounded-t-lg">
    //     <div className="flex justify-between items-center">
    //     <CardTitle className="text-lg font-semibold text-gray-800">
    //       From a Mystery User
    //     </CardTitle>
    //     <AlertDialog>
    //       <AlertDialogTrigger asChild>
    //         <Button variant="destructive" className="hover:bg-red-600">
    //           <X className="w-5 h-5 text-white" />
    //         </Button>
    //       </AlertDialogTrigger>
    //       <AlertDialogContent>
    //         <AlertDialogHeader>
    //           <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    //           <AlertDialogDescription>
    //             This action cannot be undone. This will permanently delete your
    //             message.
    //           </AlertDialogDescription>
    //         </AlertDialogHeader>
    //         <AlertDialogFooter>
    //           <AlertDialogCancel>Cancel</AlertDialogCancel>
    //           <AlertDialogAction onClick={handleDeleteConfirm}>
    //             Continue
    //           </AlertDialogAction>
    //         </AlertDialogFooter>
    //       </AlertDialogContent>
    //     </AlertDialog>
    //   </CardHeader>
    //   <CardContent className="p-4 bg-white rounded-b-lg">
    //     <CardDescription className="text-gray-700">
    //       {message.content}
    //     </CardDescription>
    //   </CardContent>
    //   </div>
    // </Card>
  );
};

export default MessageCard;
