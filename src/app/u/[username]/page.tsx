"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import * as z from "zod";
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MessageSchema } from "@/schemas/messageSchema";

const specialChar = "||";

const parseStringMessages = (messageString: string = ""): string[] => {
  console.log("Parsing messages:", messageString); // Debugging: Log the message string
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  if (!params) {
    // Handle the case where params is null, e.g., show an error message or return early
    return <div>Error: Username not found</div>;
  }
  const username = params.username;

  const form = useForm<z.infer<typeof MessageSchema>>({
    resolver: zodResolver(MessageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessages, setGeneratedMessages] =
    useState(initialMessageString);
  const [heading, setHeading] = useState(false);

  const onSubmit = async (data: z.infer<typeof MessageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuestions = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.get<ApiResponse>("/api/suggest-questions");

      // Check if the response data is valid JSON
      if (response.data && typeof response.data === "object") {
        console.log("API Response:", response.data); // Debugging: Log the API response
        setGeneratedMessages(response.data.aitext);
        setHeading(true);
        toast({
          title: "Questions Generated",
          description: "New questions have been generated using AI.",
          variant: "default",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status === 404) {
        toast({
          title: "Error",
          description: "API endpoint not found.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description:
            axiosError.response?.data.message ?? "Failed to generate questions",
          variant: "destructive",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-1xl">Send Anonymous Message to <b> @{username}</b></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <p>You can Also use this Default/AI-Generated messages insted :</p>
        </div>
        <Card>
          <CardHeader className="bg-gray-800 mb-5 rounded">
            <h3 className="text-xl font-semibold text-white">
              {heading ? "AI Generated Text" : "Default Messages"}
            </h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {parseStringMessages(generatedMessages).map((message, index) => (
              <Button
                className="bg-gray-100 hover:bg-gray-200 text-black"
                key={index}
                onClick={() => handleMessageClick(message)}
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Button
          onClick={() =>
            !isGenerating
              ? generateQuestions()
              : parseStringMessages(initialMessageString)
          }
          disabled={isGenerating}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Questions using AI"
          )}
        </Button>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
}
