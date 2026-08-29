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
  Mic,
  Send,
  Trash2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FlaskConical,
  Bug,
  Lightbulb,
  Headphones,
  Stethoscope,
  BarChart3,
  Calculator,
  CheckCheck,
  Sprout,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";

// Crop image assets
import cropWheat from "@/assets/crop-wheat.jpg";
import cropRice from "@/assets/crop-rice.jpg";
import cropChickpea from "@/assets/crop-chickpea.jpg";
import cropMaize from "@/assets/crop-maize.jpg";
import cropCotton from "@/assets/crop-cotton.jpg";
import cropSugarcane from "@/assets/crop-sugarcane.jpg";
import cropBlackgram from "@/assets/crop-blackgram.jpg";
import cropCoconut from "@/assets/crop-coconut.jpg";
import cropCoffee from "@/assets/crop-coffee.jpg";
import cropJute from "@/assets/crop-jute.jpg";
import cropKidneybeans from "@/assets/crop-kidneybeans.png";
import cropLentil from "@/assets/crop-lentil.jpg";
import cropMango from "@/assets/crop-mango.jpg";
import cropMothbeans from "@/assets/crop-mothbeans.png";
import cropMungbean from "@/assets/crop-mungbean.jpg";
import cropMuskmelon from "@/assets/crop-muskmelon.png";
import cropPigeonpeas from "@/assets/crop-pigeonpeas.png";
import cropPomegranate from "@/assets/crop-pomegranate.jpg";
import heroFarmer from "@/assets/hero-farmer.jpg";

type ActiveTab = "chat" | "voice";

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
}

const CROP_IMAGE_MAP: Record<string, string> = {
  wheat: cropWheat.src,
  rice: cropRice.src,
  paddy: cropRice.src,
  maize: cropMaize.src,
  corn: cropMaize.src,
  cotton: cropCotton.src,
  sugarcane: cropSugarcane.src,
  blackgram: cropBlackgram.src,
  chickpea: cropChickpea.src,
  gram: cropChickpea.src,
  chana: cropChickpea.src,
  coconut: cropCoconut.src,
  coffee: cropCoffee.src,
  jute: cropJute.src,
  kidneybeans: cropKidneybeans.src,
  lentil: cropLentil.src,
  mango: cropMango.src,
  mothbeans: cropMothbeans.src,
  mungbean: cropMungbean.src,
  muskmelon: cropMuskmelon.src,
  pigeonpeas: cropPigeonpeas.src,
  pomegranate: cropPomegranate.src,
  mustard: heroFarmer.src,
  tomato: heroFarmer.src,
  potato: heroFarmer.src,
  papaya: cropMango.src,
  banana: cropMango.src,
  apple: cropPomegranate.src,
  orange: cropPomegranate.src,
  grapes: cropPomegranate.src,
  watermelon: cropMuskmelon.src,
};

function getCropImage(cropName: string): string {
  const key = cropName.toLowerCase().trim();
  return CROP_IMAGE_MAP[key] || cropWheat.src;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg-welcome",
    sender: "assistant",
    text: "Namaste! 🙏 I am your AgriSmart AI Assistant. How can I assist you with your crops, weather forecasts, fertilizer dosage, or pest management today?",
    timestamp: "Just now",
  },
];

const SUGGESTIONS = [
  "How to improve soil health?",
  "Irrigation tips for summer",
  "Best fertilizers for wheat",
  "Pest control in tomatoes",
];

const DEFAULT_POPULAR_QUESTIONS = [
  {
    id: 1,
    icon: Sprout,
    iconBg: "bg-emerald-100 text-emerald-600",
    text: "Which crop is best for the current season?",
  },
  {
    id: 2,
    icon: TrendingUp,
    iconBg: "bg-cyan-100 text-cyan-600",
    text: "How to increase crop yield naturally?",
  },
  {
    id: 3,
    icon: FlaskConical,
    iconBg: "bg-blue-100 text-blue-600",
    text: "What are the symptoms of nitrogen deficiency?",
  },
  {
    id: 4,
    icon: Bug,
    iconBg: "bg-amber-100 text-amber-600",
    text: "How to control aphids in vegetables?",
  },
];

export default function AIAssistantPage() {
  const { location, coords } = useLocation();
  const { lang } = useLanguage();

  const [activeTab, setActiveTab] = useState<ActiveTab>("chat");
  const [sessionId, setSessionId] = useState<string>(() => `session-${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [popularQuestions, setPopularQuestions] = useState(DEFAULT_POPULAR_QUESTIONS);
  const [insight, setInsight] = useState<{
    title: string;
    description: string;
    link: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll on new messages or typing state change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Fetch dynamic Popular Questions & AI Insights on mount and location change
  useEffect(() => {
    async function loadInsightsAndQuestions() {
      try {
        // 1. Popular Questions
        const qRes = await fetch("/api/v1/assistant/popular-questions");
        if (qRes.ok) {
          const qJson = await qRes.json();
          if (qJson?.data && Array.isArray(qJson.data) && qJson.data.length > 0) {
            const icons = [Sprout, TrendingUp, FlaskConical, Bug];
            const iconBgs = [
              "bg-emerald-100 text-emerald-600",
              "bg-cyan-100 text-cyan-600",
              "bg-blue-100 text-blue-600",
              "bg-amber-100 text-amber-600",
            ];
            const mapped = qJson.data.map((item: any, idx: number) => ({
              id: item.id || idx + 1,
              icon: icons[idx % icons.length],
              iconBg: iconBgs[idx % iconBgs.length],
              text: item.text,
            }));
            setPopularQuestions(mapped);
          }
        }

        // 2. Dynamic Insights
        const lat = coords?.latitude ? `&lat=${coords.latitude}` : "";
        const lon = coords?.longitude ? `&lon=${coords.longitude}` : "";
        const insRes = await fetch(
          `/api/v1/assistant/insights?location=${encodeURIComponent(location)}${lat}${lon}`,
        );
        if (insRes.ok) {
          const insJson = await insRes.json();
          if (insJson?.data) {
            setInsight(insJson.data);
          }
        }
      } catch (e) {
        console.error("Failed loading assistant metadata:", e);
      }
    }

    loadInsightsAndQuestions();
  }, [location, coords]);

  // Main real message send handler
  async function handleSend(textToSend?: string) {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: userTime,
    };

    // Append user message immediately
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInputVal("");
    setIsTyping(true);

    try {
      const payload = {
        session_id: sessionId,
        message: text,
        language: lang || "en",
        location: location || "Bhopal, Madhya Pradesh",
        latitude: coords?.latitude || 23.2599,
        longitude: coords?.longitude || 77.4126,
        history: updatedHistory.map((m) => ({
          sender: m.sender,
          text: m.text,
        })),
        soil: {
          nitrogen: 80,
          phosphorus: 40,
          potassium: 50,
          soilPh: 6.8,
          soilType: "Loamy Soil",
        },
      };

      const res = await fetch("/api/v1/assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned error ${res.status}`);
      }

      const json = await res.json();
      const assistantData = json?.data;

      const aiTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const replyText =
        assistantData?.reply ||
        "I have processed your request. Please let me know if you need further agronomic assistance.";

      const hasCrops = Boolean(assistantData?.has_crops && assistantData?.crops?.length);
      const crops = assistantData?.crops || [];

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "assistant",
          text: replyText,
          timestamp: assistantData?.timestamp || aiTime,
          hasCrops,
          crops,
        },
      ]);
    } catch (err: any) {
      console.error("[Assistant Send Error]", err);
      toast.error("Unable to connect to AI Assistant. Please check your connection.");
      const errorTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: "assistant",
          text: "I experienced a temporary connection issue reaching the agronomic reasoning engine. Please try asking again in a moment.",
          timestamp: errorTime,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleClearChat() {
    setMessages(INITIAL_MESSAGES);
    const newSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setSessionId(newSessionId);
    toast.success("Chat history reset");
  }

  async function handlePopularQuestionClick(q: { id: number; text: string }) {
    // Increment usage counter in background
    try {
      fetch("/api/v1/assistant/popular-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: q.id }),
      }).catch(() => {});
    } catch {}

    handleSend(q.text);
  }

  function handleSuggestionClick(q: string) {
    handleSend(q);
  }

  // Web Speech API Voice Assistant
  function toggleVoiceAssistant() {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (
      typeof window === "undefined" ||
      (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window))
    ) {
      toast.info("Voice recognition simulation activated");
      setIsListening(true);
      setVoiceTranscript("Listening to your voice query... Speak in Hindi or English");

      setTimeout(() => {
        setIsListening(false);
        const sampleQuery =
          lang === "hi"
            ? "गेहूं की बुवाई के लिए सबसे अच्छा समय क्या है?"
            : "What is the best sowing time for wheat?";
        setVoiceTranscript(`Recognized: '${sampleQuery}'`);
        setActiveTab("chat");
        handleSend(sampleQuery);
      }, 3000);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = lang === "hi" ? "hi-IN" : "en-IN";

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceTranscript("Listening... Speak clearly into your microphone.");
        toast.info("Microphone activated (Voice Assistant)");
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((res: any) => res[0].transcript)
          .join("");
        setVoiceTranscript(transcript);

        if (event.results[0].isFinal) {
          setIsListening(false);
          setActiveTab("chat");
          handleSend(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        toast.error("Voice recognition failed. Please try typing your question.");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  }

  return (
    <DashboardShell
      headerTitle="AI Assistant"
      headerSubtitle="Your smart farming companion – available 24/7 to assist you."
    >
      <div className="space-y-5 pb-6">
        {/* ======================================================== */}
        {/* 1. TOP TABS                                              */}
        {/* ======================================================== */}
        <div className="flex items-center gap-6 border-b border-border/80 pb-px text-sm font-medium">
          {/* Tab 1: AI Farming Chatbot */}
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "chat"
                ? "text-[#168447]"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bot className="h-4.5 w-4.5" />
            <span>AI Farming Chatbot</span>
            {activeTab === "chat" && (
              <motion.div
                layoutId="aiTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168447]"
              />
            )}
          </button>

          {/* Tab 2: Voice Assistant */}
          <button
            type="button"
            onClick={() => setActiveTab("voice")}
            className={`relative flex items-center gap-2 pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "voice"
                ? "text-[#168447] font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>Voice Assistant</span>
            {activeTab === "voice" && (
              <motion.div
                layoutId="aiTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#168447]"
              />
            )}
          </button>
        </div>

        {/* VOICE ASSISTANT VIEW (When Voice Tab Active) */}
        {activeTab === "voice" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card p-12 text-center shadow-xs"
          >
            <div className="relative flex items-center justify-center mb-6">
              {isListening && (
                <span className="absolute h-32 w-32 rounded-full bg-[#168447]/20 animate-ping" />
              )}
              <button
                type="button"
                onClick={toggleVoiceAssistant}
                className={`relative flex h-24 w-24 items-center justify-center rounded-full shadow-lg transition-all cursor-pointer ${
                  isListening
                    ? "bg-rose-500 text-white hover:bg-rose-600 scale-105"
                    : "bg-[#168447] text-white hover:bg-[#14743e] hover:scale-105"
                }`}
              >
                <Mic className="h-10 w-10" />
              </button>
            </div>

            <h2 className="font-display text-xl font-bold text-foreground">
              {isListening ? "Listening..." : "Tap to Speak"}
            </h2>
            <p className="mt-1 max-w-md text-xs text-muted-foreground">
              {voiceTranscript ||
                "Ask questions in Hindi, English or regional languages about crop cultivation, weather alerts, or market prices."}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Try saying:
              </span>
              {[
                "गेहूं की बुवाई कब करें?",
                `Today's Mandi price for Wheat in ${location.split(",")[0]}`,
                "PM-KISAN eligibility status",
              ].map((phrase) => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => {
                    setActiveTab("chat");
                    handleSend(phrase);
                  }}
                  className="rounded-full border border-border/80 bg-background px-3 py-1 text-xs text-foreground hover:border-[#168447] transition-colors cursor-pointer"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ======================================================== */
          /* 2. TWO-COLUMN MAIN CONTENT                               */
          /* ======================================================== */
          <div className="grid gap-5 lg:grid-cols-12">
            {/* -------------------------------------------------------- */}
            {/* LEFT COLUMN: AI FARMING CHATBOT CARD (8 Cols)            */}
            {/* -------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs lg:col-span-8 min-h-[580px]"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d] shadow-2xs">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                        AI Farming Chatbot
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Ask anything about farming, crops, soil, weather,
                        schemes and more for {location}.
                      </p>
                    </div>
                  </div>

                  {/* Clear Chat Button */}
                  <button
                    type="button"
                    onClick={handleClearChat}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-xs font-semibold text-foreground hover:bg-accent transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Clear Chat</span>
                  </button>
                </div>

                {/* Conversation History Area */}
                <div className="mt-4 space-y-4 max-h-[520px] overflow-y-auto pr-1">
                  {messages.map((msg) => (
                    <div key={msg.id}>
                      {msg.sender === "user" ? (
                        /* User Message Bubble */
                        <div className="flex justify-end">
                          <div className="max-w-md rounded-2xl rounded-tr-xs bg-[#dcfce7] px-4 py-3 text-xs text-[#15803d] shadow-2xs dark:bg-emerald-950/40 dark:text-emerald-300">
                            <p className="font-medium text-foreground whitespace-pre-wrap">
                              {msg.text}
                            </p>
                            <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
                              <span>{msg.timestamp}</span>
                              <CheckCheck className="h-3.5 w-3.5 text-[#168447]" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* AI Assistant Message */
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d] mt-1 shadow-2xs">
                            <Bot className="h-4 w-4" />
                          </div>

                          <div className="flex-1 space-y-3">
                            <div className="rounded-2xl rounded-tl-xs bg-muted/30 border border-border/60 p-3.5 text-xs leading-relaxed text-foreground">
                              <p className="whitespace-pre-wrap">{msg.text}</p>

                              {/* Crop Recommendation Cards if ML model predicted crops */}
                              {msg.hasCrops && msg.crops && msg.crops.length > 0 && (
                                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                  {msg.crops.slice(0, 3).map((item, idx) => {
                                    const imgSrc = getCropImage(item.crop);
                                    const badgeText =
                                      idx === 0
                                        ? "Highly Suitable"
                                        : idx === 1
                                          ? "Suitable"
                                          : "Moderately Suitable";
                                    const badgeBg =
                                      idx === 0
                                        ? "bg-[#dcfce7] text-[#15803d]"
                                        : idx === 1
                                          ? "bg-[#dbeafe] text-[#1d4ed8]"
                                          : "bg-[#fef3c7] text-[#d97706]";

                                    return (
                                      <div
                                        key={`${item.crop}-${idx}`}
                                        className="overflow-hidden rounded-xl border border-border/80 bg-card p-2.5 shadow-2xs"
                                      >
                                        <div className="h-20 w-full overflow-hidden rounded-lg bg-muted">
                                          <img
                                            src={imgSrc}
                                            alt={item.crop}
                                            className="h-full w-full object-cover"
                                          />
                                        </div>
                                        <div className="mt-2">
                                          <div className="flex items-center justify-between">
                                            <h4 className="font-bold text-foreground text-xs">
                                              {item.crop}
                                            </h4>
                                            <span
                                              className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${badgeBg}`}
                                            >
                                              {item.probability}%
                                            </span>
                                          </div>
                                          <span className="block text-[10px] font-semibold text-muted-foreground mt-0.5">
                                            {badgeText}
                                          </span>
                                          <Link
                                            href="/crop-intelligence"
                                            className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#168447] hover:underline"
                                          >
                                            <span>View Details</span>
                                            <ArrowRight className="h-2.5 w-2.5" />
                                          </Link>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}

                              {msg.hasCrops && (
                                <p className="mt-3 font-medium text-foreground">
                                  Would you like specific guidance on any of these crops?
                                </p>
                              )}
                            </div>

                            <span className="block text-right text-[10px] text-muted-foreground">
                              {msg.timestamp}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#dcfce7] text-[#15803d]">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-muted px-3 py-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#168447] animate-bounce" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#168447] animate-bounce [animation-delay:0.2s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-[#168447] animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Bottom Input Area + Suggested Questions */}
              <div className="mt-4 pt-3 border-t border-border/60">
                {/* Suggested Questions Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => handleSuggestionClick(sug)}
                      className="rounded-full border border-border/80 bg-background px-3 py-1 text-[11px] font-medium text-foreground hover:border-[#168447] hover:text-[#168447] transition-colors cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>

                {/* Input with Send Button */}
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder={`Ask about crops, fertilizers, weather in ${location}...`}
                    className="w-full rounded-xl border border-border/80 bg-background py-3 pl-4 pr-12 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-[#168447] focus:ring-1 focus:ring-[#168447]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSend()}
                    disabled={!inputVal.trim() || isTyping}
                    aria-label="Send message"
                    className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#168447] text-white shadow-xs transition-all hover:bg-[#14743e] disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="mt-2 text-[10px] text-muted-foreground text-center">
                  ⓘ AI responses are tailored to your region and soil profile. Always verify critical decisions.
                </p>
              </div>
            </motion.div>

            {/* -------------------------------------------------------- */}
            {/* RIGHT COLUMN: 3 STACKED CARDS (4 Cols)                   */}
            {/* -------------------------------------------------------- */}
            <div className="space-y-4 lg:col-span-4">
              {/* 1. Popular Questions (Purple Card) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                className="rounded-2xl border border-purple-200/70 bg-[#faf5ff] p-4 shadow-xs dark:bg-purple-950/20 dark:border-purple-900/40"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-purple-200/50">
                  <h3 className="font-display text-sm font-bold text-foreground">
                    Popular Questions
                  </h3>
                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Displaying most frequent farmer questions")
                    }
                    className="text-xs font-semibold text-purple-700 hover:underline cursor-pointer dark:text-purple-300"
                  >
                    View All
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {popularQuestions.map((q) => {
                    const IconComp = q.icon;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => handlePopularQuestionClick(q)}
                        className="flex w-full items-center justify-between gap-2.5 rounded-xl border border-purple-100 bg-white p-2.5 text-left text-xs transition-all hover:border-purple-300 hover:shadow-2xs dark:bg-card dark:border-border/60 cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${q.iconBg}`}
                          >
                            <IconComp className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-medium text-foreground text-[11px] leading-snug">
                            {q.text}
                          </span>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* 2. AI Insights for You (Yellow / Cream Card) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="rounded-2xl border border-amber-200/70 bg-[#fffbeb] p-4 shadow-xs dark:bg-amber-950/20 dark:border-amber-900/40"
              >
                <div className="flex items-start gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-200 text-amber-800">
                    <Lightbulb className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-foreground">
                      AI Insights for You
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Based on {location}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-amber-200 bg-white/80 p-3 text-xs dark:bg-card">
                  <div className="flex items-start gap-2">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#168447] mt-0.5">
                      <Sprout className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-[11px]">
                        {insight?.title ||
                          "Rainfall is expected to increase in the next 3 days."}
                      </h4>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">
                        {insight?.description ||
                          "Consider completing sowing and soil preparation activities before that."}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={insight?.link || "/weather-climate"}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#168447] hover:underline"
                  >
                    <span>View Details</span>
                    <ArrowRight className="h-2.5 w-2.5" />
                  </Link>
                </div>
              </motion.div>

              {/* 3. Need Human Support? (Blue Card) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="flex items-center justify-between rounded-2xl border border-blue-200/70 bg-[#eff6ff] p-4 shadow-xs dark:bg-blue-950/20 dark:border-blue-900/40"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Headphones className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xs font-bold text-foreground">
                      Need Human Support?
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Connect with our agriculture experts.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    toast.success(
                      "Connected to Agronomist Hotline: 1800-180-1551",
                    )
                  }
                  className="rounded-xl border border-border/80 bg-white px-3 py-1.5 text-xs font-bold text-foreground shadow-2xs hover:bg-accent transition-colors shrink-0 dark:bg-card cursor-pointer"
                >
                  <span>Talk to Expert →</span>
                </button>
              </motion.div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. SMART AI FEATURES SECTION (Bottom 4 Cards)            */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="rounded-2xl border border-[#d1ebd7] bg-gradient-to-r from-[#eef7ef] via-[#f4faf4] to-[#e8f5ec] p-5 shadow-xs"
        >
          <div className="mb-4">
            <h2 className="font-display text-base font-bold tracking-tight text-foreground">
              Smart AI Features
            </h2>
            <p className="text-xs text-muted-foreground">
              Explore more AI-powered tools to make better farming decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Crop Doctor */}
            <div className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 shadow-2xs hover:shadow-sm transition-all">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#168447] mb-3">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-foreground">
                  Crop Doctor
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Identify crop diseases and get treatment suggestions.
                </p>
              </div>
              <Link
                href="/soil-crop-health"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#168447] hover:underline"
              >
                <span>Diagnose Now</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* 2. Yield Predictor */}
            <div className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 shadow-2xs hover:shadow-sm transition-all">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#168447] mb-3">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-foreground">
                  Yield Predictor
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Predict expected yield using AI models.
                </p>
              </div>
              <Link
                href="/crop-intelligence"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#168447] hover:underline"
              >
                <span>Check Yield</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* 3. Fertilizer Advisor */}
            <div className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 shadow-2xs hover:shadow-sm transition-all">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#168447] mb-3">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-foreground">
                  Fertilizer Advisor
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Get personalized fertilizer recommendations.
                </p>
              </div>
              <Link
                href="/soil-crop-health"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#168447] hover:underline"
              >
                <span>Get Recommendation</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* 4. Cost & Profit Estimator */}
            <div className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 shadow-2xs hover:shadow-sm transition-all">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-[#168447] mb-3">
                  <Calculator className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-foreground">
                  Cost & Profit Estimator
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  Estimate cost, profit and ROI for your crops.
                </p>
              </div>
              <Link
                href="/market-finance"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#168447] hover:underline"
              >
                <span>Calculate Now</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
