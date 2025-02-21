"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import messages from "@/messages.json";

const Home = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-4 md:px-24 py-0 min-h-screen w-full bg-white">
        <section className="text-center mb-8 md:mb-12 mt-0 w-full">
          <h1 className="text-4xl md:text-6xl font-extrabold text-black shadow-lg p-4">
            Dive into the World of Anonymous Conversations
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-gray-600">
            Explore Mystry Message - Where your identity remains a secret.
          </p>
        </section>
        <Carousel
          plugins={[AutoPlay({ delay: 2000 })]}
          className="w-full max-w-md"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-2">
                <Card className="shadow-md rounded-lg transform transition-transform hover:scale-105 bg-white border border-gray-200">
                  <CardHeader className="text-lg font-semibold text-gray-800 p-4">
                    {message.title}
                  </CardHeader>
                  <CardContent className="flex items-center justify-center p-4">
                    <span className="text-base font-semibold text-gray-700">
                      {message.content}
                    </span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </main>
      <footer className="text-center p-4 md:p-6 bg-gray-200 text-gray-800 shadow-inner w-full">
        © 2025 Mystry Message. All Rights Reserved.
      </footer>
    </>
  );
};

export default Home;
