"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import getFinancialAdvice from "utils/getFinancialAdvice";

export default function Chat({ totalBudget, totalIncome, totalSpend }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");

    try {
      const advice = await getFinancialAdvice(
        totalBudget,
        totalIncome,
        totalSpend
      );
      setMessages((prev) => [...prev, { role: "ai", content: advice }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I couldn't process your request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-purple-600 text-white p-4 font-semibold">
        Financial Assistant
      </div>
      <div className="h-60 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-2 text-sm ${
                msg.role === "user"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            type="text"
            className="flex-1 text-sm border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200"
            placeholder="Ask for financial advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-purple-600 text-white hover:bg-purple-700 transition-colors text-sm py-2 px-4 rounded"
          >
            {isLoading ? "..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}
