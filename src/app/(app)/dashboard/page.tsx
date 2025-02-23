"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/model/User.model";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const isInitialLoad = useRef(true); // Track initial load to prevent duplicate calls

  const toast = useToast();
  const { data: session, status } = useSession();
  const form = useForm({ resolver: zodResolver(acceptMessageSchema) });
  const { register, watch, setValue } = form;

  const acceptMessage = watch("acceptMessages");

  const fetchData = useCallback(async (refresh = false) => {
    if (isLoading) return; // Prevent overlapping requests
    setIsLoading(true);
    console.log("Fetching data..."); // Debugging: Track when request is made

    try {
      const [messagesResponse, acceptResponse] = await Promise.all([
        axios.get<ApiResponse>("/api/get-messages"),
        axios.get<ApiResponse>("/api/accept-messages"),
      ]);

      setMessages(messagesResponse.data.messages || []);
      setValue("acceptMessages", acceptResponse.data.isAcceptingMessage ?? true);

      if (refresh) {
        toast.toast({
          title: "Refreshed Messages",
          description: "Showing latest Messages",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [setValue, toast, isLoading]);

  useEffect(() => {
    // Only fetch data on first load
    if (status === "authenticated" && isInitialLoad.current) {
      isInitialLoad.current = false;
      fetchData();
    }
  }, [status, fetchData]);

  // Handle switch change
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessage,
      });
      setValue("acceptMessages", !acceptMessage);
      toast.toast({
        title: response.data.message,
        variant: "default",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.toast({
        title: "Error",
        description:
          axiosError.response?.data.message || "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  };

  const copyToClipboard = () => {
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${session?.user?.username}`;
    navigator.clipboard.writeText(profileUrl);
    toast.toast({
      title: "Profile URL copied",
      description: "Profile URL has been copied to clipboard",
    });
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please Login</div>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your URL Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={`${window.location.protocol}//${window.location.host}/u/${session?.user?.username}`}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4 flex items-center">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessage ? "On" : "Off"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={() => fetchData(true)}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as any}
              message={message}
              onMessageDelete={(id) =>
                setMessages(messages.filter((msg) => msg._id !== id))
              }
            />
          ))
        ) : (
          <p>No Messages to Display</p>
        )}
      </div>
    </div>
  );
};

export default Page;
