"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Paperclip, X, Bot, User, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import getFinancialAdvice from "@/utils/getFinancialAdvice";

/**
 * ChatInterface - Dieter Rams Inspired
 * "Good design is innovative"
 *
 * Clean, functional AI assistant interface
 */

function MessageBubble({ message, isUser }) {
  return (
    <div className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Bot className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2.5 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        {message.file && (
          <div className="mb-2 flex items-center gap-2 text-xs opacity-70">
            <Paperclip className="h-3 w-3" />
            <span className="truncate">{message.fileName}</span>
          </div>
        )}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Bot className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-sm font-medium">Financial Assistant</h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-[200px]">
        Ask questions or upload a PDF for personalized financial advice
      </p>
    </div>
  );
}

export default function Chat({ totalBudget, totalIncome, totalSpend }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== "application/pdf") {
        setError("Please upload a PDF file");
        return;
      }
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const sendMessage = async () => {
    if ((!input.trim() && !file) || isLoading) return;

    setIsLoading(true);
    setError(null);

    const userMessage = {
      role: "user",
      content: input || "Analyze this document",
      file: file ? true : false,
      fileName: file?.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      let advice;

      if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const fileData = new Blob([e.target.result], { type: file.type });
            const formData = new FormData();
            formData.append("file", fileData, file.name);
            advice = await getFinancialAdvice(formData);
            setMessages((prev) => [...prev, { role: "ai", content: advice }]);
          } catch (err) {
            console.error("Error processing file:", err);
            setMessages((prev) => [
              ...prev,
              {
                role: "ai",
                content:
                  "I couldn't process this document. Please ensure it's a valid PDF and try again.",
              },
            ]);
          } finally {
            setIsLoading(false);
            clearFile();
          }
        };
        reader.onerror = () => {
          setError("Failed to read file");
          setIsLoading(false);
          clearFile();
        };
        reader.readAsArrayBuffer(file);
      } else {
        // Send context about current financial state
        advice = await getFinancialAdvice(null, {
          totalBudget,
          totalIncome,
          totalSpend,
          query: input,
        });
        setMessages((prev) => [...prev, { role: "ai", content: advice }]);
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "I apologize, but I couldn't process your request. Please try again.",
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="text-sm font-medium">Financial Assistant</h3>
          <p className="text-xs text-muted-foreground">
            Powered by AI
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto px-6 py-4 space-y-4 scrollbar-minimal">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((msg, index) => (
            <MessageBubble
              key={index}
              message={msg}
              isUser={msg.role === "user"}
            />
          ))
        )}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mb-2 rounded-md bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* File indicator */}
      {file && (
        <div className="mx-6 mb-2 flex items-center justify-between rounded-md bg-muted px-3 py-2">
          <div className="flex items-center gap-2 text-sm">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="truncate max-w-[200px]">{file.name}</span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={clearFile}
            className="h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            className="flex-1"
            placeholder="Ask for financial advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
          >
            <Paperclip className="h-4 w-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Button
            onClick={sendMessage}
            disabled={isLoading || (!input.trim() && !file)}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
