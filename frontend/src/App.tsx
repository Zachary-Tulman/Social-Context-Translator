import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import "./App.css";
import { ScrollArea } from "./components/ui/scroll-area";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react";

/* TODO:
    - finalize colors
    - bubble outlines
    - header font
    - borders nicer
    - make outer edges not as obvious
    - send assistant script as first message
    - input field grows vertically on line break
    - loading icon center + 1.5x size
    - fade-in animation when new message bubble appears
    - separate bubble appearance between human and AI (put human before fetch AI response)
    - subtle blip sound on new message appear
*/
interface Message {
  role: string;
  content: string;
}

function App() {
  const [chat_history, setChatHistory] = useState<Message[]>([]);
  const [chat_input, setChatInput] = useState("");
  const [is_loading, setIsLoading] = useState(false);
  const bottom_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom_ref.current?.scrollIntoView();
  }, [chat_history]);

  async function sendMessage() {
    const message = {
      role: "human",
      content: chat_input,
    };

    setIsLoading(true);

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

    setChatInput("");
    setIsLoading(false);
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col p-4 bg-stone-200">
      <div className="w-full max-w-2xl min-w-2xl mx-auto h-full flex flex-1 flex-col rounded-xl shadow-lg bg-violet-100">
        <div className="px-6 py-4 border-b font-semibold text-2xl text-center bg-violet-300">
          Social Context Translator
        </div>
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="flex flex-col gap-2 p-4">
            {chat_history.map((message, index) => (
              <div
                className={`${
                  message.role === "human"
                    ? "bg-blue-300 self-end rounded-2xl shadow-md px-4 py-2 max-w-[70%]"
                    : "bg-blue-200 self-start rounded-2xl shadow-md px-4 py-2 max-w-[70%]"
                }`}
                key={index}
              >
                {message.content}
              </div>
            ))}
            {is_loading && <Loader2 className="animate-spin" />}
            <div ref={bottom_ref} />
          </div>
        </ScrollArea>
        <div className="flex gap-2 p-4 border-t bg-violet-300">
          <Input
            className="shadow-md bg-violet-100"
            value={chat_input}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <Button onClick={sendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
