"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";

type Message = { role: "bot" | "user"; text: string };

export function Assistant() {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: t.assistant.greeting },
  ]);
  const replyIndex = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset conversation when the language changes so the greeting is translated.
  useEffect(() => {
    setMessages([{ role: "bot", text: t.assistant.greeting }]);
    replyIndex.current = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, typing]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    const reply =
      t.assistant.replies[replyIndex.current % t.assistant.replies.length] ??
      t.assistant.replies[0]!;
    replyIndex.current += 1;
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    }, 1100);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm animate-scale-in flex-col overflow-hidden rounded-2xl border bg-card shadow-2xl sm:right-6">
          <div className="flex items-center gap-3 bg-primary px-4 py-3.5 text-primary-foreground">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
              <Bot className="h-5 w-5" />
            </span>
            <div className="flex-1 leading-tight">
              <p className="font-display text-sm font-bold">
                {t.assistant.title}
              </p>
              <p className="flex items-center gap-1.5 text-[11px] opacity-80">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf" />
                {t.assistant.online}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="rounded-full p-1 transition-colors hover:bg-primary-foreground/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="h-72 space-y-2.5 overflow-y-auto p-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] animate-fade-in rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "bot"
                    ? "rounded-bl-sm bg-muted text-foreground"
                    : "ml-auto rounded-br-sm bg-primary text-primary-foreground",
                )}
              >
                {msg.text}
              </div>
            ))}
            {typing && (
              <div
                className="flex max-w-[85%] items-center gap-1.5 rounded-2xl rounded-bl-sm bg-muted px-4 py-3"
                aria-label={t.assistant.typing}
              >
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    style={{ animationDelay: `${dot * 0.15}s` }}
                    className="h-1.5 w-1.5 animate-typing rounded-full bg-muted-foreground"
                  />
                ))}
              </div>
            )}
          </div>

          <form
            className="flex items-center gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.assistant.placeholder}
              className="h-10 flex-1 rounded-full border bg-background px-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open AgriSmart AI assistant"
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/30 transition-transform hover:scale-105 sm:right-6"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
    </>
  );
}
