// import { useState } from "react";
// import { useRouter } from "next/router";
// import axios from "axios";

// const Page = () => {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [questions, setQuestions] = useState("");
//   const router = useRouter();

//   const userId = "example-user-id"; // Replace with actual user ID logic

//   const handleSendMessage = async () => {
//     try {
//       const response = await axios.post("/api/messages", {
//         userId,
//         content: message,
//       });
//       setMessages([...messages, response.data]);
//       setMessage("");
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const handleGenerateQuestions = async () => {
//     try {
//       const response = await axios.get("/api/generate-questions");
//       setQuestions(response.data.questions);
//     } catch (error) {
//       console.error("Error generating questions:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {/* Public Profile Link Section */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-bold mb-4">Public Profile Link</h1>
//         <div className="mb-4">
//           <input
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Send Anonymous Message"
//             className="border p-2 w-full rounded-lg"
//           />
//           <button
//             onClick={handleSendMessage}
//             className="bg-blue-500 text-white p-2 rounded-lg mt-2"
//           >
//             Send it
//           </button>
//         </div>
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold">Messages</h2>
//           <ul>
//             {messages.map((msg, index) => (
//               <li key={index} className="border-b p-2">
//                 {msg.content}
//               </li>
//             ))}
//           </ul>
//         </div>
//         <button
//           onClick={() => router.push("/signup")}
//           className="bg-green-500 text-white p-2 rounded-lg"
//         >
//           Create Account
//         </button>
//       </div>

//       {/* AI Generated Questions Section */}
//       <div>
//         <h1 className="text-2xl font-bold mb-4">AI Generated Questions</h1>
//         <button
//           onClick={handleGenerateQuestions}
//           className="bg-blue-500 text-white p-2 rounded-lg mb-4"
//         >
//           Generate Questions
//         </button>
//         <div className="border p-4 rounded-lg">
//           {questions ? (
//             <p>{questions}</p>
//           ) : (
//             <p className="text-gray-500">
//               Click "Generate Questions" to see AI-generated questions.
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;
