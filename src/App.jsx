import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_KEY = "AIzaSyCSPSvPwyShLAHz2HweE5kpQ6CnPYI1ukA";
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
    API_KEY;

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post(API_URL, {
        contents: [{ role: "user", parts: [{ text: input }] }],
      });

      const botContent =
        response.data.candidates?.[0]?.content?.parts
          ?.map((part) => part.text)
          .join(" ") || "Sorry, I couldn't process that.";
      const botMessage = {
        role: "bot",
        content: botContent,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching response: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <div className="relative">
        <button
          className="absolute inset-0 mx-auto my-auto inline-flex items-center justify-center text-sm font-medium border rounded-full w-16 h-16 bg-black hover:bg-gray-700 cursor-pointer border-gray-200 p-0 normal-case"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg border w-[440px] h-[634px] shadow-lg">
            <div className="flex flex-col space-y-1.5 pb-6">
              <h2 className="font-semibold text-lg">Chatbot</h2>
              <p className="text-sm text-gray-500">Powered by Gemini API</p>
            </div>

            <div className="pr-4 h-[474px] overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 my-4 text-gray-600 text-sm ${
                    msg.role === "user" ? "justify-end" : ""
                  }`}
                >
                  <p
                    className={`p-2 rounded-lg ${
                      msg.role === "user" ? "bg-blue-200" : "bg-gray-200"
                    }`}
                  >
                    <strong>{msg.role === "user" ? "You" : "AI"}</strong>:{" "}
                    {msg.content}
                  </p>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 my-4 text-gray-600 text-sm">
                  <p className="p-2 rounded-lg bg-gray-200">
                    AI is thinking...
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center pt-2">
              <form
                onSubmit={sendMessage}
                className="flex items-center justify-center w-full space-x-2"
              >
                <input
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Thinking..." : "Send"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
