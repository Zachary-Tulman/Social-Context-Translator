import { useState } from "react";
import "./App.css";
import { ScrollArea } from "./components/ui/scroll-area";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

interface Message {
  role: string;
  content: string;
}

function App() {
  const [chat_history, setChatHistory] = useState<Message[]>([]);
  const [chat_input, setChatInput] = useState("");

  async function sendMessage() {
    const message = {
      role: "human",
      content: chat_input,
    };

    const response = await fetch("http://localhost:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: chat_input,
        conversation_history: chat_history,
      }),
    });
    const data = await response.json();

    setChatHistory([
      ...chat_history,
      message,
      {
        role: "ai",
        content: data.response,
      },
    ]);
  }

  return (
    <>
      <div>
        <ScrollArea className="chat-history">
          {chat_history.map((message, index) => (
            <div key={index}>{message.content}</div>
          ))}
        </ScrollArea>
        <Input
          value={chat_input}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
    </>
  );
}

export default App;
