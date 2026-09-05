"""
LLM Integration & Conversational Reasoning Service for AgriSmart AI.
Supports Gemini, OpenAI, Groq, InsForge AI Gateway, and built-in intelligent agronomic synthesis.
"""

import os
import json
import urllib.request
import urllib.parse
from typing import List, Dict, Any, Optional

SYSTEM_PROMPT = """You are "AgriSmart AI Assistant", an expert, friendly, and reliable agricultural advisor assisting Indian farmers.

CORE PRINCIPLES:
1. Provide practical, step-by-step, farmer-friendly advice.
2. Rely strictly on the provided Context, Tool Output, and Agricultural Knowledge Base.
3. NEVER invent or fabricate weather forecasts, market rates, disease diagnosis confidence, or ML prediction probabilities.
4. If a piece of data is unavailable, clearly acknowledge that and advise the farmer on standard best practices.
5. If visual disease diagnosis is required, explain possible causes and advise the farmer to upload a clear leaf photo.
6. When responding in Hindi or regional languages, use natural, clear terminology that farmers easily understand.
7. Keep responses concise, structured, and easy to read on mobile devices.
"""

class LLMService:
    _instance: Optional["LLMService"] = None

    def __init__(self):
        self.gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.groq_key = os.getenv("GROQ_API_KEY")
        self.openrouter_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("NEXT_PUBLIC_INSFORGE_KEY") or os.getenv("INSFORGE_AI_KEY")

    @classmethod
    def get_instance(cls) -> "LLMService":
        if cls._instance is None:
            cls._instance = LLMService()
        return cls._instance

    def generate_response(
        self,
        user_message: str,
        history: List[Dict[str, str]],
        farmer_context: Dict[str, Any],
        tool_data: Optional[Dict[str, Any]] = None,
        rag_chunks: Optional[List[Dict[str, Any]]] = None,
        language: str = "en",
    ) -> str:
        """
        Synthesizes a response using available LLM API or smart structured agronomic fallback.
        """
        # Try external LLM APIs if keys exist
        if self.openrouter_key and self.openrouter_key.startswith("sk-or-v1-"):
            res = self._call_openrouter(user_message, history, farmer_context, tool_data, rag_chunks, language)
            if res:
                return res

        if self.gemini_key:
            res = self._call_gemini(user_message, history, farmer_context, tool_data, rag_chunks, language)
            if res:
                return res

        if self.groq_key:
            res = self._call_groq(user_message, history, farmer_context, tool_data, rag_chunks, language)
            if res:
                return res

        if self.openai_key:
            res = self._call_openai(user_message, history, farmer_context, tool_data, rag_chunks, language)
            if res:
                return res

        # Built-in high-quality Agronomic Synthesis Engine
        return self._synthesize_agronomic_fallback(
            user_message, history, farmer_context, tool_data, rag_chunks, language
        )

    def _build_prompt(
        self,
        user_message: str,
        history: List[Dict[str, str]],
        farmer_context: Dict[str, Any],
        tool_data: Optional[Dict[str, Any]],
        rag_chunks: Optional[List[Dict[str, Any]]],
        language: str,
    ) -> str:
        parts = [SYSTEM_PROMPT]

        # Farmer context
        if farmer_context:
            parts.append(
                f"\n[FARMER PROFILE]\nLocation: {farmer_context.get('location', 'India')}\n"
                f"Soil Type: {farmer_context.get('soilType', 'Loamy Soil')}\n"
                f"Current Crop: {farmer_context.get('currentCrop', 'Not specified')}\n"
                f"Language: {language}\n"
            )

        # Tool output
        if tool_data:
            parts.append(f"\n[LIVE TOOL DATA / ML PREDICTIONS]\n{json.dumps(tool_data, indent=2)}\n")

        # RAG knowledge
        if rag_chunks:
            parts.append("\n[RETRIEVED AGRICULTURAL KNOWLEDGE BASE]")
            for chunk in rag_chunks:
                parts.append(f"--- {chunk.get('title', '')} ---\n{chunk.get('content', '')}")

        # Recent conversation history
        if history:
            parts.append("\n[RECENT CONVERSATION HISTORY]")
            for turn in history[-6:]:
                role = "Farmer" if turn.get("sender") == "user" else "Assistant"
                parts.append(f"{role}: {turn.get('text', '')}")

        parts.append(f"\nFarmer: {user_message}\nAssistant (in {language}):")
        return "\n".join(parts)

    def _call_gemini(
        self,
        user_message: str,
        history: List[Dict[str, str]],
        farmer_context: Dict[str, Any],
        tool_data: Optional[Dict[str, Any]],
        rag_chunks: Optional[List[Dict[str, Any]]],
        language: str,
    ) -> Optional[str]:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_key}"
            prompt_text = self._build_prompt(user_message, history, farmer_context, tool_data, rag_chunks, language)
            payload = {
                "contents": [{"parts": [{"text": prompt_text}]}],
                "generationConfig": {"temperature": 0.3, "maxOutputTokens": 800},
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()
        except Exception as e:
            print(f"[LLMService] Gemini API call failed: {e}")
        return None

    def _call_groq(
        self,
        user_message: str,
        history: List[Dict[str, str]],
        farmer_context: Dict[str, Any],
        tool_data: Optional[Dict[str, Any]],
        rag_chunks: Optional[List[Dict[str, Any]]],
        language: str,
    ) -> Optional[str]:
        try:
            url = "https://api.groq.com/openai/v1/chat/completions"
            prompt_text = self._build_prompt(user_message, history, farmer_context, tool_data, rag_chunks, language)
            payload = {
                "model": "llama-3.1-8b-instant",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_text},
                ],
                "temperature": 0.3,
                "max_tokens": 800,
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {self.groq_key}"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                choices = data.get("choices", [])
                if choices:
                    return choices[0].get("message", {}).get("content", "").strip()
        except Exception as e:
            print(f"[LLMService] Groq API call failed: {e}")
        return None

    def _call_openai(
        self,
        user_message: str,
        history: List[Dict[str, str]],
        farmer_context: Dict[str, Any],
        tool_data: Optional[Dict[str, Any]],
        rag_chunks: Optional[List[Dict[str, Any]]],
        language: str,
    ) -> Optional[str]:
        try:
            url = "https://api.openai.com/v1/chat/completions"
            prompt_text = self._build_prompt(user_message, history, farmer_context, tool_data, rag_chunks, language)
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_text},
                ],
                "temperature": 0.3,
                "max_tokens": 800,
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json", "Authorization": f"Bearer {self.openai_key}"},
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=8) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                choices = data.get("choices", [])
                if choices:
                    return choices[0].get("message", {}).get("content", "").strip()
    def _call_openrouter(
        self,
        user_message: str,
        history: List[Dict[str, str]],
        farmer_context: Dict[str, Any],
        tool_data: Optional[Dict[str, Any]],
        rag_chunks: Optional[List[Dict[str, Any]]],
        language: str,
    ) -> Optional[str]:
        try:
            url = "https://openrouter.ai/api/v1/chat/completions"
            prompt_text = self._build_prompt(user_message, history, farmer_context, tool_data, rag_chunks, language)
            payload = {
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt_text},
                ],
                "temperature": 0.3,
                "max_tokens": 800,
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.openrouter_key}",
                    "HTTP-Referer": "https://agrismart.ai",
                    "X-Title": "AgriSmart AI Assistant",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                choices = data.get("choices", [])
                if choices:
                    return choices[0].get("message", {}).get("content", "").strip()
        except Exception as e:
            print(f"[LLMService] OpenRouter API call failed: {e}")
        return None

    def _synthesize_agronomic_fallback(
        self,
        user_message: str,
        history: List[Dict[str, str]],
        farmer_context: Dict[str, Any],
        tool_data: Optional[Dict[str, Any]],
        rag_chunks: Optional[List[Dict[str, Any]]],
        language: str,
    ) -> str:
        """
        Deterministic, agronomy-grounded response synthesizer.
        Combines live tool outputs and RAG context into coherent responses.
        """
        loc = farmer_context.get("location", "your area")
        is_hi = language.startswith("hi")

        # 1. Handle Tool Outputs (Crop Recommendation, Weather, Market, Fertilizer)
        if tool_data:
            tool_type = tool_data.get("tool")

            # A. Crop Recommendation ML Output
            if tool_type == "crop_recommendation":
                recs = tool_data.get("recommendations", [])
                if recs:
                    top_crop = recs[0]["crop"]
                    top_prob = recs[0]["probability"]
                    if is_hi:
                        reply = (
                            f"आपकी मिट्टी की स्थिति और {loc} के मौसम के आधार पर, "
                            f"इस मौसम में **{top_crop}** ({top_prob}% उपयुक्तता) सबसे उपयुक्त फसल है। "
                            f"इसके अलावा आप {', '.join([r['crop'] + ' (' + str(r['probability']) + '%)' for r in recs[1:3]])} की खेती भी कर सकते हैं।"
                        )
                    else:
                        reply = (
                            f"Based on your soil parameters and real-time weather in {loc}, "
                            f"**{top_crop}** ({top_prob}% suitability) is currently the most suitable crop for your field. "
                            f"Other strong options include {', '.join([r['crop'] + ' (' + str(r['probability']) + '%)' for r in recs[1:3]])}."
                        )
                    return reply

            # B. Weather Output
            if tool_type == "weather":
                temp = tool_data.get("temperature", 28)
                rain_sum = tool_data.get("forecast_rain_3d", 0)
                condition = tool_data.get("condition", "Clear")
                advisory = tool_data.get("advisory", "")
                if is_hi:
                    return (
                        f"{loc} में वर्तमान मौसम: {temp}°C, {condition}। "
                        f"अगले 3 दिनों में अनुमानित बारिश: {rain_sum} mm।\n\n"
                        f"💡 **कृषि सलाह:** {advisory}"
                    )
                else:
                    return (
                        f"Current weather in {loc}: {temp}°C, {condition}. "
                        f"Expected rainfall over next 3 days: {rain_sum} mm.\n\n"
                        f"💡 **Farming Advisory:** {advisory}"
                    )

            # C. Market Output
            if tool_type == "market":
                crop = tool_data.get("crop", "Commodity")
                price = tool_data.get("price", 0)
                unit = tool_data.get("unit", "₹/qtl")
                state = tool_data.get("state", "National Average")
                trend = tool_data.get("trend", "Steady")
                date = tool_data.get("date", "Today")
                if is_hi:
                    return (
                        f"📊 **{crop} की ताज़ा मंडी दरें ({date}):**\n"
                        f"• औसत हाजिर भाव: ₹{price:,} {unit} ({state})\n"
                        f"• बाजार का रुझान: {trend}\n"
                        f"स्रोत: Agmarknet / APMC Mandi Feed."
                    )
                else:
                    return (
                        f"📊 **{crop} Live APMC Mandi Rates ({date}):**\n"
                        f"• Spot Wholesale Price: ₹{price:,} {unit} ({state})\n"
                        f"• Market Trend: {trend}\n"
                        f"Source: Agmarknet / Regional APMC Mandi Feed."
                    )

            # D. Fertilizer Dosage Calculation
            if tool_type == "fertilizer":
                crop = tool_data.get("crop", "Wheat")
                npk = tool_data.get("npk_ratio", "120:60:40")
                urea = tool_data.get("urea_kg_ha", 130)
                dap = tool_data.get("dap_kg_ha", 130)
                mop = tool_data.get("mop_kg_ha", 67)
                schedule = tool_data.get("schedule", "")
                if is_hi:
                    return (
                        f"🌱 **{crop} के लिए अनुशंसित उर्वरक खुराक (NPK {npk} kg/ha):**\n"
                        f"• यूरिया (Urea): ~{urea} kg/ha (विभाजित खुराक में)\n"
                        f"• डीएपी (DAP): ~{dap} kg/ha (बुवाई के समय बेसल डोज)\n"
                        f"• एमओपी (MOP): ~{mop} kg/ha (बुवाई के समय बेसल डोज)\n\n"
                        f"📋 **प्रयोग विधि:** {schedule}"
                    )
                else:
                    return (
                        f"🌱 **Recommended Fertilizer Dosage for {crop} (NPK {npk} kg/ha):**\n"
                        f"• Urea: ~{urea} kg/ha (applied in splits)\n"
                        f"• DAP: ~{dap} kg/ha (at basal sowing)\n"
                        f"• MOP (Potash): ~{mop} kg/ha (at basal sowing)\n\n"
                        f"📋 **Application Schedule:** {schedule}"
                    )

        # 2. Use RAG Knowledge Chunks
        if rag_chunks:
            top_chunk = rag_chunks[0]
            title = top_chunk.get("title", "Agricultural Advisory")
            content = top_chunk.get("content", "")
            if is_hi:
                return f"📖 **{title}**\n\n{content}"
            else:
                return f"📖 **{title}**\n\n{content}"

        # 3. Conversational / General Greeting Fallback
        q_lower = user_message.lower()
        if any(w in q_lower for w in ["hello", "hi", "namaste", "namaskar", "help", "who are you"]):
            if is_hi:
                return (
                    f"नमस्ते किसान मित्र! 🙏 मैं एग्रीस्मार्ट एआई (AgriSmart AI) सहायक हूँ। "
                    f"मैं आपकी फसल चयन, मौसम पूर्वानुमान, खाद की सही मात्रा, कीट-रोग नियंत्रण, "
                    f"मंडी भाव और सरकारी योजनाओं से जुड़े सवालों में मदद कर सकता हूँ। आप क्या जानना चाहते हैं?"
                )
            else:
                return (
                    f"Hello Farmer! 🙏 I am your AgriSmart AI Assistant. "
                    f"I can assist you with crop recommendations, real-time weather & irrigation guidance, "
                    f"fertilizer calculation, pest & disease treatment, APMC Mandi rates, and government schemes. "
                    f"How can I assist your farm today?"
                )

        # Default Helpful Agronomy Guidance
        if is_hi:
            return (
                f"आपके प्रश्न '{user_message}' के संदर्भ में: कृपया अपनी मिट्टी का प्रकार, फसल या क्षेत्र का विवरण साझा करें, "
                f"ताकि मैं आपको सटीक सिफारिश दे सकूँ।"
            )
        else:
            return (
                f"Regarding '{user_message}': Please share your specific crop, soil type, or field requirements "
                f"so I can provide a precise agronomic recommendation."
            )


# Global singleton
llm_service = LLMService.get_instance()
