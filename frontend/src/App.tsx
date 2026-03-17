import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import "./App.css";
import { ScrollArea } from "./components/ui/scroll-area";
import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react";

/* TODO:
    - finalize colors
    x bubble outlines
    x make header faded edge so chat scrolls up nicely
    x borders nicer
    x make outer edges not as obvious
    x send assistant script as "first" message from assistant
    x input field grows vertically on line break
    x loading icon 1.5x size
    x fade-in animation when new message bubble appears
    x separate bubble appearance between human and AI (put human before fetch AI response)
    x subtle blip sound on new message appear
    - replace .gitkeep in data/ with .txt file or README explaining how to put data
    - make main readme presentable
*/
interface Message {
  role: string;
  content: string;
}

const greeting_message: Message = {
  role: "ai",
  content:
    "Hello. I am the Social Context Translator, an app created to help users " +
    "understand the social context behind all sorts of social situations in a " +
    "low-pressure environment. To get started, please explain a social " +
    "situation you would like to understand better, and I will do my best " +
    "to explain it to you!\n\nIf you have additional context and social " +
    "cues/actions you may have noticed others do during the interaction, " +
    "let me know and that will help me get a better grasp of the situation.",
};

function App() {
  const [chat_history, setChatHistory] = useState<Message[]>([
    greeting_message,
  ]);
  const [chat_input, setChatInput] = useState("");
  const [is_loading, setIsLoading] = useState(false);
  const [is_error, setIsError] = useState(false);
  const chat_window_bottom_ref = useRef<HTMLDivElement>(null);
  const text_area_ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chat_window_bottom_ref.current?.scrollIntoView();
  }, [chat_history]);

  useEffect(() => {
    if (text_area_ref.current) {
      text_area_ref.current.style.height = "0px";
      text_area_ref.current.style.height = `${Math.max(
        text_area_ref.current.scrollHeight + 1,
        37
      )}px`;
    }
  }, [chat_input]);

  async function sendMessage() {
    const signal = AbortSignal.timeout(15000);
    const blip_sound = new Audio("/little-pop.wav");
    const message = {
      role: "human",
      content: chat_input,
    };

    setChatInput("");
    setChatHistory((prev) => [...prev, message]);
    blip_sound.play();

    setIsError(false);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/chat", {
        signal: signal,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: chat_input,
          conversation_history: chat_history,
        }),
      });
      const data = await response.json();

      setChatHistory((prev) => [
        ...prev,
        {
          role: "ai",
          content: data.response,
        },
      ]);
    } catch (err) {
      setIsError(true);
      console.error(`WARNING: Error detected: ${err}`);
    }
    blip_sound.play();
    setIsLoading(false);
  }

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-stone-200">
      <header
        className="flex w-full sticky top-0 z-10 h-12 -mb-3"
        style={{ height: "48px" }}
      >
        <div className="from-stone-200 via-stone-200 via-65% to-stone-200/0 pointer-events-none absolute inset-0 -bottom-5 z-[-1] bg-gradient-to-b blur-sm"></div>
        <div className="px-6 py-4 w-full mx-auto font-semibold text-2xl text-center"></div>
      </header>
      <div className="min-w-sm max-w-3xl w-3xl h-full mx-auto justify-center flex flex-1 flex-col rounded-xl">
        <ScrollArea className="flex-1 overflow-hidden">
          <div className="flex flex-col gap-2 pt-6 p-4">
            {chat_history.map((message, index) => (
              <div
                className={`${
                  message.role === "human"
                    ? "bg-blue-300 animate-fade-in-bubble self-end rounded-2xl shadow-md px-4 py-2 max-w-[70%]"
                    : "bg-blue-200 animate-fade-in-bubble whitespace-pre-wrap self-start rounded-2xl shadow-md px-4 py-2 max-w-[70%]"
                }`}
                key={index}
              >
                {message.content}
              </div>
            ))}
            {is_loading && <Loader2 className="animate-spin" size={36} />}
            {is_error && `An error occurred. Please try again later.`}
            <div ref={chat_window_bottom_ref} />
          </div>
        </ScrollArea>
        <div className="w-full items-end flex mx-auto gap-2 mb-4 p-4 border-t rounded-xl bg-[#CFBAF0] shadow-sm">
          <Textarea
            style={{
              minHeight: "0px",
              maxHeight: "25rem",
              height: "37px",
              boxSizing: "border-box",
            }}
            ref={text_area_ref}
            className="shadow-md pv-5 resize-none"
            value={chat_input}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey === false && !is_loading) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button className="" onClick={sendMessage}></Button>
        </div>
      </div>
    </div>
  );
}

export default App;
