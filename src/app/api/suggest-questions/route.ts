import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Ensure your API key is set in environment variables
});

export const GET = async () => {
  try {
    const chatCompletion = await getGroqChatCompletion();
    const aitext =
      chatCompletion.choices[0]?.message?.content || "No questions generated.";
    console.log(aitext);

    return NextResponse.json({ aitext }, { status: 200 });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
};

const getGroqChatCompletion = async () => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content:
          "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction.Every time the question should be different from previous questions.",
      },
    ],
    model: "mixtral-8x7b-32768",
    temperature: 0.5,
    max_completion_tokens: 1024,
    top_p: 1,
    stop: null,
    stream: false,
  });
};
