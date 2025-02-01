"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const API_URL = https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY};



const Chatbot = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "bot", content: "Hello! How can I assist you with Campus Dabba today?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    const lowerCaseInput = input.toLowerCase().trim();
    if (hardcodedResponses[lowerCaseInput]) {
      setMessages((prev) => [...prev, { role: "bot", content: hardcodedResponses[lowerCaseInput] }]);
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: input }] }]
        })
      });
      const data = await response.json();
      
      let botResponse = "I'm having trouble understanding. Please try again.";
      if (data.candidates && data.candidates.length > 0) {
        botResponse = data.candidates[0]?.content?.parts?.map((part: any) => part.text).join("\n") || botResponse;
      }
      
      setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { role: "bot", content: "Oops! Something went wrong. Please try again later." }]);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-lg h-[80vh] flex flex-col shadow-xl rounded-2xl bg-black/70 backdrop-blur-lg border border-gray-700 overflow-hidden"
      >
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`max-w-[75%] p-3 rounded-xl shadow-md text-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "ml-auto bg-blue-600 text-white"
                  : "mr-auto bg-gray-800 text-white"
              }`}
            >
              {msg.content}
            </motion.div>
          ))}
        </CardContent>
        <div className="p-4 flex items-center space-x-2 border-t bg-black/80 backdrop-blur-lg">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white"
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button onClick={sendMessage} className="rounded-full p-2 bg-blue-600 hover:bg-blue-700">
              <Send size={20} className="text-white" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Chatbot;