"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard/shell";
import { useLocation } from "@/lib/location";
import { useLanguage } from "@/lib/i18n";
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FlaskConical,
  Bug,
  Sprout,
  ChevronRight,
  ExternalLink,
  Mic,
  Paperclip,
  CloudSun,
  MapPin,
  FileText,
  CheckCheck,
  Lightbulb
} from "lucide-react";
import { useAccount } from "@/components/landing/user-controls";

interface CropCardItem {
  crop: string;
  probability: number;
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  hasCrops?: boolean;
  crops?: CropCardItem[];
  sources?: Array<{ title: string; url?: string }>;
}

const DEFAULT_POPULAR_QUESTIONS = [
  { id: 1, icon: Sprout, iconBg: "bg-emerald-100 text-emerald-600", text: "Which crop is best for the current season?" },
  { id: 2, icon: TrendingUp, iconBg: "bg-cyan-100 text-cyan-600", text: "How to increase crop yield naturally?" },
  { id: 3, icon: FlaskConical, iconBg: "bg-blue-100 text-blue-600", text: "What are the symptoms of nitrogen deficiency?" },
  { id: 4, icon: Bug, iconBg: "bg-amber-100 text-amber-600", text: "How to control aphids in vegetables?" },
];

const SUGGESTIONS = [
  "How to improve soil health?",
  "Irrigation tips for summer",
  "Best fertilizers for wheat",
  "Pest control in tomatoes",
];

export default function AIAssistantPage() {
  const { location } = useLocation();
  const { lang, t } = useLanguage();
  const { displayName } = useAccount();

  const farmerLoc = location || "Vasai, Maharashtra";

  const INITIAL_MESSAGES: Message[] = [
    {
      id: "msg-welcome",
      sender: "assistant",
      text: "Namaste! 🙏 I am your AgriSmart AI Assistant. How can I assist you with your crops, weather forecasts, fertilizer dosage, or pest management today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const [sessionId, setSessionId] = useState<string>(() => `session-${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [insight, setInsight] = useState<{ title: string; description: string; link: string; } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages or typing state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Load state from sessionStorage on mount
  useEffect(() => {
    try {
      const storedSession = sessionStorage.getItem("agrismart_chat_session");
      const storedMessages = sessionStorage.getItem("agrismart_chat_messages");
      
      if (storedSession) setSessionId(storedSession);
      if (storedMessages) {
        const parsed = JSON.parse(storedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load chat from storage", e);
    }
  }, []);

  // Save state to sessionStorage when it changes
  useEffect(() => {
    try {
      sessionStorage.setItem("agrismart_chat_session", sessionId);
      sessionStorage.setItem("agrismart_chat_messages", JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat to storage", e);
    }
  }, [sessionId, messages]);

  async function handleSend() {
    if (!inputVal.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputVal.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/v1/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMsg.text,
          language: lang,
          location: farmerLoc,
        }),
      });

      if (!res.ok) throw new Error("API failed");

      const result = await res.json();
      const data = result.data || {};
      
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: data.reply || result.error || "I am currently unable to answer that.",
        timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        hasCrops: data.has_crops,
        crops: data.crops,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, aiMsg]);
      
      // Setup dynamic insight if returned
      if (data.intent === "WEATHER") {
        setInsight({
          title: "Weather Advisory",
          description: "Recent weather query suggests you might need to adjust irrigation schedules.",
          link: "/weather-climate"
        });
      } else if (data.intent === "FERTILIZER") {
        setInsight({
          title: "Fertilizer Schedule",
          description: "You recently asked about fertilizer. Make sure to log it in your farm plan.",
          link: "/farm-planning"
        });
      } else if (data.intent === "CROP_RECOMMENDATION") {
         setInsight({
          title: "Crop Recommendation",
          description: "Based on your request, explore detailed crop analytics in the Crop Recommendation tool.",
          link: "/crop-recommendation"
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errMsg: Message = {
        id: (Date.now() + 2).toString(),
        sender: "assistant",
        text: "I'm having trouble connecting right now. Please check your network and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleClearChat() {
    setMessages([{
      id: `new-${Date.now()}`,
      sender: "assistant",
      text: "Chat cleared. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setSessionId(`session-${Date.now()}`);
    setInsight(null);
    toast.success("Chat history cleared");
  }

  return (
    <DashboardShell
      headerTitle="AI Assistant"
      headerSubtitle="Your smart farming companion – available 24/7 to assist you."
    >
      <div className="h-full">
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ======================================================== */}
          {/* LEFT: AI CHATBOT (8 cols)                                */}
          {/* ======================================================== */}
          <div className="flex flex-col lg:col-span-8 rounded-2xl border border-border/80 bg-card p-5 shadow-sm h-[calc(100vh-150px)]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf7ee] text-[#168447]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground text-base leading-tight">AI Farming Chatbot</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Ask anything about farming, crops, soil, weather, schemes and more for {farmerLoc}.
                  </p>
                </div>
              </div>
              <button 
                onClick={handleClearChat}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-rose-500 transition-colors px-3 py-1.5 rounded-lg border border-border/80 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear Chat
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto pt-5 pb-2 space-y-6 scrollbar-hide pr-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex max-w-[85%] flex-col gap-1.5 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                    
                    {/* Message Bubble */}
                    <div className={`flex gap-3 relative ${msg.sender === "assistant" ? "items-start" : "items-end flex-row-reverse"}`}>
                      {msg.sender === "assistant" && (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#168447] text-white shadow-sm mt-1">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      
                      <div className={`relative px-4 py-3 text-sm shadow-sm ${msg.sender === "user" ? "rounded-2xl rounded-br-sm bg-[#eaf7ee] text-[#0f3423] border border-emerald-100" : "rounded-2xl rounded-tl-sm bg-white border border-border/60 text-foreground"}`}>
                        <div className="prose prose-sm prose-emerald dark:prose-invert max-w-none leading-relaxed">
                          {msg.text.split('\n').map((line, i) => (
                            <p key={i} className="my-0.5">{line}</p>
                          ))}
                        </div>

                        {/* RAG Context / Location Note */}
                        {msg.sender === "assistant" && msg.id !== "msg-welcome" && (
                          <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50/50 p-2.5 border border-emerald-100/50 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                            <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Based on your location: {farmerLoc}</span>
                              <span className="text-[10px] text-emerald-600/80 dark:text-emerald-500/80">These recommendations are tailored to your region's climate.</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Sources */}
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/60">
                            <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-muted-foreground">
                              <FileText className="h-3.5 w-3.5" />
                              Sources
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {msg.sources.map((src, idx) => (
                                <Link 
                                  key={idx} 
                                  href={src.url || "#"} 
                                  className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-slate-50 px-2.5 py-1 text-[10px] font-medium text-foreground transition-colors hover:bg-accent dark:bg-muted/50 cursor-pointer"
                                >
                                  {src.title}
                                  <ExternalLink className="h-2.5 w-2.5 text-muted-foreground ml-0.5" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Timestamp */}
                    <div className="px-1 text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                      {msg.timestamp}
                      {msg.sender === "user" && <CheckCheck className="h-3 w-3 text-emerald-500" />}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex w-full justify-start">
                  <div className="flex max-w-[85%] items-end gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#168447] text-white shadow-sm">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-white border border-border/60 px-4 py-3.5 shadow-sm">
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.3s]" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500 [animation-delay:-0.15s]" />
                      <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions & Input Area */}
            <div className="pt-3 border-t border-border/60 mt-auto">
              {/* Quick Suggestion Pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputVal(s);
                      // Let state update, then send
                      setTimeout(() => {
                         const userMsg: Message = {
                           id: Date.now().toString(),
                           sender: "user",
                           text: s,
                           timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                         };
                         setMessages((prev) => [...prev, userMsg]);
                         setInputVal("");
                         setIsTyping(true);
                         
                         fetch("/api/v1/assistant/chat", {
                           method: "POST",
                           headers: { "Content-Type": "application/json" },
                           body: JSON.stringify({
                             session_id: sessionId,
                             message: s,
                             language: lang,
                             location: farmerLoc,
                           }),
                         })
                         .then(res => res.json())
                         .then(result => {
                           const data = result.data || {};
                           const aiMsg: Message = {
                             id: (Date.now() + 1).toString(),
                             sender: "assistant",
                             text: data.reply || result.error || "I am currently unable to answer that.",
                             timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                             hasCrops: data.has_crops,
                             crops: data.crops,
                             sources: data.sources,
                           };
                           setMessages(prev => [...prev, aiMsg]);
                           
                           if (data.intent === "WEATHER") {
                             setInsight({ title: "Weather Advisory", description: "Recent weather query suggests you might need to adjust irrigation schedules.", link: "/weather-climate" });
                           } else if (data.intent === "FERTILIZER") {
                             setInsight({ title: "Fertilizer Schedule", description: "You recently asked about fertilizer. Make sure to log it in your farm plan.", link: "/farm-planning" });
                           }
                         })
                         .catch(err => {
                           console.error(err);
                           setMessages(prev => [...prev, {
                             id: (Date.now() + 2).toString(),
                             sender: "assistant",
                             text: "I'm having trouble connecting right now. Please check your network and try again.",
                             timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                           }]);
                         })
                         .finally(() => setIsTyping(false));
                      }, 50);
                    }}
                    className="rounded-full border border-border/80 bg-white px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-card dark:hover:bg-emerald-950/30 cursor-pointer"
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Chat Input */}
              <div className="relative flex items-end gap-2 rounded-xl border border-border/80 bg-white p-2 shadow-sm focus-within:border-emerald-400 focus-within:ring-1 focus-within:ring-emerald-400 dark:bg-card">
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer">
                  <Paperclip className="h-4.5 w-4.5" />
                </button>
                
                <textarea
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={`Ask about crops, fertilizers, weather in ${farmerLoc}...`}
                  className="max-h-32 min-h-[36px] w-full resize-none bg-transparent py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden scrollbar-hide"
                  rows={1}
                />
                
                <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground cursor-pointer">
                  <Mic className="h-4.5 w-4.5" />
                </button>
                
                <button
                  onClick={handleSend}
                  disabled={!inputVal.trim() || isTyping}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#168447] text-white shadow-xs transition-colors hover:bg-[#14743e] disabled:opacity-50 cursor-pointer"
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </button>
              </div>
              <div className="mt-2 text-center text-[9px] text-muted-foreground flex items-center justify-center gap-1">
                <Sparkles className="h-2.5 w-2.5" /> AI responses are tailored to your region and soil profile. Always verify critical decisions with local experts.
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT SIDEBAR (4 cols)                                   */}
          {/* ======================================================== */}
          <div className="flex flex-col gap-4 lg:col-span-4 h-[calc(100vh-150px)] overflow-y-auto scrollbar-hide">
            
            {/* Popular Questions Card */}
            <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-sm dark:bg-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm flex items-center gap-1.5"><Lightbulb className="h-4 w-4 text-amber-500" /> Popular Questions</h3>
                <span className="text-[10px] font-semibold text-blue-600 cursor-pointer hover:underline">View All</span>
              </div>
              <div className="space-y-2">
                {DEFAULT_POPULAR_QUESTIONS.map((q) => {
                  const IconComp = q.icon;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setInputVal(q.text);
                        setTimeout(() => handleSend(), 50);
                      }}
                      className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-border/60 bg-slate-50/50 p-2.5 text-left text-xs transition-all hover:border-emerald-200 hover:shadow-2xs dark:bg-muted/20 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${q.iconBg}`}>
                          <IconComp className="h-3 w-3" />
                        </div>
                        <span className="font-medium text-foreground text-[11px] leading-snug">{q.text}</span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Today's Farming Insights */}
            <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-sm dark:bg-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm flex items-center gap-1.5"><TrendingUp className="h-4 w-4 text-emerald-600" /> Today's Farming Insights</h3>
                <span className="text-[10px] font-semibold text-blue-600 cursor-pointer hover:underline">View Details</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-slate-50/50 p-2 text-center dark:bg-muted/20">
                  <CloudSun className="h-5 w-5 text-amber-500 mb-1" />
                  <span className="text-[10px] font-bold text-foreground">Weather</span>
                  <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Partly cloudy<br/>Rain possible</span>
                  <span className="mt-1.5 rounded bg-blue-100 px-1.5 py-0.5 text-[8px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Plan irrigation</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-slate-50/50 p-2 text-center dark:bg-muted/20">
                  <Sprout className="h-5 w-5 text-emerald-700 mb-1" />
                  <span className="text-[10px] font-bold text-foreground">Soil Status</span>
                  <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Slightly acidic<br/>pH 6.2 (Good)</span>
                  <span className="mt-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">Suitable</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-border/80 bg-slate-50/50 p-2 text-center dark:bg-muted/20">
                  <Sparkles className="h-5 w-5 text-purple-600 mb-1" />
                  <span className="text-[10px] font-bold text-foreground">Crop Advisory</span>
                  <span className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Good time for<br/>sowing</span>
                  <span className="mt-1.5 rounded bg-purple-100 px-1.5 py-0.5 text-[8px] font-bold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Favorable</span>
                </div>
              </div>

              {/* AI Insight */}
              <div className="rounded-xl border border-emerald-200 bg-[#f0fdf4] p-2.5 flex items-start gap-2.5 dark:bg-emerald-950/20 dark:border-emerald-900/30">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 mt-0.5">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-emerald-900 dark:text-emerald-400">AI Insight</h4>
                  <p className="text-[10px] text-emerald-800/80 leading-snug mt-0.5 dark:text-emerald-500/80">
                    {insight?.description || "Expected rainfall this week may reduce irrigation need. Keep field drainage ready and monitor for waterlogging."}
                  </p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-emerald-500 shrink-0 ml-auto mt-1" />
              </div>
            </div>

            {/* Quick Tools */}
            <div className="rounded-2xl border border-border/80 bg-white p-4 shadow-sm dark:bg-card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm flex items-center gap-1.5"><Bot className="h-4 w-4 text-primary" /> Quick Tools</h3>
                <span className="text-[10px] font-semibold text-blue-600 cursor-pointer hover:underline">View All Tools</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/crop-recommendation" className="flex flex-col gap-1 rounded-xl border border-border/60 bg-slate-50/50 p-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5 dark:bg-muted/20 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-4 w-4 text-emerald-600" />
                    <span className="text-[10px] font-bold">Crop Recommendation</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Find the best crops for your soil and season.</p>
                </Link>
                <Link href="/soil-crop-health" className="flex flex-col gap-1 rounded-xl border border-border/60 bg-slate-50/50 p-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5 dark:bg-muted/20 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-blue-600" />
                    <span className="text-[10px] font-bold">Soil Analysis</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Analyze soil health and get recommendations.</p>
                </Link>
                <Link href="/soil-crop-health" className="flex flex-col gap-1 rounded-xl border border-border/60 bg-slate-50/50 p-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5 dark:bg-muted/20 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Bug className="h-4 w-4 text-rose-500" />
                    <span className="text-[10px] font-bold">Disease Detection</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Upload leaf image to detect diseases.</p>
                </Link>
                <Link href="/soil-crop-health" className="flex flex-col gap-1 rounded-xl border border-border/60 bg-slate-50/50 p-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5 dark:bg-muted/20 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="h-4 w-4 text-amber-500" />
                    <span className="text-[10px] font-bold">Fertilizer Advisor</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">Get correct fertilizer dosage for better yield.</p>
                </Link>
              </div>
            </div>

            {/* Knowledge Hub Help */}
            <div className="rounded-2xl border border-border/80 bg-slate-50 p-4 shadow-sm dark:bg-muted/10 mt-auto">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-border/80 shadow-xs dark:bg-card">
                  <FileText className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm">Need More Help?</h3>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">Explore our Knowledge Hub for detailed guides, videos and resources from trusted agricultural experts.</p>
                  <Link href="/government-resources" className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-white px-3 py-1.5 text-[11px] font-bold text-foreground shadow-xs transition-colors hover:bg-accent dark:bg-card cursor-pointer">
                    Browse Resources
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardShell>
  );
}
