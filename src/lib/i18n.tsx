"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "hi" | "mr" | "pa";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "mr", label: "Marathi", native: "मराठी" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ" },
];

const en = {
  nav: {
    tagline: "Intelligent Farming Assistant",
    home: "Home",
    features: "Features",
    how: "How It Works",
    crops: "Crops",
    schemes: "Schemes",
    market: "Market Prices",
    about: "About Us",
    getStarted: "Get Started",
    language: "Language",
    dashboard: "Dashboard",
  },
  auth: {
    signIn: "Sign In",
    signUp: "Sign Up",
    signInTitle: "Welcome back",
    signInSub: "Sign in to access your personalized farm insights.",
    signUpTitle: "Create your account",
    signUpSub: "Join 25,000+ farmers growing smarter with AgriSmart AI.",
    name: "Full Name",
    email: "Email Address",
    password: "Password",
    namePh: "e.g. Ramesh Kumar",
    emailPh: "you@example.com",
    passwordPh: "Minimum 6 characters",
    forgot: "Forgot password?",
    resetSent: "Reset link sent! Check your email inbox.",
    or: "or continue with",
    checkEmailTitle: "Check your email",
    checkEmailSub:
      "We've sent a confirmation link to your email. Click it to activate your account, then sign in.",
    backHome: "Back to home",
    signOut: "Sign Out",
    profile: "My Profile",
    memberSince: "Member since",
    phone: "Phone",
    notSet: "Not set",
    phonePh: "e.g. +91 98765 43210",
    editProfile: "Edit Profile",
    save: "Save Changes",
    cancel: "Cancel",
    profileUpdated: "Profile updated successfully!",
    errPhone: "Enter a valid phone number (7–15 digits)",
    resendEmail: "Resend verification email",
    emailResent: "Verification email sent again — please check your inbox.",
    verifyBadge: "Verify email",
    verifyTitle: "Email not verified",
    verifySub:
      "Please confirm your email address to secure your account and receive important updates.",
    verifiedBadge: "Email verified",
    resetSuccessTitle: "Password updated!",
    resetSuccessSub:
      "Your password has been changed successfully. You can now sign in with your new password.",
    backToSignIn: "Back to Sign In",
    errName: "Please enter your full name",
    errEmail: "Enter a valid email address",
    errPassword: "Password must be at least 6 characters",
    errGeneric: "Something went wrong. Please try again.",
    resetTitle: "Set a new password",
    resetSub: "Choose a new password for your AgriSmart AI account.",
    newPassword: "New Password",
    updatePassword: "Update Password",
    updated: "Password updated successfully! Redirecting…",
    invalidReset:
      "This reset link is invalid or has expired. Please request a new one from the sign-in page.",
  },
  hero: {
    badge: "Trusted by 25,000+ farmers across India",
    titleA: "AI-Powered Insights for",
    titleB: "Smarter Farming",
    subtitle:
      "AgriSmart AI helps farmers make the right decisions with personalized crop recommendations, soil analysis, weather forecasts, market insights and government scheme guidance.",
    ctaPrimary: "Get Started Free",
    ctaSecondary: "Explore Features",
    trust: "Trusted by Farmers. Built for the Future.",
    scroll: "Scroll to explore",
    chips: {
      soil: "Soil Health Testing",
      weather: "Weather Alerts",
      mandi: "Live Mandi Rates",
      schemes: "Govt Schemes",
    },
    cards: [
      { label: "Soil Health", value: "Good", sub: "pH 6.8" },
      { label: "Rainfall (This Week)", value: "24.6 mm", sub: "Moderate" },
      { label: "Temperature", value: "28°C", sub: "Moderate" },
      { label: "Market Price (Wheat)", value: "₹2,350 /qtl", sub: "+2.4%" },
    ],
  },
  ticker: {
    live: "Live Mandi Prices",
    prices: [
      { name: "Wheat", price: "₹2,350/qtl", change: "+2.4%", up: true },
      {
        name: "Rice (Basmati)",
        price: "₹4,180/qtl",
        change: "+1.1%",
        up: true,
      },
      { name: "Cotton", price: "₹7,120/qtl", change: "-0.8%", up: false },
      { name: "Maize", price: "₹2,225/qtl", change: "+0.9%", up: true },
      { name: "Sugarcane", price: "₹315/qtl", change: "+0.3%", up: true },
      { name: "Onion", price: "₹1,450/qtl", change: "-1.6%", up: false },
      { name: "Soybean", price: "₹4,892/qtl", change: "+2.0%", up: true },
      { name: "Mustard", price: "₹5,650/qtl", change: "-0.4%", up: false },
    ],
  },
  features: {
    items: [
      {
        title: "AI Crop Recommendation",
        description:
          "Personalized suggestions based on your soil, weather and market trends.",
      },
      {
        title: "Soil Health Analysis",
        description:
          "Know your soil better with NPK, pH and nutrient insights.",
      },
      {
        title: "Weather & Climate Insights",
        description: "Get accurate weather forecasts and alerts to plan ahead.",
      },
      {
        title: "Market Price Trends",
        description:
          "Track real-time mandi prices and historical price trends.",
      },
      {
        title: "Government Schemes",
        description:
          "Find schemes you are eligible for and how to apply easily.",
      },
    ],
  },
  stats: {
    labels: [
      "Farmers Empowered",
      "Villages Covered",
      "Crops Supported",
      "Accuracy in Recommendations",
    ],
  },
  how: {
    eyebrow: "How It Works",
    heading: "Smart Technology. Simple Steps.",
    steps: [
      {
        title: "Tell Us About Your Farm",
        description:
          "Enter your location, soil details, crop preference and field conditions.",
      },
      {
        title: "AI Analyzes Data",
        description:
          "Our AI models analyze soil, weather, market data and thousands of data points.",
      },
      {
        title: "Get Smart Recommendations",
        description:
          "Receive personalized crop suggestions, alerts and actionable insights.",
      },
      {
        title: "Take Better Decisions",
        description:
          "Increase productivity, reduce risks and maximize your profits.",
      },
    ],
  },
  crops: {
    eyebrow: "Crops We Support",
    heading: "From Traditional to Hybrid — We Cover All",
    description:
      "Get recommendations for a wide range of crops suitable for your region, soil type and season.",
    cta: "View All Crops",
    bestSeason: "Best Season:",
    prev: "Previous crops",
    next: "Next crops",
    autoScrolling: "Auto-Moving Crops",
    paused: "Hovered / Paused",
    varieties: "Varieties",
    catalogTitle: "Complete Agricultural Database",
    allSupported: "All Supported Crops",
    searchPlaceholder: "Search crop by name, season or category...",
    engineBtn: "AI Recommendation Engine",
    analyzeBtn: "Analyze Field Suitability →",
    idealTemp: "Ideal Temp",
    rainfallNeed: "Rainfall Need",
    optimalPh: "Optimal Soil pH",
    noCropsFound: "No crops found matching",
    categories: [
      "All",
      "Cereal / Grain",
      "Pulse / Legume",
      "Fruit",
      "Cash Crop",
      "Vegetable / Melon",
      "Plantation",
    ],
    items: [
      { name: "Wheat", season: "Rabi" },
      { name: "Rice", season: "Kharif" },
      { name: "Maize", season: "Kharif" },
      { name: "Cotton", season: "Kharif" },
      { name: "Sugarcane", season: "Annual" },
    ],
  },
  dashboard: {
    morning: "Good morning",
    afternoon: "Good afternoon",
    evening: "Good evening",
    subtitle: "Here's your farm at a glance — insights updated just for you.",
    insights: "Farm Insights",
    tipTitle: "AI Tip of the Day",
    tip: "Light rain is expected this week — you can skip one irrigation cycle for wheat and save water.",
    quickActions: "Quick Actions",
    searchPh: "Search something…",
    location: "Madhya Pradesh",
    plan: "Premium Farmer",
    viewDetails: "View Details",
    viewAll: "View All",
    side: {
      dashboard: "Dashboard",
      cropRec: "Crop Recommendation",
      soilHealth: "Soil Health",
      weather: "Weather & Climate",
      market: "Market Prices",
      schemes: "Government Schemes",
      farmRecords: "Farm Records",
      myFields: "My Fields",
      alerts: "Alerts & Notifications",
      aiAssistant: "AI Assistant",
      reports: "Reports & Analytics",
      settings: "Settings",
    },
    upgrade: {
      title: "Upgrade to",
      pro: "AgriSmart Pro",
      perks: ["Advanced AI Insights", "Priority Support", "Detailed Reports"],
      cta: "Upgrade Now",
    },
    quote: "Smart Farming for a Better Tomorrow",
    statDeltas: [
      "12% from last month",
      "8% from last week",
      "2°C from yesterday",
      "2.4% from yesterday",
    ],
    recommendation: {
      title: "AI Crop Recommendation",
      bestCrop: "Best Crop for Your Field",
      suitable: "Highly Suitable",
      confidence: "Confidence Score",
      why: "Why Wheat?",
      reasons: [
        "Suitable for your soil pH (6.8)",
        "Good market price trend",
        "Ideal temperature range",
        "Expected rainfall is optimal",
      ],
      cta: "View Full Recommendation",
    },
    soil: {
      title: "Soil Health Overview",
      current: "Current",
      optimal: "Optimal Range",
      axes: ["pH", "Nitrogen", "Phosphorus", "Potassium", "Organic Carbon"],
      levels: ["6.8", "High", "Medium", "High", "Medium"],
    },
    weatherPanel: {
      title: "Weather Forecast",
      full: "View Full Forecast",
      condition: "Partly Cloudy",
      humidity: "Humidity",
      wind: "Wind",
      feelsLike: "Feels Like",
      days: ["Today", "Tue", "Wed", "Thu", "Fri"],
    },
    schemesPanel: {
      title: "Government Schemes for You",
      eligible: "Eligible",
      apply: "Apply Now",
      items: [
        { name: "PM-KISAN Samman Nidhi", desc: "Upto ₹6,000 / year" },
        {
          name: "Kisan Credit Card (KCC)",
          desc: "Low interest loan for farmers",
        },
      ],
    },
    marketPanel: {
      title: "Market Price Trends (Wheat)",
      viewMarket: "View Market",
      last30: "Last 30 Days",
      perQtl: "/qtl",
    },
    fieldsPanel: {
      title: "My Fields",
      viewAll: "View All Fields",
      acres: "Acres",
      soilHealth: "Soil Health",
      lastActivity: "Last Activity",
      items: [
        {
          name: "North Plot",
          area: "2.5",
          score: "Good (82)",
          tone: "good",
          activity: "2 Days Ago",
        },
        {
          name: "East Plot",
          area: "3.0",
          score: "Moderate (65)",
          tone: "warn",
          activity: "5 Days Ago",
        },
        {
          name: "South Plot",
          area: "1.8",
          score: "Good (78)",
          tone: "good",
          activity: "1 Week Ago",
        },
      ],
    },
    alertsPanel: {
      title: "Recent Alerts",
      items: [
        {
          text: "Heavy rainfall alert in your area",
          sub: "Expected on 22 May 2024",
          tag: "Weather",
        },
        {
          text: "Wheat price increased in local market",
          sub: "₹2,350 /qtl (+2.4%)",
          tag: "Market",
        },
      ],
    },
    assistantPanel: {
      title: "AI Assistant",
      sub: "Ask anything about farming, crops, soil, schemes and more…",
      chips: [
        "Which crop is best for my soil?",
        "How to improve soil health?",
        "Government schemes for farmers?",
      ],
      placeholder: "Type your question here…",
      send: "Send question",
    },
    actionsPanel: {
      title: "Quick Actions",
      items: [
        "Add New Field",
        "Soil Test",
        "Crop Plan",
        "Expense Log",
        "Generate Report",
      ],
    },
  },
  schemes: {
    eyebrow: "Government Schemes",
    heading: "Schemes You May Be Eligible For",
    description:
      "AgriSmart AI matches your farm profile with central and state schemes, then guides you through the application step by step.",
    check: "Check eligibility",
    items: [
      {
        tag: "Income Support",
        name: "PM-KISAN Samman Nidhi",
        description:
          "₹6,000 per year direct income support for farmer families, paid in three instalments.",
      },
      {
        tag: "Crop Insurance",
        name: "PM Fasal Bima Yojana",
        description:
          "Affordable crop insurance covering losses from weather, pests and diseases.",
      },
      {
        tag: "Soil Health",
        name: "Soil Health Card Scheme",
        description:
          "Free soil testing with nutrient recommendations tailored to your fields.",
      },
      {
        tag: "Credit",
        name: "Kisan Credit Card",
        description:
          "Low-interest credit for seeds, fertiliser, equipment and other farm needs.",
      },
    ],
  },
  app: {
    heading: "Take AgriSmart AI Anywhere You Go",
    description:
      "All the powerful features in your pocket. Available on Android.",
    benefits: [
      "Real-time alerts & updates",
      "Offline access to insights",
      "Easy to use in local language",
      "24/7 AI Assistant",
    ],
    getItOn: "Get it on",
    store: "Google Play",
    greeting: "Good Morning,",
    farmer: "Farmer",
    tiles: [
      "Crop Advisory",
      "Soil Health",
      "Weather",
      "Mandi Prices",
      "Schemes",
      "Ask AI",
    ],
  },
  footer: {
    tagline:
      "Empowering farmers with AI technology, real-time insights and smart tools for better farming decisions.",
    contact: "Contact",
    rights: "© 2026 AgriSmart AI. All rights reserved.",
    privacy: "Privacy Policy",
    terms: "Terms & Conditions",
  },
  assistant: {
    title: "AgriSmart AI Assistant",
    online: "Online · replies instantly",
    greeting:
      "Namaste! I'm your AgriSmart AI assistant. Ask me about crops, weather, mandi prices or government schemes.",
    placeholder: "Ask about crops, weather, prices…",
    typing: "Typing",
    replies: [
      "Wheat is currently trading around ₹2,350/qtl, up 2.4% this week. If your harvest is ready, this is a good window to plan your sale.",
      "Light rainfall of about 24.6 mm is expected this week in most regions. You can skip one irrigation cycle and save water.",
      "For better yield, I recommend a soil NPK test first. Balanced fertilization can improve productivity by up to 20%.",
      "You may be eligible for PM-KISAN and the Soil Health Card scheme. Check the Schemes section above for details!",
    ],
  },
  about: {
    eyebrow: "About AgriSmart AI",
    headingA: "Empowering Farmers With",
    headingB: "Intelligent Precision",
    description:
      "AgriSmart AI is India's next-generation smart agriculture platform. We bridge traditional farming wisdom with state-of-the-art artificial intelligence to help farmers optimize yields, reduce input costs, and build a sustainable future.",
    missionTitle: "Our Mission",
    missionDesc:
      "To democratize AI and agricultural intelligence for every Indian farmer. By delivering real-time crop suitability analysis, soil health diagnostics, weather risk alerts, and transparent market data right to their fingertips.",
    missionFooter: "Accessible across rural India in regional languages",
    visionTitle: "Our Vision",
    visionDesc:
      "To build a climate-resilient, highly profitable agricultural ecosystem where data-backed decisions replace guesswork, enabling double-digit yield improvements and sustainable land stewardship for generations to come.",
    visionFooter: "Supporting over 25,000+ farming families",
    pillarsHeading: "Why Farmers Choose AgriSmart AI",
    pillars: [
      {
        title: "AI-Powered Agronomy",
        description:
          "Leveraging advanced machine learning models trained on agricultural datasets across 24+ crops, soil types, and climate conditions.",
      },
      {
        title: "Farmer-First & Multilingual",
        description:
          "Designed with intuitive interfaces, voice-ready AI assistance, and native support in Hindi, Marathi, Punjabi, and English.",
      },
      {
        title: "Trusted Governance & Schemes",
        description:
          "Direct access to PM-KISAN, PMFBY, Soil Health Cards, and state-level subsidy schemes to maximize financial security.",
      },
      {
        title: "Sustainable & Climate-Smart",
        description:
          "Promoting organic soil rejuvenation, precise NPK fertilizer guidance, and water-efficient irrigation scheduling.",
      },
    ],
  },
};

export type Dict = typeof en;

const hi: Dict = {
  nav: {
    tagline: "स्मार्ट खेती सहायक",
    home: "होम",
    features: "फ़ीचर्स",
    how: "कैसे काम करता है",
    crops: "फ़सलें",
    schemes: "योजनाएँ",
    market: "मंडी भाव",
    about: "हमारे बारे में",
    getStarted: "शुरू करें",
    language: "भाषा",
    dashboard: "डैशबोर्ड",
  },
  auth: {
    signIn: "साइन इन",
    signUp: "साइन अप",
    signInTitle: "फिर से स्वागत है",
    signInSub: "अपनी व्यक्तिगत खेत जानकारी देखने के लिए साइन इन करें।",
    signUpTitle: "अपना खाता बनाएँ",
    signUpSub:
      "AgriSmart AI के साथ स्मार्ट खेती कर रहे 25,000+ किसानों से जुड़ें।",
    name: "पूरा नाम",
    email: "ईमेल पता",
    password: "पासवर्ड",
    namePh: "जैसे रमेश कुमार",
    emailPh: "you@example.com",
    passwordPh: "कम से कम 6 अक्षर",
    forgot: "पासवर्ड भूल गए?",
    resetSent: "रीसेट लिंक भेजा गया! अपना ईमेल देखें।",
    or: "या इससे जारी रखें",
    checkEmailTitle: "अपना ईमेल देखें",
    checkEmailSub:
      "हमने आपके ईमेल पर पुष्टि लिंक भेजा है। खाता सक्रिय करने के लिए उस पर क्लिक करें, फिर साइन इन करें।",
    backHome: "होम पर वापस जाएँ",
    signOut: "साइन आउट",
    profile: "मेरी प्रोफ़ाइल",
    memberSince: "सदस्यता तिथि",
    phone: "फ़ोन",
    notSet: "सेट नहीं",
    phonePh: "जैसे +91 98765 43210",
    editProfile: "प्रोफ़ाइल संपादित करें",
    save: "बदलाव सहेजें",
    cancel: "रद्द करें",
    profileUpdated: "प्रोफ़ाइल सफलतापूर्वक अपडेट हुई!",
    errPhone: "मान्य फ़ोन नंबर दर्ज करें (7–15 अंक)",
    resendEmail: "पुष्टि ईमेल फिर से भेजें",
    emailResent: "पुष्टि ईमेल फिर से भेजा गया — कृपया अपना इनबॉक्स देखें।",
    verifyBadge: "ईमेल सत्यापित करें",
    verifyTitle: "ईमेल सत्यापित नहीं है",
    verifySub:
      "अपना खाता सुरक्षित रखने और ज़रूरी अपडेट पाने के लिए कृपया अपना ईमेल पता सत्यापित करें।",
    verifiedBadge: "ईमेल सत्यापित",
    resetSuccessTitle: "पासवर्ड अपडेट हो गया!",
    resetSuccessSub:
      "आपका पासवर्ड सफलतापूर्वक बदल दिया गया है। अब आप नए पासवर्ड से साइन इन कर सकते हैं।",
    backToSignIn: "साइन इन पर वापस जाएँ",
    errName: "कृपया अपना पूरा नाम लिखें",
    errEmail: "मान्य ईमेल पता दर्ज करें",
    errPassword: "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए",
    errGeneric: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    resetTitle: "नया पासवर्ड सेट करें",
    resetSub: "अपने AgriSmart AI खाते के लिए नया पासवर्ड चुनें।",
    newPassword: "नया पासवर्ड",
    updatePassword: "पासवर्ड अपडेट करें",
    updated: "पासवर्ड सफलतापूर्वक अपडेट हुआ! रीडायरेक्ट हो रहा है…",
    invalidReset:
      "यह रीसेट लिंक अमान्य या समाप्त हो गया है। कृपया साइन-इन पेज से नया लिंक माँगें।",
  },
  hero: {
    badge: "पूरे भारत में 25,000+ किसानों का भरोसा",
    titleA: "स्मार्ट खेती के लिए",
    titleB: "AI-संचालित समाधान",
    subtitle:
      "AgriSmart AI किसानों को व्यक्तिगत फ़सल सलाह, मिट्टी विश्लेषण, मौसम पूर्वानुमान, बाज़ार रुझान और सरकारी योजनाओं की जानकारी से सही निर्णय लेने में मदद करता है।",
    ctaPrimary: "निःशुल्क शुरू करें",
    ctaSecondary: "फ़ीचर्स देखें",
    trust: "किसानों द्वारा विश्वसनीय। भविष्य के लिए निर्मित।",
    scroll: "आगे देखने के लिए स्क्रॉल करें",
    chips: {
      soil: "मृदा स्वास्थ्य परीक्षण",
      weather: "मौसम अलर्ट",
      mandi: "ताज़ा मंडी भाव",
      schemes: "सरकारी योजनाएं",
    },
    cards: [
      { label: "मिट्टी स्वास्थ्य", value: "उत्तम", sub: "pH 6.8" },
      { label: "वर्षा (इस सप्ताह)", value: "24.6 मिमी", sub: "मध्यम" },
      { label: "तापमान", value: "28°C", sub: "मध्यम" },
      { label: "मंडी भाव (गेहूँ)", value: "₹2,350 /क्विंटल", sub: "+2.4%" },
    ],
  },
  ticker: {
    live: "लाइव मंडी भाव",
    prices: [
      { name: "गेहूं", price: "₹2,350/क्विंटल", change: "+2.4%", up: true },
      {
        name: "चावल (बासमती)",
        price: "₹4,180/क्विंटल",
        change: "+1.1%",
        up: true,
      },
      { name: "कपास", price: "₹7,120/क्विंटल", change: "-0.8%", up: false },
      { name: "मक्का", price: "₹2,225/क्विंटल", change: "+0.9%", up: true },
      { name: "गन्ना", price: "₹315/क्विंटल", change: "+0.3%", up: true },
      { name: "प्याज", price: "₹1,450/क्विंटल", change: "-1.6%", up: false },
      { name: "सोयाबीन", price: "₹4,892/क्विंटल", change: "+2.0%", up: true },
      { name: "सरसों", price: "₹5,650/क्विंटल", change: "-0.4%", up: false },
    ],
  },
  features: {
    items: [
      {
        title: "AI फ़सल सिफ़ारिश",
        description:
          "आपकी मिट्टी, मौसम और बाज़ार के रुझान के आधार पर व्यक्तिगत सुझाव।",
      },
      {
        title: "मिट्टी स्वास्थ्य विश्लेषण",
        description:
          "NPK, pH और पोषक तत्वों की जानकारी से अपनी मिट्टी को बेहतर जानें।",
      },
      {
        title: "मौसम और जलवायु जानकारी",
        description:
          "पहले से योजना बनाने के लिए सटीक मौसम पूर्वानुमान और अलर्ट पाएँ।",
      },
      {
        title: "मंडी भाव रुझान",
        description: "रीयल-टाइम मंडी भाव और ऐतिहासिक रुझान देखें।",
      },
      {
        title: "सरकारी योजनाएँ",
        description: "अपने लिए योग्य योजनाएँ खोजें और आसानी से आवेदन करें।",
      },
    ],
  },
  stats: {
    labels: [
      "सशक्त किसान",
      "कवर किए गए गाँव",
      "समर्थित फ़सलें",
      "सिफ़ारिशों में सटीकता",
    ],
  },
  how: {
    eyebrow: "कैसे काम करता है",
    heading: "स्मार्ट तकनीक। सरल चरण।",
    steps: [
      {
        title: "अपने खेत के बारे में बताएँ",
        description:
          "अपना स्थान, मिट्टी की जानकारी, फ़सल और खेत की स्थिति दर्ज करें।",
      },
      {
        title: "AI डेटा का विश्लेषण करता है",
        description:
          "हमारे AI मॉडल मिट्टी, मौसम, बाज़ार और हज़ारों डेटा पॉइंट्स का विश्लेषण करते हैं।",
      },
      {
        title: "स्मार्ट सुझाव पाएँ",
        description:
          "व्यक्तिगत फ़सल सुझाव, अलर्ट और उपयोगी जानकारी प्राप्त करें।",
      },
      {
        title: "बेहतर फ़ैसले लें",
        description: "उत्पादकता बढ़ाएँ, जोखिम घटाएँ और मुनाफ़ा अधिकतम करें।",
      },
    ],
  },
  crops: {
    eyebrow: "समर्थित फ़सलें",
    heading: "पारंपरिक से लेकर संकर तक — हम सब कवर करते हैं",
    description:
      "अपने क्षेत्र, मिट्टी के प्रकार और मौसम के अनुसार उपयुक्त फ़सलों की विस्तृत श्रृंखला के लिए सिफ़ारिशें प्राप्त करें।",
    cta: "सभी फ़सलें देखें",
    bestSeason: "उपयुक्त मौसम:",
    prev: "पिछली फ़सलें",
    next: "अगली फ़सलें",
    autoScrolling: "स्वचालित फ़सल सूची",
    paused: "रोक दिया गया",
    varieties: "फ़सल किस्में",
    catalogTitle: "संपूर्ण कृषि डेटाबेस",
    allSupported: "सभी समर्थित फ़सलें",
    searchPlaceholder: "फ़सल का नाम, मौसम या श्रेणी खोजें...",
    engineBtn: "एआई फ़सल सिफ़ारिश इंजन",
    analyzeBtn: "खेत उपयुक्तता विश्लेषण करें →",
    idealTemp: "उपयुक्त तापमान",
    rainfallNeed: "आवश्यक वर्षा",
    optimalPh: "उचित मिट्टी pH",
    noCropsFound: "कोई फ़सल नहीं मिली",
    categories: [
      "सभी",
      "अनाज",
      "दलहन",
      "फल",
      "नकदी फसल",
      "सब्जी / तरबूज",
      "बागवानी",
    ],
    items: [
      { name: "गेहूँ", season: "रबी" },
      { name: "चावल", season: "ख़रीफ़" },
      { name: "मक्का", season: "ख़रीफ़" },
      { name: "कपास", season: "ख़रीफ़" },
      { name: "गन्ना", season: "वार्षिक" },
    ],
  },
  dashboard: {
    morning: "सुप्रभात",
    afternoon: "नमस्कार",
    evening: "शुभ संध्या",
    subtitle: "आपके खेत की ताज़ा जानकारी — एक नज़र में, सिर्फ़ आपके लिए।",
    insights: "खेत की जानकारी",
    tipTitle: "आज का AI सुझाव",
    tip: "इस सप्ताह हल्की वर्षा की उम्मीद है — गेहूँ की एक सिंचाई छोड़कर आप पानी बचा सकते हैं।",
    quickActions: "त्वरित कार्य",
    searchPh: "कुछ खोजें…",
    location: "मध्य प्रदेश",
    plan: "प्रीमियम किसान",
    viewDetails: "विवरण देखें",
    viewAll: "सभी देखें",
    side: {
      dashboard: "डैशबोर्ड",
      cropRec: "फ़सल सिफ़ारिश",
      soilHealth: "मिट्टी स्वास्थ्य",
      weather: "मौसम और जलवायु",
      market: "मंडी भाव",
      schemes: "सरकारी योजनाएँ",
      farmRecords: "खेत के रिकॉर्ड",
      myFields: "मेरे खेत",
      alerts: "अलर्ट और सूचनाएँ",
      aiAssistant: "AI सहायक",
      reports: "रिपोर्ट और विश्लेषण",
      settings: "सेटिंग्स",
    },
    upgrade: {
      title: "अपग्रेड करें",
      pro: "AgriSmart Pro",
      perks: ["उन्नत AI इनसाइट्स", "प्राथमिकता सहायता", "विस्तृत रिपोर्ट"],
      cta: "अभी अपग्रेड करें",
    },
    quote: "बेहतर कल के लिए स्मार्ट खेती",
    statDeltas: [
      "पिछले महीने से 12%",
      "पिछले सप्ताह से 8%",
      "कल से 2°C",
      "कल से 2.4%",
    ],
    recommendation: {
      title: "AI फ़सल सिफ़ारिश",
      bestCrop: "आपके खेत के लिए सर्वोत्तम फ़सल",
      suitable: "अत्यंत उपयुक्त",
      confidence: "विश्वास स्कोर",
      why: "गेहूँ क्यों?",
      reasons: [
        "आपकी मिट्टी के pH (6.8) के लिए उपयुक्त",
        "बाज़ार भाव का अच्छा रुझान",
        "आदर्श तापमान सीमा",
        "अपेक्षित वर्षा अनुकूल है",
      ],
      cta: "पूरी सिफ़ारिश देखें",
    },
    soil: {
      title: "मिट्टी स्वास्थ्य अवलोकन",
      current: "वर्तमान",
      optimal: "आदर्श सीमा",
      axes: ["pH", "नाइट्रोजन", "फ़ॉस्फोरस", "पोटैशियम", "कार्बनिक कार्बन"],
      levels: ["6.8", "उच्च", "मध्यम", "उच्च", "मध्यम"],
    },
    weatherPanel: {
      title: "मौसम पूर्वानुमान",
      full: "पूरा पूर्वानुमान देखें",
      condition: "आंशिक बादल",
      humidity: "नमी",
      wind: "हवा",
      feelsLike: "अनुभव होता है",
      days: ["आज", "मंगल", "बुध", "गुरु", "शुक्र"],
    },
    schemesPanel: {
      title: "आपके लिए सरकारी योजनाएँ",
      eligible: "पात्र",
      apply: "अभी आवेदन करें",
      items: [
        { name: "पीएम-किसान सम्मान निधि", desc: "₹6,000 तक / वर्ष" },
        {
          name: "किसान क्रेडिट कार्ड (KCC)",
          desc: "किसानों के लिए कम ब्याज ऋण",
        },
      ],
    },
    marketPanel: {
      title: "मंडी भाव रुझान (गेहूँ)",
      viewMarket: "बाज़ार देखें",
      last30: "पिछले 30 दिन",
      perQtl: "/क्विंटल",
    },
    fieldsPanel: {
      title: "मेरे खेत",
      viewAll: "सभी खेत देखें",
      acres: "एकड़",
      soilHealth: "मिट्टी स्वास्थ्य",
      lastActivity: "अंतिम गतिविधि",
      items: [
        {
          name: "उत्तरी प्लॉट",
          area: "2.5",
          score: "अच्छा (82)",
          tone: "good",
          activity: "2 दिन पहले",
        },
        {
          name: "पूर्वी प्लॉट",
          area: "3.0",
          score: "मध्यम (65)",
          tone: "warn",
          activity: "5 दिन पहले",
        },
        {
          name: "दक्षिणी प्लॉट",
          area: "1.8",
          score: "अच्छा (78)",
          tone: "good",
          activity: "1 सप्ताह पहले",
        },
      ],
    },
    alertsPanel: {
      title: "ताज़ा अलर्ट",
      items: [
        {
          text: "आपके क्षेत्र में भारी वर्षा का अलर्ट",
          sub: "22 मई 2024 को अपेक्षित",
          tag: "मौसम",
        },
        {
          text: "स्थानीय बाज़ार में गेहूँ का भाव बढ़ा",
          sub: "₹2,350 /क्विंटल (+2.4%)",
          tag: "बाज़ार",
        },
      ],
    },
    assistantPanel: {
      title: "AI सहायक",
      sub: "खेती, फ़सल, मिट्टी, योजनाओं के बारे में कुछ भी पूछें…",
      chips: [
        "मेरी मिट्टी के लिए सबसे अच्छी फ़सल कौन सी है?",
        "मिट्टी का स्वास्थ्य कैसे सुधारें?",
        "किसानों के लिए सरकारी योजनाएँ?",
      ],
      placeholder: "अपना सवाल यहाँ लिखें…",
      send: "सवाल भेजें",
    },
    actionsPanel: {
      title: "त्वरित कार्य",
      items: [
        "नया खेत जोड़ें",
        "मिट्टी परीक्षण",
        "फ़सल योजना",
        "खर्च लॉग",
        "रिपोर्ट बनाएँ",
      ],
    },
  },
  schemes: {
    eyebrow: "सरकारी योजनाएँ",
    heading: "योजनाएँ जिनके आप पात्र हो सकते हैं",
    description:
      "AgriSmart AI आपके फ़ार्म प्रोफ़ाइल को केंद्र और राज्य योजनाओं से मिलाता है और आवेदन की प्रक्रिया में कदम-दर-कदम मार्गदर्शन करता है।",
    check: "पात्रता जाँचें",
    items: [
      {
        tag: "आय सहायता",
        name: "पीएम-किसान सम्मान निधि",
        description:
          "किसान परिवारों को ₹6,000 प्रति वर्ष सीधी आय सहायता, तीन किश्तों में।",
      },
      {
        tag: "फ़सल बीमा",
        name: "पीएम फ़सल बीमा योजना",
        description:
          "मौसम, कीट और बीमारियों से होने वाले नुकसान को कवर करता किफ़ायती फ़सल बीमा।",
      },
      {
        tag: "मिट्टी स्वास्थ्य",
        name: "मिट्टी स्वास्थ्य कार्ड योजना",
        description:
          "आपके खेतों के अनुरूप पोषक सुझावों के साथ मुफ़्त मिट्टी परीक्षण।",
      },
      {
        tag: "ऋण",
        name: "किसान क्रेडिट कार्ड",
        description:
          "बीज, उर्वरक, उपकरण और अन्य कृषि ज़रूरतों के लिए कम ब्याज पर ऋण।",
      },
    ],
  },
  app: {
    heading: "AgriSmart AI को हर जगह साथ ले जाएँ",
    description: "सभी शक्तिशाली फ़ीचर्स आपकी जेब में। Android पर उपलब्ध।",
    benefits: [
      "रीयल-टाइम अलर्ट और अपडेट",
      "ऑफ़लाइन जानकारी की सुविधा",
      "अपनी भाषा में आसान उपयोग",
      "24/7 AI सहायक",
    ],
    getItOn: "डाउनलोड करें",
    store: "Google Play",
    greeting: "सुप्रभात,",
    farmer: "किसान",
    tiles: [
      "फ़सल सलाह",
      "मिट्टी स्वास्थ्य",
      "मौसम",
      "मंडी भाव",
      "योजनाएँ",
      "AI से पूछें",
    ],
  },
  footer: {
    tagline:
      "AI तकनीक, रीयल-टाइम जानकारी और स्मार्ट टूल्स से किसानों को सशक्त बनाना।",
    contact: "संपर्क करें",
    rights: "© 2026 AgriSmart AI. सर्वाधिकार सुरक्षित।",
    privacy: "गोपनीयता नीति",
    terms: "नियम व शर्तें",
  },
  assistant: {
    title: "AgriSmart AI सहायक",
    online: "ऑनलाइन · तुरंत जवाब",
    greeting:
      "नमस्ते! मैं आपका AgriSmart AI सहायक हूँ। फ़सल, मौसम, मंडी भाव या सरकारी योजनाओं के बारे में पूछें।",
    placeholder: "फ़सल, मौसम, भाव के बारे में पूछें…",
    typing: "लिख रहा है",
    replies: [
      "गेहूँ इस समय लगभग ₹2,350/क्विंटल पर कारोबार कर रहा है, इस सप्ताह 2.4% ऊपर। यदि आपकी फ़सल तैयार है, तो बिक्री की योजना बनाने का यह अच्छा समय है।",
      "इस सप्ताह अधिकांश क्षेत्रों में लगभग 24.6 मिमी हल्की वर्षा की संभावना है। आप एक सिंचाई छोड़कर पानी बचा सकते हैं।",
      "बेहतर उपज के लिए मैं पहले मिट्टी का NPK परीक्षण कराने की सलाह दूँगा। संतुलित उर्वरक उपयोग से उत्पादकता 20% तक बढ़ सकती है।",
      "आप पीएम-किसान और मिट्टी स्वास्थ्य कार्ड योजना के लिए पात्र हो सकते हैं। विवरण के लिए ऊपर योजनाएँ अनुभाग देखें!",
    ],
  },
  about: {
    eyebrow: "एग्रीस्मार्ट एआई के बारे में",
    headingA: "किसानों को सशक्त बनाना",
    headingB: "सटीक बुद्धिमत्ता के साथ",
    description:
      "AgriSmart AI भारत का अगली पीढ़ी का स्मार्ट कृषि मंच है। हम पारंपरिक कृषि ज्ञान को आधुनिक आर्टिफिशियल इंटेलिजेंस से जोड़ते हैं ताकि किसान पैदावार बढ़ा सकें, लागत घटा सकें और एक समृद्ध भविष्य बना सकें।",
    missionTitle: "हमारा मिशन",
    missionDesc:
      "हर भारतीय किसान तक एआई और सटीक कृषि बुद्धिमत्ता पहुँचाना। वास्तविक समय में फसल उपयुक्तता विश्लेषण, मृदा स्वास्थ्य निदान, मौसम जोखिम चेतावनी और पारदर्शी मंडी भाव उनकी उंगलियों पर उपलब्ध कराना।",
    missionFooter: "क्षेत्रीय भाषाओं में ग्रामीण भारत तक सुलभ",
    visionTitle: "हमारा दृष्टिकोण",
    visionDesc:
      "एक जलवायु-लचीला और अत्यधिक लाभकारी कृषि पारिस्थितिकी तंत्र बनाना जहाँ अनुमान के बजाय डेटा-आधारित निर्णय लिए जाएँ, जिससे पैदावार में भारी सुधार और टिकाऊ खेती सुनिश्चित हो।",
    visionFooter: "25,000+ से अधिक किसान परिवारों का भरोसा",
    pillarsHeading: "किसान एग्रीस्मार्ट एआई क्यों चुनते हैं",
    pillars: [
      {
        title: "एआई-सक्षम कृषि विज्ञान",
        description:
          "24+ फसलों, विभिन्न मिट्टी प्रकारों और जलवायु परिस्थितियों के कृषि डेटासेट पर प्रशिक्षित उन्नत मशीन लर्निंग मॉडल।",
      },
      {
        title: "किसान-प्रथम और बहुभाषी",
        description:
          "सरल इंटरफ़ेस, वॉयस-सक्षम एआई सहायता और हिंदी, मराठी, पंजाबी और अंग्रेजी में सहज समर्थन।",
      },
      {
        title: "विश्वसनीय सरकारी योजनाएँ",
        description:
          "पीएम-किसान, पीएमएफबीवाई, सॉइल हेल्थ कार्ड और राज्य स्तरीय सब्सिडी योजनाओं तक सीधी पहुंच।",
      },
      {
        title: "टिकाऊ एवं जलवायु-स्मार्ट खेती",
        description:
          "जैविक मृदा सुधार, सटीक एनपीके उर्वरक मार्गदर्शन और जल-कुशल सिंचाई प्रबंधन।",
      },
    ],
  },
};

const mr: Dict = {
  nav: {
    tagline: "स्मार्ट शेती सहाय्यक",
    home: "होम",
    features: "वैशिष्ट्ये",
    how: "कसं काम करतं",
    crops: "पिके",
    schemes: "योजना",
    market: "बाजारभाव",
    about: "आमच्याबद्दल",
    getStarted: "सुरू करा",
    language: "भाषा",
    dashboard: "डॅशबोर्ड",
  },
  auth: {
    signIn: "साइन इन",
    signUp: "साइन अप",
    signInTitle: "पुन्हा स्वागत आहे",
    signInSub: "तुमची वैयक्तिक शेत माहिती पाहण्यासाठी साइन इन करा.",
    signUpTitle: "तुमचे खाते तयार करा",
    signUpSub:
      "AgriSmart AI सह स्मार्ट शेती करणाऱ्या 25,000+ शेतकऱ्यांमध्ये सहभागी व्हा.",
    name: "पूर्ण नाव",
    email: "ईमेल पत्ता",
    password: "पासवर्ड",
    namePh: "उदा. रमेश कुमार",
    emailPh: "you@example.com",
    passwordPh: "किमान 6 अक्षरे",
    forgot: "पासवर्ड विसरलात?",
    resetSent: "रीसेट लिंक पाठवली! तुमचा ईमेल तपासा.",
    or: "किंवा यासह सुरू ठेवा",
    checkEmailTitle: "तुमचा ईमेल तपासा",
    checkEmailSub:
      "आम्ही तुमच्या ईमेलवर पुष्टी लिंक पाठवली आहे. खाते सक्रिय करण्यासाठी तिथे क्लिक करा, नंतर साइन इन करा.",
    backHome: "मुख्यपृष्ठावर परत जा",
    signOut: "साइन आउट",
    profile: "माझी प्रोफाइल",
    memberSince: "सदस्यता तारीख",
    phone: "फोन",
    notSet: "सेट नहीं",
    phonePh: "उदा. +91 98765 43210",
    editProfile: "प्रोफाइल संपादित करा",
    save: "बदल जतन करा",
    cancel: "रद्द करा",
    profileUpdated: "प्रोफाइल यशस्वीरीत्या अपडेट झाली!",
    errPhone: "वैध फोन नंबर द्या (7–15 अंक)",
    resendEmail: "पुष्टी ईमेल पुन्हा पाठवा",
    emailResent: "पुष्टी ईमेल पुन्हा पाठवला — कृपया तुमचा इनबॉक्स तपासा.",
    verifyBadge: "ईमेल सत्यापित करा",
    verifyTitle: "ईमेल सत्यापित नाही",
    verifySub:
      "तुमचे खाते सुरक्षित ठेवण्यासाठी आणि महत्त्वाचे अपडेट मिळण्यासाठी कृपया तुमचा ईमेल पत्ता सत्यापित करा.",
    verifiedBadge: "ईमेल सत्यापित",
    resetSuccessTitle: "पासवर्ड अपडेट झाला!",
    resetSuccessSub:
      "तुमचा पासवर्ड यशस्वीरीत्या बदलला आहे. आता तुम्ही नवीन पासवर्डने साइन इन करू शकता.",
    backToSignIn: "साइन इनवर परत जा",
    errName: "कृपया तुमचे पूर्ण नाव भरा",
    errEmail: "वैध ईमेल पत्ता द्या",
    errPassword: "पासवर्ड किमान 6 अक्षरांचा असावा",
    errGeneric: "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.",
    resetTitle: "नवीन पासवर्ड सेट करा",
    resetSub: "तुमच्या AgriSmart AI खात्यासाठी नवीन पासवर्ड निवडा.",
    newPassword: "नवीन पासवर्ड",
    updatePassword: "पासवर्ड अपडेट करा",
    updated: "पासवर्ड यशस्वीरीत्या अपडेट झाला! रीडायरेक्ट होत आहे…",
    invalidReset:
      "ही रीसेट लिंक अवैध आहे किंवा कालबाह्य झाली आहे. कृपया साइन-इन पृष्ठावरून नवीन लिंक मागवा.",
  },
  hero: {
    badge: "संपूर्ण भारतात २५,०००+ शेतकऱ्यांचा विश्वास",
    titleA: "स्मार्ट शेतीसाठी",
    titleB: "AI-सक्षम उपाय",
    subtitle:
      "AgriSmart AI शेतकऱ्यांना वैयक्तिक पीक सल्ला, माती विश्लेषण, हवामान अंदाज, बाजारभाव आणि सरकारी योजनांच्या माहितीसह योग्य निर्णय घेण्यास मदत करते.",
    ctaPrimary: "मोफत सुरू करा",
    ctaSecondary: "वैशिष्ट्ये पहा",
    trust: "शेतकऱ्यांचा विश्वास. भविष्यासाठी सज्ज.",
    scroll: "पुढे पाहण्यासाठी स्क्रोल करा",
    chips: {
      soil: "माती आरोग्य तपासणी",
      weather: "हवामान अलर्ट",
      mandi: "थेट बाजारभाव",
      schemes: "सरकारी योजना",
    },
    cards: [
      { label: "माती आरोग्य", value: "उत्तम", sub: "pH 6.8" },
      { label: "पाऊस (या आठवड्यात)", value: "24.6 मिमी", sub: "मध्यम" },
      { label: "तापमान", value: "28°C", sub: "मध्यम" },
      { label: "बाजारभाव (गहू)", value: "₹2,350 /क्विंटल", sub: "+2.4%" },
    ],
  },
  ticker: {
    live: "थेट बाजारभाव",
    prices: [
      { name: "गहू", price: "₹2,350/क्विंटल", change: "+2.4%", up: true },
      {
        name: "तांदूळ (बासमती)",
        price: "₹4,180/क्विंटल",
        change: "+1.1%",
        up: true,
      },
      { name: "कापूस", price: "₹7,120/क्विंटल", change: "-0.8%", up: false },
      { name: "मका", price: "₹2,225/क्विंटल", change: "+0.9%", up: true },
      { name: "ऊस", price: "₹315/क्विंटल", change: "+0.3%", up: true },
      { name: "कांदा", price: "₹1,450/क्विंटल", change: "-1.6%", up: false },
      { name: "सोयाबीन", price: "₹4,892/क्विंटल", change: "+2.0%", up: true },
      { name: "मोहरी", price: "₹5,650/क्विंटल", change: "-0.4%", up: false },
    ],
  },
  features: {
    items: [
      {
        title: "AI पीक शिफारस",
        description:
          "तुमची माती, हवामान आणि बाजारातील कलांवर आधारित वैयक्तिक सूचना.",
      },
      {
        title: "माती आरोग्य विश्लेषण",
        description:
          "NPK, pH आणि पोषक माहितीने तुमच्या मातीला अधिक चांगले जाणा.",
      },
      {
        title: "हवामान व आढावा माहिती",
        description: "आगाऊ नियोजनासाठी अचूक हवामान अंदाज व इशाऱ्या मिळवा.",
      },
      {
        title: "बाजारभाव कल",
        description: "थेट बाजारभाव व मागील कलांचा मागोवा घ्या.",
      },
      {
        title: "शासकीय योजना",
        description: "तुम्ही पात्र असलेल्या योजना शोधा व सहज अर्ज करा.",
      },
    ],
  },
  stats: {
    labels: [
      "सशक्त शेतकरी",
      "समाविष्ट गावे",
      "समर्थित पिके",
      "शिफारसींमध्ये अचूकता",
    ],
  },
  how: {
    eyebrow: "कसं काम करतं",
    heading: "स्मार्ट तंत्रज्ञान. सोप्या पायऱ्या.",
    steps: [
      {
        title: "तुमच्या शेताबद्दल सांगा",
        description: "तुमचे स्थान, मातीची माहिती, पीक आणि शेताची स्थिती भरा.",
      },
      {
        title: "AI माहितीचे विश्लेषण करते",
        description:
          "आमचे AI मॉडेल माती, हवामान, बाजार व हजारो डेटा पॉइंट्सचे विश्लेषण करतात.",
      },
      {
        title: "स्मार्ट शिफारसी मिळवा",
        description: "वैयक्तिक पीक सूचना, अलर्ट व उपयुक्त माहिती मिळवा.",
      },
      {
        title: "चांगले निर्णय घ्या",
        description: "उत्पादकता वाढवा, धोका कमी करा व नफा वाढवा.",
      },
    ],
  },
  crops: {
    eyebrow: "समर्थित पिके",
    heading: "पारंपारिक ते संकरित — सर्व पिकांची माहिती",
    description:
      "तुमच्या विभागासाठी, मातीच्या प्रकारासाठी आणि हंगामासाठी उपयुक्त पिकांच्या विस्तृत श्रेणीसाठी शिफारसी मिळवा.",
    cta: "सर्व पिके पहा",
    bestSeason: "उत्तम हंगाम:",
    prev: "मागील पिके",
    next: "पुढील पिके",
    autoScrolling: "स्वयंचलित पीक यादी",
    paused: "थांबवले आहे",
    varieties: "पीक वाण",
    catalogTitle: "संपूर्ण कृषी डेटाबेस",
    allSupported: "सर्व समर्थित पिके",
    searchPlaceholder: "पिकाचे नाव, हंगाम किंवा वर्ग शोधा...",
    engineBtn: "AI पीक शिफारस इंजिन",
    analyzeBtn: "शेताची उपयुक्तता तपासा →",
    idealTemp: "योग्य तापमान",
    rainfallNeed: "आवश्यक पाऊस",
    optimalPh: "योग्य माती pH",
    noCropsFound: "कोणतेही पीक आढळले नाही",
    categories: [
      "सर्व",
      "धान्य",
      "कडधान्य",
      "फळे",
      "रोख पीक",
      "भाजीपाला / कलिंगड",
      "बागायती",
    ],
    items: [
      { name: "गहू", season: "रब्बी" },
      { name: "तांदूळ", season: "खरीप" },
      { name: "मका", season: "खरीप" },
      { name: "कापूस", season: "खरीप" },
      { name: "ऊस", season: "वार्षिक" },
    ],
  },
  dashboard: {
    morning: "सुप्रभात",
    afternoon: "नमस्कार",
    evening: "शुभ संध्याकाळ",
    subtitle:
      "तुमच्या शेताची ताजी माहिती — एका दृष्टिक्षेपात, खास तुमच्यासाठी.",
    insights: "शेताची माहिती",
    tipTitle: "आजचा AI सल्ला",
    tip: "या आठवड्यात हलका पाऊस अपेक्षित आहे — गव्हाचे एक सिंचन वगळून तुम्ही पाणी वाचवू शकता.",
    quickActions: "द्रुत कृती",
    searchPh: "काही शोधा…",
    location: "मध्य प्रदेश",
    plan: "प्रीमियम शेतकरी",
    viewDetails: "तपशील पहा",
    viewAll: "सर्व पहा",
    side: {
      dashboard: "डॅशबोर्ड",
      cropRec: "पीक शिफारस",
      soilHealth: "माती आरोग्य",
      weather: "हवामान व हवामान अंदाज",
      market: "बाजारभाव",
      schemes: "शासकीय योजना",
      farmRecords: "शेताचे रेकॉर्ड",
      myFields: "माझी शेते",
      alerts: "इशारे व सूचना",
      aiAssistant: "AI सहाय्यक",
      reports: "अहवाल व विश्लेषण",
      settings: "सेटिंग्ज",
    },
    upgrade: {
      title: "अपग्रेड करा",
      pro: "AgriSmart Pro",
      perks: ["प्रगत AI माहिती", "प्राधान्य सहाय्य", "तपशीलवार अहवाल"],
      cta: "आत्ताच अपग्रेड करा",
    },
    quote: "उज्ज्वल उद्यासाठी स्मार्ट शेती",
    statDeltas: [
      "मागील महिन्यापासून 12%",
      "मागील आठवड्यापासून 8%",
      "कालपासून 2°C",
      "कालपासून 2.4%",
    ],
    recommendation: {
      title: "AI पीक शिफारस",
      bestCrop: "तुमच्या शेतासाठी सर्वोत्तम पीक",
      suitable: "अत्यंत योग्य",
      confidence: "विश्वास स्कोअर",
      why: "गहू का?",
      reasons: [
        "तुमच्या मातीच्या pH (6.8) साठी योग्य",
        "बाजारभावाचा चांगला कल",
        "आदर्श तापमान कक्षा",
        "अपेक्षित पाऊस पूरक आहे",
      ],
      cta: "संपूर्ण शिफारस पहा",
    },
    soil: {
      title: "माती आरोग्य आढावा",
      current: "सध्याचे",
      optimal: "आदर्श कक्षा",
      axes: ["pH", "नायट्रोजन", "फॉस्फरस", "पोटॅशियम", "सेंद्रिय कार्बन"],
      levels: ["6.8", "जास्त", "मध्यम", "जास्त", "मध्यम"],
    },
    weatherPanel: {
      title: "हवामान अंदाज",
      full: "संपूर्ण अंदाज पहा",
      condition: "अंशतः ढगाळ",
      humidity: "आर्द्रता",
      wind: "वारा",
      feelsLike: "जाणवते",
      days: ["आज", "मंगळ", "बुध", "गुरु", "शुक्र"],
    },
    schemesPanel: {
      title: "तुमच्यासाठी शासकीय योजना",
      eligible: "पात्र",
      apply: "आत्ता अर्ज करा",
      items: [
        { name: "पीएम-किसान सन्मान निधी", desc: "₹6,000 पर्यंत / वर्ष" },
        {
          name: "किसान क्रेडिट कार्ड (KCC)",
          desc: "शेतकऱ्यांसाठी कमी व्याजाने कर्ज",
        },
      ],
    },
    marketPanel: {
      title: "बाजारभाव कल (गहू)",
      viewMarket: "बाजार पहा",
      last30: "मागील 30 दिवस",
      perQtl: "/क्विंटल",
    },
    fieldsPanel: {
      title: "माझी शेते",
      viewAll: "सर्व शेते पहा",
      acres: "एकर",
      soilHealth: "माती आरोग्य",
      lastActivity: "शेवटची क्रियाकलाप",
      items: [
        {
          name: "उत्तर प्लॉट",
          area: "2.5",
          score: "चांगले (82)",
          tone: "good",
          activity: "2 दिवसांपूर्वी",
        },
        {
          name: "पूर्व प्लॉट",
          area: "3.0",
          score: "मध्यम (65)",
          tone: "warn",
          activity: "5 दिवसांपूर्वी",
        },
        {
          name: "दक्षिण प्लॉट",
          area: "1.8",
          score: "चांगले (78)",
          tone: "good",
          activity: "1 आठवड्यापूर्वी",
        },
      ],
    },
    alertsPanel: {
      title: "अलीकडचे इशारे",
      items: [
        {
          text: "तुमच्या भागात मुसळधार पावसाचा इशारा",
          sub: "22 मे 2024 रोजी अपेक्षित",
          tag: "हवामान",
        },
        {
          text: "स्थानिक बाजारात गव्हाचा भाव वाढला",
          sub: "₹2,350 /क्विंटल (+2.4%)",
          tag: "बाजार",
        },
      ],
    },
    assistantPanel: {
      title: "AI सहाय्यक",
      sub: "शेती, पिके, माती, योजना यांबद्दल काहीही विचारा…",
      chips: [
        "माझ्या मातीसाठी सर्वोत्तम पीक कोणते?",
        "मातीचे आरोग्य कसे सुधारावे?",
        "शेतकऱ्यांसाठी शासकीय योजना?",
      ],
      placeholder: "तुमचा प्रश्न येथे लिहा…",
      send: "प्रश्न पाठवा",
    },
    actionsPanel: {
      title: "द्रुत कृती",
      items: [
        "नवीन शेत जोडा",
        "माती चाचणी",
        "पीक योजना",
        "खर्च नोंद",
        "अहवाल तयार करा",
      ],
    },
  },
  schemes: {
    eyebrow: "शासकीय योजना",
    heading: "तुम्ही पात्र असू शकता अशा योजना",
    description:
      "AgriSmart AI तुमचे शेत प्रोफाइल केंद्र व राज्य योजनांशी जुळवते व अर्ज प्रक्रियेत पायरी-पायरीने मार्गदर्शन करते.",
    check: "पात्रता तपासा",
    items: [
      {
        tag: "उत्पन्न मदत",
        name: "पीएम-किसान सन्मान निधी",
        description:
          "शेतकरी कुटुंबांना दरवर्षी ₹6,000 थेट उत्पन्न मदत, तीन हप्त्यांत.",
      },
      {
        tag: "पीक विमा",
        name: "पीएम पीक विमा योजना",
        description:
          "हवामान, कीड व रोगांमुळे होणाऱ्या नुकसानीसाठी परवडणारा पीक विमा.",
      },
      {
        tag: "माती आरोग्य",
        name: "माती आरोग्य कार्ड योजना",
        description: "तुमच्या शेतांसाठी पोषक शिफारसींसह मोफत माती तपासणी.",
      },
      {
        tag: "कर्ज",
        name: "किसान क्रेडिट कार्ड",
        description: "बियाणे, खते, अवजारे व इतर गरजांसाठी कमी व्याजाने कर्ज.",
      },
    ],
  },
  app: {
    heading: "AgriSmart AI सगळीकडे सोबत न्या",
    description: "सर्व शक्तिशाली वैशिष्ट्ये तुमच्या खिशात. Android वर उपलब्ध.",
    benefits: [
      "थेट अलर्ट व अपडेट्स",
      "ऑफलाइन माहिती उपलब्ध",
      "स्थानिक भाषेत सोपा वापर",
      "24/7 AI सहाय्यक",
    ],
    getItOn: "डाउनलोड करा",
    store: "Google Play",
    greeting: "शुभ सकाळ,",
    farmer: "शेतकरी",
    tiles: [
      "पीक सल्ला",
      "माती आरोग्य",
      "हवामान",
      "बाजारभाव",
      "योजना",
      "AI ला विचारा",
    ],
  },
  footer: {
    tagline:
      "AI तंत्रज्ञान, थेट माहिती व स्मार्ट साधनांनी शेतकऱ्यांना सक्षम करणे.",
    contact: "संपर्क",
    rights: "© 2026 AgriSmart AI. सर्व हक्क राखीव.",
    privacy: "गोपनीयता धोरण",
    terms: "अटी व नियम",
  },
  assistant: {
    title: "AgriSmart AI सहाय्यक",
    online: "ऑनलाइन · लगेच उत्तर",
    greeting:
      "नमस्कार! मी तुमचा AgriSmart AI सहाय्यक आहे. पिके, हवामान, बाजारभाव किंवा योजनांबद्दल विचारा.",
    placeholder: "पिके, हवामान, भावांबद्दल विचारा…",
    typing: "टाइप करत आहे",
    replies: [
      "गहू सध्या सुमारे ₹2,350/क्विंटलवर व्यवहार करत आहे, या आठवड्यात 2.4% वाढ. तुमची कापणी तयार असल्यास विक्रीचे नियोजन करण्याची ही चांगली वेळ आहे.",
      "या आठवड्यात बहुतेक भागांत सुमारे 24.6 मिमी हलका पाऊस अपेक्षित आहे. तुम्ही एक सिंचन वगळून पाणी वाचवू शकता.",
      "चांगल्या उत्पादनासाठी आधी मातीची NPK चाचणी करण्याचा सल्ला देईन. संतुलित खतांचा वापर उत्पादकता 20% पर्यंत वाढवू शकतो.",
      "तुम्ही पीएम-किसान व माती आरोग्य कार्ड योजनेसाठी पात्र असू शकता. तपशिलांसाठी वरील योजना विभाग पहा!",
    ],
  },
  about: {
    eyebrow: "एग्रीस्मार्ट एआय बद्दल",
    headingA: "शेतकऱ्यांचे सक्षमीकरण",
    headingB: "अचूक बुद्धिमत्तेसह",
    description:
      "AgriSmart AI हे भारतातील पुढील पिढीचे स्मार्ट कृषी व्यासपीठ आहे. आम्ही पारंपारिक शेती ज्ञान आणि अत्याधुनिक कृत्रिम बुद्धिमत्ता एकत्र आणून शेतकऱ्यांना उत्पादन वाढवण्यास आणि शाश्वत भविष्य घडवण्यास मदत करतो.",
    missionTitle: "आमचे ध्येय",
    missionDesc:
      "प्रत्येक भारतीय शेतकऱ्यापर्यंत एआय आणि अचूक शेती ज्ञान पोहोचवणे. रिअल-टाइम पीक शिफारसी, माती आरोग्य तपासणी, हवामान अंदाज आणि पारदर्शक बाजारभाव उपलब्ध करून देणे.",
    missionFooter: "प्रादेशिक भाषांमध्ये ग्रामीण भागात सहज उपलब्ध",
    visionTitle: "आमचा दृष्टिकोन",
    visionDesc:
      "एक हवामान-सक्षम आणि फायदेशीर कृषी परिसंस्था निर्माण करणे जिथे अनुमानाऐवजी डेटावर आधारित निर्णय घेतले जातील आणि उत्पादन वाढेल.",
    visionFooter: "२५,०००+ हून अधिक शेतकरी कुटुंबांचा विश्वास",
    pillarsHeading: "शेतकरी एग्रीस्मार्ट एआय का निवडतात",
    pillars: [
      {
        title: "एआय-सक्षम कृषी विज्ञान",
        description:
          "२४+ पिके, विविध मातीचे प्रकार आणि हवामानावर आधारित प्रगत मशीन लर्निंग मॉडेल्स.",
      },
      {
        title: "शेतकरी-प्रथम आणि बहुभाषिक",
        description:
          "सोपे इंटरफेस, व्हॉइस एआय आणि मराठी, हिंदी, पंजाबी व इंग्रजीमध्ये मूळ समर्थन.",
      },
      {
        title: "विश्वसनीय सरकारी योजना",
        description:
          "पीएम-किसान, पीक विमा, सॉइल हेल्थ कार्ड आणि शासकीय अनुदानांची थेट माहिती.",
      },
      {
        title: "शाश्वत आणि हवामान-स्मार्ट शेती",
        description:
          "सेंद्रिय माती सुधारणा, अचूक खत व्यवस्थापन आणि पाणी-कार्यक्षम सिंचन नियोजन.",
      },
    ],
  },
};

const pa: Dict = {
  nav: {
    tagline: "ਸਮਾਰਟ ਖੇਤੀ ਸਹਾਇਕ",
    home: "ਹੋਮ",
    features: "ਫੀਚਰ",
    how: "ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    crops: "ਫ਼ਸਲਾਂ",
    schemes: "ਸਕੀਮਾਂ",
    market: "ਮੰਡੀ ਭਾਅ",
    about: "ਸਾਡੇ ਬਾਰੇ",
    getStarted: "ਸ਼ੁਰੂ ਕਰੋ",
    language: "ਭਾਸ਼ਾ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
  },
  auth: {
    signIn: "ਸਾਈਨ ਇਨ",
    signUp: "ਸਾਈਨ ਅੱਪ",
    signInTitle: "ਫਿਰ ਜੀ ਆਇਆਂ ਨੂੰ",
    signInSub: "ਆਪਣੀ ਨਿੱਜੀ ਖੇਤ ਜਾਣਕਾਰੀ ਵੇਖਣ ਲਈ ਸਾਈਨ ਇਨ ਕਰੋ।",
    signUpTitle: "ਆਪਣਾ ਖਾਤਾ ਬਣਾਓ",
    signUpSub: "AgriSmart AI ਨਾਲ ਸਮਾਰਟ ਖੇਤੀ ਕਰ ਰਹੇ 25,000+ ਕਿਸਾਨਾਂ ਨਾਲ ਜੁੜੋ।",
    name: "ਪੂਰਾ ਨਾਮ",
    email: "ਈਮੇਲ ਪਤਾ",
    password: "ਪਾਸਵਰਡ",
    namePh: "ਜਿਵੇਂ ਰਮੇਸ਼ ਕੁਮਾਰ",
    emailPh: "you@example.com",
    passwordPh: "ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰ",
    forgot: "ਪਾਸਵਰਡ ਭੁੱਲ ਗਏ?",
    resetSent: "ਰੀਸੈਟ ਲਿੰਕ ਭੇਜਿਆ ਗਿਆ! ਆਪਣੀ ਈਮੇਲ ਵੇਖੋ।",
    or: "ਜਾਂ ਇਸ ਨਾਲ ਜਾਰੀ ਰੱਖੋ",
    checkEmailTitle: "ਆਪਣੀ ਈਮੇਲ ਵੇਖੋ",
    checkEmailSub:
      "ਅਸੀਂ ਤੁਹਾਡੀ ਈਮੇਲ 'ਤੇ ਪੁਸ਼ਟੀ ਲਿੰਕ ਭੇਜਿਆ ਹੈ। ਖਾਤਾ ਚਾਲੂ ਕਰਨ ਲਈ ਉਸ 'ਤੇ ਕਲਿੱਕ ਕਰੋ, ਫਿਰ ਸਾਈਨ ਇਨ ਕਰੋ।",
    backHome: "ਹੋਮ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    signOut: "ਸਾਈਨ ਆਉਟ",
    profile: "ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ",
    memberSince: "ਮੈਂਬਰ ਬਣਨ ਦੀ ਤਾਰੀਖ",
    phone: "ਫ਼ੋਨ",
    notSet: "ਸੈੱਟ ਨਹੀਂ",
    phonePh: "ਜਿਵੇਂ +91 98765 43210",
    editProfile: "ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ",
    save: "ਤਬਦੀਲੀਆਂ ਸੰਭਾਲੋ",
    cancel: "ਰੱਦ ਕਰੋ",
    profileUpdated: "ਪ੍ਰੋਫਾਈਲ ਸਫਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋਈ!",
    errPhone: "ਵੈਧ ਫ਼ੋਨ ਨੰਬਰ ਦਰਜ ਕਰੋ (7–15 ਅੰਕ)",
    resendEmail: "ਪੁਸ਼ਟੀ ਈਮੇਲ ਮੁੜ ਭੇਜੋ",
    emailResent: "ਪੁਸ਼ਟੀ ਈਮੇਲ ਮੁੜ ਭੇਜੀ ਗਈ — ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਇਨਬਾਕਸ ਵੇਖੋ।",
    verifyBadge: "ਈਮੇਲ ਤਸਦੀਕ ਕਰੋ",
    verifyTitle: "ਈਮੇਲ ਤਸਦੀਕ ਨਹੀਂ ਹੋਈ",
    verifySub:
      "ਆਪਣਾ ਖਾਤਾ ਸੁਰੱਖਿਅਤ ਰੱਖਣ ਅਤੇ ਜ਼ਰੂਰੀ ਅੱਪਡੇਟ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਈਮੇਲ ਪਤਾ ਤਸਦੀਕ ਕਰੋ।",
    verifiedBadge: "ਈਮੇਲ ਤਸਦੀਕ ਹੋਈ",
    resetSuccessTitle: "ਪਾਸਵਰਡ ਅੱਪਡੇਟ ਹੋ ਗਿਆ!",
    resetSuccessSub:
      "ਤੁਹਾਡਾ ਪਾਸਵਰਡ ਸਫਲਤਾਪੂਰਵਕ ਬਦਲ ਦਿੱਤਾ ਗਿਆ ਹੈ। ਹੁਣ ਤੁਸੀਂ ਨਵੇਂ ਪਾਸਵਰਡ ਨਾਲ ਸਾਈਨ ਇਨ ਕਰ ਸਕਦੇ ਹੋ।",
    backToSignIn: "ਸਾਈਨ ਇਨ 'ਤੇ ਵਾਪਸ ਜਾਓ",
    errName: "ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਪੂਰਾ ਨਾਮ ਲਿਖੋ",
    errEmail: "ਵੈਧ ਈਮੇਲ ਪਤਾ ਦਰਜ ਕਰੋ",
    errPassword: "ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ",
    errGeneric: "ਕੁਝ ਗਲਤ ਹੋ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।",
    resetTitle: "ਨਵਾਂ ਪਾਸਵਰਡ ਸੈੱਟ ਕਰੋ",
    resetSub: "ਆਪਣੇ AgriSmart AI ਖਾਤੇ ਲਈ ਨਵਾਂ ਪਾਸਵਰਡ ਚੁਣੋ।",
    newPassword: "ਨਵਾਂ ਪਾਸਵਰਡ",
    updatePassword: "ਪਾਸਵਰਡ ਅੱਪਡੇਟ ਕਰੋ",
    updated: "ਪਾਸਵਰਡ ਸਫਲਤਾਪੂਰਵਕ ਅੱਪਡੇਟ ਹੋਇਆ! ਰੀਡਾਇਰੈਕਟ ਹੋ ਰਿਹਾ ਹੈ…",
    invalidReset:
      "ਇਹ ਰੀਸੈਟ ਲਿੰਕ ਅਵੈਧ ਹੈ ਜਾਂ ਮਿਆਦ ਪੁੱਗ ਗਈ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਸਾਈਨ-ਇਨ ਪੇਜ ਤੋਂ ਨਵਾਂ ਲਿੰਕ ਮੰਗੋ।",
  },
  hero: {
    badge: "ਪੂਰੇ ਭਾਰਤ ਵਿੱਚ 25,000+ ਕਿਸਾਨਾਂ ਦਾ ਭਰੋਸਾ",
    titleA: "ਸਮਾਰਟ ਖੇਤੀ ਲਈ",
    titleB: "AI-ਸੰਚਾਲਿਤ ਸਲਾਹ",
    subtitle:
      "AgriSmart AI ਕਿਸਾਨਾਂ ਨੂੰ ਨਿੱਜੀ ਫ਼ਸਲ ਸਲਾਹ, ਮਿੱਟੀ ਜਾਂਚ, ਮੌਸਮ ਭਵਿੱਖਬਾਣੀ, ਮੰਡੀ ਰੁਝਾਨਾਂ ਅਤੇ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦੀ ਜਾਣਕਾਰੀ ਨਾਲ ਸਹੀ ਫ਼ੈਸਲੇ ਲੈਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
    ctaPrimary: "ਮੁਫ਼ਤ ਸ਼ੁਰੂ ਕਰੋ",
    ctaSecondary: "ਫੀਚਰ ਵੇਖੋ",
    trust: "ਕਿਸਾਨਾਂ ਦਾ ਭਰੋਸਾ। ਭਵਿੱਖ ਲਈ ਤਿਆਰ।",
    scroll: "ਹੋਰ ਜਾਣਨ ਲਈ ਹੇਠਾਂ ਸਕ੍ਰੋਲ ਕਰੋ",
    chips: {
      soil: "ਮਿੱਟੀ ਸਿਹਤ ਜਾਂਚ",
      weather: "ਮੌਸਮ ਚੇਤਾਵਨੀਆਂ",
      mandi: "ਤਾਜ਼ਾ ਮੰਡੀ ਭਾਅ",
      schemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    },
    cards: [
      { label: "ਮਿੱਟੀ ਸਿਹਤ", value: "ਵਧੀਆ", sub: "pH 6.8" },
      { label: "ਮੀਂਹ (ਇਸ ਹਫ਼ਤੇ)", value: "24.6 ਮਿਮੀ", sub: "ਦਰਮਿਆਨਾ" },
      { label: "ਤਾਪਮਾਨ", value: "28°C", sub: "ਦਰਮਿਆਨਾ" },
      { label: "ਮੰਡੀ ਭਾਅ (ਕਣਕ)", value: "₹2,350 /ਕੁਇੰਟਲ", sub: "+2.4%" },
    ],
  },
  ticker: {
    live: "ਲਾਈਵ ਮੰਡੀ ਭਾਅ",
    prices: [
      { name: "ਕਣਕ", price: "₹2,350/ਕੁਇੰਟਲ", change: "+2.4%", up: true },
      {
        name: "ਚਾਵਲ (ਬਾਸਮਤੀ)",
        price: "₹4,180/ਕੁਇੰਟਲ",
        change: "+1.1%",
        up: true,
      },
      { name: "ਕਪਾਹ", price: "₹7,120/ਕੁਇੰਟਲ", change: "-0.8%", up: false },
      { name: "ਮੱਕੀ", price: "₹2,225/ਕੁਇੰਟਲ", change: "+0.9%", up: true },
      { name: "ਗੰਨਾ", price: "₹315/ਕੁਇੰਟਲ", change: "+0.3%", up: true },
      { name: "ਪਿਆਜ਼", price: "₹1,450/ਕੁਇੰਟਲ", change: "-1.6%", up: false },
      { name: "ਸੋਇਆਬੀਨ", price: "₹4,892/ਕੁਇੰਟਲ", change: "+2.0%", up: true },
      { name: "ਸਰ੍ਹੋਂ", price: "₹5,650/ਕੁਇੰਟਲ", change: "-0.4%", up: false },
    ],
  },
  features: {
    items: [
      {
        title: "AI ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼",
        description:
          "ਤੁਹਾਡੀ ਮਿੱਟੀ, ਮੌਸਮ ਅਤੇ ਮੰਡੀ ਦੇ ਰੁਝਾਨਾਂ ਅਨੁਸਾਰ ਨਿੱਜੀ ਸੁਝਾਅ।",
      },
      {
        title: "ਮਿੱਟੀ ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ",
        description: "NPK, pH ਅਤੇ ਪੋਸ਼ਕ ਜਾਣਕਾਰੀ ਨਾਲ ਆਪਣੀ ਮਿੱਟੀ ਨੂੰ ਬਿਹਤਰ ਜਾਣੋ।",
      },
      {
        title: "ਮੌਸਮ ਜਾਣਕਾਰੀ",
        description: "ਅਗਾਊਂ ਯੋਜਨਾ ਲਈ ਸਹੀ ਮੌਸਮ ਭਵਿੱਖਬਾਣੀ ਅਤੇ ਅਲਰਟ ਪ੍ਰਾਪਤ ਕਰੋ।",
      },
      {
        title: "ਮੰਡੀ ਭਾਅ ਰੁਝਾਨ",
        description: "ਰੀਅਲ-ਟਾਈਮ ਮੰਡੀ ਭਾਅ ਅਤੇ ਪੁਰਾਣੇ ਰੁਝਾਨ ਵੇਖੋ।",
      },
      {
        title: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        description: "ਆਪਣੀਆਂ ਯੋਗ ਸਕੀਮਾਂ ਲੱਭੋ ਅਤੇ ਆਸਾਨੀ ਨਾਲ ਅਰਜ਼ੀ ਦਿਓ।",
      },
    ],
  },
  stats: {
    labels: [
      "ਸਸ਼ਕਤ ਕਿਸਾਨ",
      "ਕਵਰ ਕੀਤੇ ਪਿੰਡ",
      "ਸਮਰੱਥਿਤ ਫ਼ਸਲਾਂ",
      "ਸਿਫ਼ਾਰਸ਼ਾਂ ਵਿੱਚ ਸ਼ੁੱਧਤਾ",
    ],
  },
  how: {
    eyebrow: "ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    heading: "ਸਮਾਰਟ ਤਕਨੀਕ। ਸੌਖੇ ਕਦਮ।",
    steps: [
      {
        title: "ਆਪਣੇ ਖੇਤ ਬਾਰੇ ਦੱਸੋ",
        description:
          "ਆਪਣਾ ਟਿਕਾਣਾ, ਮਿੱਟੀ ਦੀ ਜਾਣਕਾਰੀ, ਫ਼ਸਲ ਅਤੇ ਖੇਤ ਦੀ ਸਥਿਤੀ ਦਰਜ ਕਰੋ।",
      },
      {
        title: "AI ਡੇਟਾ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦਾ ਹੈ",
        description:
          "ਸਾਡੇ AI ਮਾਡਲ ਮਿੱਟੀ, ਮੌਸਮ, ਮੰਡੀ ਅਤੇ ਹਜ਼ਾਰਾਂ ਡੇਟਾ ਪੌਇੰਟਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦੇ ਹਨ।",
      },
      {
        title: "ਸਮਾਰਟ ਸੁਝਾਅ ਪ੍ਰਾਪਤ ਕਰੋ",
        description: "ਨਿੱਜੀ ਫ਼ਸਲ ਸੁਝਾਅ, ਅਲਰਟ ਅਤੇ ਕਾਰਜਕੁਸ਼ਲ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ।",
      },
      {
        title: "ਬਿਹਤਰ ਫ਼ੈਸਲੇ ਲਓ",
        description: "ਉਤਪਾਦਕਤਾ ਵਧਾਓ, ਜੋਖਮ ਘਟਾਓ ਅਤੇ ਮੁਨਾਫ਼ਾ ਵੱਧ ਤੋਂ ਵੱਧ ਕਰੋ।",
      },
    ],
  },
  crops: {
    eyebrow: "ਸਮਰਥਿਤ ਫ਼ਸਲਾਂ",
    heading: "ਰਵਾਇਤੀ ਤੋਂ ਲੈ ਕੇ ਹਾਈਬ੍ਰਿਡ ਤੱਕ — ਸਭ ਸ਼ਾਮਲ ਹਨ",
    description:
      "ਆਪਣੇ ਖੇਤਰ, ਮਿੱਟੀ ਦੀ ਕਿਸਮ ਅਤੇ ਮੌਸਮ ਅਨੁਸਾਰ ਢੁਕਵੀਆਂ ਫ਼ਸਲਾਂ ਦੀ ਵਿਸਤ੍ਰਿਤ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ।",
    cta: "ਸਾਰੀਆਂ ਫ਼ਸਲਾਂ ਵੇਖੋ",
    bestSeason: "ਵਧੀਆ ਸੀਜ਼ਨ:",
    prev: "ਪਿਛਲੀਆਂ ਫ਼ਸਲਾਂ",
    next: "ਅਗਲੀਆਂ ਫ਼ਸਲਾਂ",
    autoScrolling: "ਸਵੈ-ਚੱਲਣ ਵਾਲੀ ਫ਼ਸਲ ਸੂਚੀ",
    paused: "ਰੋਕਿਆ ਗਿਆ",
    varieties: "ਫ਼ਸਲ ਕਿਸਮਾਂ",
    catalogTitle: "ਸੰਪੂਰਨ ਖੇਤੀਬਾੜੀ ਡਾਟਾਬੇਸ",
    allSupported: "ਸਾਰੀਆਂ ਸਮਰਥਿਤ ਫ਼ਸਲਾਂ",
    searchPlaceholder: "ਫ਼ਸਲ ਦਾ ਨਾਮ, ਸੀਜ਼ਨ ਜਾਂ ਸ਼੍ਰੇਣੀ ਖੋਜੋ...",
    engineBtn: "AI ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼ ਇੰਜਣ",
    analyzeBtn: "ਖੇਤ ਦੀ ਅਨੁਕੂਲਤਾ ਜਾਂਚੋ →",
    idealTemp: "ਢੁਕਵਾਂ ਤਾਪਮਾਨ",
    rainfallNeed: "ਲੋੜੀਂਦਾ ਮੀਂਹ",
    optimalPh: "ਢੁਕਵਾਂ ਮਿੱਟੀ pH",
    noCropsFound: "ਕੋਈ ਫ਼ਸਲ ਨਹੀਂ ਮਿਲੀ",
    categories: [
      "ਸਾਰੇ",
      "ਅਨਾਜ",
      "ਦਾਲਾਂ",
      "ਫਲ",
      "ਨਕਦੀ ਫ਼ਸਲ",
      "ਸਬਜ਼ੀ / ਤਰਬੂਜ",
      "ਬਾਗਬਾਨੀ",
    ],
    items: [
      { name: "ਕਣਕ", season: "ਹਾੜ੍ਹੀ" },
      { name: "ਝੋਨਾ", season: "ਸਾਉਣੀ" },
      { name: "ਮੱਕੀ", season: "ਸਾਉਣੀ" },
      { name: "ਨਰਮਾ/ਕਪਾਹ", season: "ਸਾਉਣੀ" },
      { name: "ਗੰਨਾ", season: "ਸਾਲਾਨਾ" },
    ],
  },
  dashboard: {
    morning: "ਸੁਪ੍ਰਭਾਤ",
    afternoon: "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ",
    evening: "ਸ਼ੁਭ ਸ਼ਾਮ",
    subtitle: "ਤੁਹਾਡੇ ਖੇਤ ਦੀ ਤਾਜ਼ਾ ਜਾਣਕਾਰੀ — ਇੱਕ ਨਜ਼ਰ ਵਿੱਚ, ਸਿਰਫ਼ ਤੁਹਾਡੇ ਲਈ।",
    insights: "ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ",
    tipTitle: "ਅੱਜ ਦਾ AI ਸੁਝਾਅ",
    tip: "ਇਸ ਹਫ਼ਤੇ ਹਲਕੀ ਬਾਰਸ਼ ਦੀ ਉਮੀਦ ਹੈ — ਕਣਕ ਦੀ ਇੱਕ ਸਿੰਚਾਈ ਛੱਡ ਕੇ ਤੁਸੀਂ ਪਾਣੀ ਬਚਾ ਸਕਦੇ ਹੋ।",
    quickActions: "ਤੇਜ਼ ਕਾਰਵਾਈਆਂ",
    searchPh: "ਕੁਝ ਖੋਜੋ…",
    location: "ਮੱਧ ਪ੍ਰਦੇਸ਼",
    plan: "ਪ੍ਰੀਮੀਅਮ ਕਿਸਾਨ",
    viewDetails: "ਵੇਰਵੇ ਵੇਖੋ",
    viewAll: "ਸਭ ਵੇਖੋ",
    side: {
      dashboard: "ਡੈਸ਼ਬੋਰਡ",
      cropRec: "ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼",
      soilHealth: "ਮਿੱਟੀ ਸਿਹਤ",
      weather: "ਮੌਸਮ ਅਤੇ ਜਲਵਾਯੂ",
      market: "ਮੰਡੀ ਭਾਅ",
      schemes: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
      farmRecords: "ਖੇਤ ਦੇ ਰਿਕਾਰਡ",
      myFields: "ਮੇਰੇ ਖੇਤ",
      alerts: "ਅਲਰਟ ਅਤੇ ਸੂਚਨਾਵਾਂ",
      aiAssistant: "AI ਸਹਾਇਕ",
      reports: "ਰਿਪੋਰਟਾਂ ਅਤੇ ਵਿਸ਼ਲੇਸ਼ਣ",
      settings: "ਸੈਟਿੰਗਾਂ",
    },
    upgrade: {
      title: "ਅੱਪਗਰੇਡ ਕਰੋ",
      pro: "AgriSmart Pro",
      perks: ["ਤਕਨੀਕੀ AI ਜਾਣਕਾਰੀ", "ਤਰਜੀਹੀ ਸਹਾਇਤਾ", "ਵਿਸਤ੍ਰਿਤ ਰਿਪੋਰਟਾਂ"],
      cta: "ਹੁਣੇ ਅੱਪਗਰੇਡ ਕਰੋ",
    },
    quote: "ਬਿਹਤਰ ਕੱਲ੍ਹ ਲਈ ਸਮਾਰਟ ਖੇਤੀ",
    statDeltas: [
      "ਪਿਛਲੇ ਮਹੀਨੇ ਤੋਂ 12%",
      "ਪਿਛਲੇ ਹਫ਼ਤੇ ਤੋਂ 8%",
      "ਕੱਲ੍ਹ ਤੋਂ 2°C",
      "ਕੱਲ੍ਹ ਤੋਂ 2.4%",
    ],
    recommendation: {
      title: "AI ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼",
      bestCrop: "ਤੁਹਾਡੇ ਖੇਤ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਫ਼ਸਲ",
      suitable: "ਬਹੁਤ ਢੁੱਕਵੀਂ",
      confidence: "ਭਰੋਸਾ ਸਕੋਰ",
      why: "ਕਣਕ ਕਿਉਂ?",
      reasons: [
        "ਤੁਹਾਡੀ ਮਿੱਟੀ ਦੇ pH (6.8) ਲਈ ਢੁੱਕਵੀਂ",
        "ਮੰਡੀ ਭਾਅ ਦਾ ਵਧੀਆ ਰੁਝਾਨ",
        "ਆਦਰਸ਼ ਤਾਪਮਾਨ ਸੀਮਾ",
        "ਉਮੀਦ ਵਾਲੀ ਬਾਰਸ਼ ਅਨੁਕੂਲ ਹੈ",
      ],
      cta: "ਪੂਰੀ ਸਿਫ਼ਾਰਸ਼ ਵੇਖੋ",
    },
    soil: {
      title: "ਮਿੱਟੀ ਸਿਹਤ ਸੰਖੇਪ",
      current: "ਮੌਜੂਦਾ",
      optimal: "ਆਦਰਸ਼ ਸੀਮਾ",
      axes: ["pH", "ਨਾਈਟ੍ਰੋਜਨ", "ਫ਼ਾਸਫੋਰਸ", "ਪੋਟਾਸ਼ੀਅਮ", "ਜੈਵਿਕ ਕਾਰਬਨ"],
      levels: ["6.8", "ਵੱਧ", "ਦਰਮਿਆਨਾ", "ਵੱਧ", "ਦਰਮਿਆਨਾ"],
    },
    weatherPanel: {
      title: "ਮੌਸਮ ਪੂਰਵਾਨੁਮਾਨ",
      full: "ਪੂਰਾ ਪੂਰਵਾਨੁਮਾਨ ਵੇਖੋ",
      condition: "ਅੰਸ਼ਕ ਬੱਦਲ",
      humidity: "ਨਮੀ",
      wind: "ਹਵਾ",
      feelsLike: "ਮਹਿਸੂਸ ਹੁੰਦਾ ਹੈ",
      days: ["ਅੱਜ", "ਮੰਗਲ", "ਬੁੱਧ", "ਵੀਰ", "ਸ਼ੁੱਕਰ"],
    },
    schemesPanel: {
      title: "ਤੁਹਾਡੇ ਲਈ ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
      eligible: "ਯੋਗ",
      apply: "ਹੁਣੇ ਅਰਜ਼ੀ ਦਿਓ",
      items: [
        { name: "ਪੀਐਮ-ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ", desc: "₹6,000 ਤੱਕ / ਸਾਲ" },
        { name: "ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ (KCC)", desc: "ਕਿਸਾਨਾਂ ਲਈ ਘੱਟ ਵਿਆਜ ਕਰਜ਼ਾ" },
      ],
    },
    marketPanel: {
      title: "ਮੰਡੀ ਭਾਅ ਰੁਝਾਨ (ਕਣਕ)",
      viewMarket: "ਮੰਡੀ ਵੇਖੋ",
      last30: "ਪਿਛਲੇ 30 ਦਿਨ",
      perQtl: "/ਕੁਇੰਟਲ",
    },
    fieldsPanel: {
      title: "ਮੇਰੇ ਖੇਤ",
      viewAll: "ਸਾਰੇ ਖੇਤ ਵੇਖੋ",
      acres: "ਏਕੜ",
      soilHealth: "ਮਿੱਟੀ ਸਿਹਤ",
      lastActivity: "ਆਖਰੀ ਗਤੀਵਿਧੀ",
      items: [
        {
          name: "ਉੱਤਰੀ ਪਲਾਟ",
          area: "2.5",
          score: "ਵਧੀਆ (82)",
          tone: "good",
          activity: "2 ਦਿਨ ਪਹਿਲਾਂ",
        },
        {
          name: "ਪੂਰਬੀ ਪਲਾਟ",
          area: "3.0",
          score: "ਦਰਮਿਆਨਾ (65)",
          tone: "warn",
          activity: "5 ਦਿਨ ਪਹਿਲਾਂ",
        },
        {
          name: "ਦੱਖਣੀ ਪਲਾਟ",
          area: "1.8",
          score: "ਵਧੀਆ (78)",
          tone: "good",
          activity: "1 ਹਫ਼ਤਾ ਪਹਿਲਾਂ",
        },
      ],
    },
    alertsPanel: {
      title: "ਤਾਜ਼ਾ ਅਲਰਟ",
      items: [
        {
          text: "ਤੁਹਾਡੇ ਖੇਤਰ ਵਿੱਚ ਭਾਰੀ ਬਾਰਸ਼ ਦਾ ਅਲਰਟ",
          sub: "22 ਮਈ 2024 ਨੂੰ ਉਮੀਦ",
          tag: "ਮੌਸਮ",
        },
        {
          text: "ਸਥਾਨਕ ਮੰਡੀ ਵਿੱਚ ਕਣਕ ਦਾ ਭਾਅ ਵਧਿਆ",
          sub: "₹2,350 /ਕੁਇੰਟਲ (+2.4%)",
          tag: "ਮੰਡੀ",
        },
      ],
    },
    assistantPanel: {
      title: "AI ਸਹਾਇਕ",
      sub: "ਖੇਤੀ, ਫ਼ਸਲਾਂ, ਮਿੱਟੀ, ਸਕੀਮਾਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ…",
      chips: [
        "ਮੇਰੀ ਮਿੱਟੀ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਫ਼ਸਲ ਕਿਹੜੀ ਹੈ?",
        "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਕਿਵੇਂ ਸੁਧਾਰੀਏ?",
        "ਕਿਸਾਨਾਂ ਲਈ ਸਰਕਾਰੀ ਸਕੀਮਾਂ?",
      ],
      placeholder: "ਆਪਣਾ ਸਵਾਲ ਇੱਥੇ ਲਿਖੋ…",
      send: "ਸਵਾਲ ਭੇਜੋ",
    },
    actionsPanel: {
      title: "ਤੇਜ਼ ਕਾਰਵਾਈਆਂ",
      items: [
        "ਨਵਾਂ ਖੇਤ ਜੋੜੋ",
        "ਮਿੱਟੀ ਜਾਂਚ",
        "ਫ਼ਸਲ ਯੋਜਨਾ",
        "ਖ਼ਰਚ ਲੌਗ",
        "ਰਿਪੋਰਟ ਬਣਾਓ",
      ],
    },
  },
  schemes: {
    eyebrow: "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    heading: "ਸਕੀਮਾਂ ਜਿਨ੍ਹਾਂ ਲਈ ਤੁਸੀਂ ਯੋਗ ਹੋ ਸਕਦੇ ਹੋ",
    description:
      "AgriSmart AI ਤੁਹਾਡੇ ਫ਼ਾਰਮ ਪ੍ਰੋਫ਼ਾਈਲ ਨੂੰ ਕੇਂਦਰ ਅਤੇ ਸੂਬਾ ਸਕੀਮਾਂ ਨਾਲ ਮਿਲਾਉਂਦਾ ਹੈ ਅਤੇ ਅਰਜ਼ੀ ਵਿੱਚ ਕਦਮ-ਦਰ-ਕਦਮ ਮਦਦ ਕਰਦਾ ਹੈ।",
    check: "ਯੋਗਤਾ ਜਾਂਚੋ",
    items: [
      {
        tag: "ਆਮਦਨ ਸਹਾਇਤਾ",
        name: "ਪੀਐਮ-ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ",
        description:
          "ਕਿਸਾਨ ਪਰਿਵਾਰਾਂ ਲਈ ₹6,000 ਸਾਲਾਨਾ ਸਿੱਧੀ ਆਮਦਨ ਸਹਾਇਤਾ, ਤਿੰਨ ਕਿਸ਼ਤਾਂ ਵਿੱਚ।",
      },
      {
        tag: "ਫ਼ਸਲ ਬੀਮਾ",
        name: "ਪੀਐਮ ਫ਼ਸਲ ਬੀਮਾ ਯੋਜਨਾ",
        description:
          "ਮੌਸਮ, ਕੀੜੇ ਅਤੇ ਬਿਮਾਰੀਆਂ ਤੋਂ ਹੋਏ ਨੁਕਸਾਨ ਲਈ ਕਿਫ਼ਾਇਤੀ ਫ਼ਸਲ ਬੀਮਾ।",
      },
      {
        tag: "ਮਿੱਟੀ ਸਿਹਤ",
        name: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਸਕੀਮ",
        description: "ਤੁਹਾਡੇ ਖੇਤਾਂ ਲਈ ਪੋਸ਼ਕ ਸੁਝਾਅਾਂ ਨਾਲ ਮੁਫ਼ਤ ਮਿੱਟੀ ਜਾਂਚ।",
      },
      {
        tag: "ਕਰਜ਼ਾ",
        name: "ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ",
        description: "ਬੀਜ, ਖਾਦ, ਉਪਕਰਣ ਅਤੇ ਹੋਰ ਲੋੜਾਂ ਲਈ ਘੱਟ ਵਿਆਜ 'ਤੇ ਕਰਜ਼ਾ।",
      },
    ],
  },
  app: {
    heading: "AgriSmart AI ਹਰ ਥਾਂ ਨਾਲ ਲੈ ਜਾਓ",
    description: "ਸਾਰੇ ਦਮਦਾਰ ਫੀਚਰ ਤੁਹਾਡੀ ਜੇਬ ਵਿੱਚ। Android 'ਤੇ ਉਪਲਬਧ।",
    benefits: [
      "ਰੀਅਲ-ਟਾਈਮ ਅਲਰਟ ਅਤੇ ਅਪਡੇਟ",
      "ਔਫ਼ਲਾਈਨ ਜਾਣਕਾਰੀ ਉਪਲਬਧ",
      "ਆਪਣੀ ਭਾਸ਼ਾ ਵਿੱਚ ਆਸਾਨ ਵਰਤੋਂ",
      "24/7 AI ਸਹਾਇਕ",
    ],
    getItOn: "ਡਾਊਨਲੋਡ ਕਰੋ",
    store: "Google Play",
    greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ,",
    farmer: "ਕਿਸਾਨ",
    tiles: [
      "ਫ਼ਸਲ ਸਲਾਹ",
      "ਮਿੱਟੀ ਸਿਹਤ",
      "ਮੌਸਮ",
      "ਮੰਡੀ ਭਾਅ",
      "ਸਕੀਮਾਂ",
      "AI ਨੂੰ ਪੁੱਛੋ",
    ],
  },
  footer: {
    tagline:
      "AI ਤਕਨੀਕ, ਰੀਅਲ-ਟਾਈਮ ਜਾਣਕਾਰੀ ਅਤੇ ਸਮਾਰਟ ਟੂਲਾਂ ਨਾਲ ਕਿਸਾਨਾਂ ਨੂੰ ਸਸ਼ਕਤ ਬਣਾਉਣਾ।",
    contact: "ਸੰਪਰਕ",
    rights: "© 2026 AgriSmart AI। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ।",
    privacy: "ਗੋਪਨੀਯਤਾ ਨੀਤੀ",
    terms: "ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ",
  },
  assistant: {
    title: "AgriSmart AI ਸਹਾਇਕ",
    online: "ਔਨਲਾਈਨ · ਤੁਰੰਤ ਜਵਾਬ",
    greeting:
      "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AgriSmart AI ਸਹਾਇਕ ਹਾਂ। ਫ਼ਸਲਾਂ, ਮੌਸਮ, ਮੰਡੀ ਭਾਅ ਜਾਂ ਸਕੀਮਾਂ ਬਾਰੇ ਪੁੱਛੋ।",
    placeholder: "ਫ਼ਸਲਾਂ, ਮੌਸਮ, ਭਾਅ ਬਾਰੇ ਪੁੱਛੋ…",
    typing: "ਲਿਖ ਰਿਹਾ ਹੈ",
    replies: [
      "ਕਣਕ ਇਸ ਸਮੇਂ ਲਗਭਗ ₹2,350/ਕੁਇੰਟਲ 'ਤੇ ਵਪਾਰ ਕਰ ਰਹੀ ਹੈ, ਇਸ ਹਫ਼ਤੇ 2.4% ਵਧੀ ਹੈ। ਜੇ ਤੁਹਾਡੀ ਫ਼ਸਲ ਤਿਆਰ ਹੈ ਤਾਂ ਵਿਕਰੀ ਲਈ ਇਹ ਵਧੀਆ ਸਮਾਂ ਹੈ।",
      "ਇਸ ਹਫ਼ਤੇ ਜ਼ਿਆਦਾਤਰ ਖੇਤਰਾਂ ਵਿੱਚ ਲਗਭਗ 24.6 ਮਿਮੀ ਹਲਕੀ ਵਰਖਾ ਦੀ ਉਮੀਦ ਹੈ। ਤੁਸੀਂ ਇੱਕ ਸਿੰਚਾਈ ਛੱਡ ਕੇ ਪਾਣੀ ਬਚਾ ਸਕਦੇ ਹੋ।",
      "ਵਧੀਆ ਝਾੜ ਲਈ ਪਹਿਲਾਂ ਮਿੱਟੀ ਦੀ NPK ਜਾਂਚ ਕਰਵਾਉਣ ਦੀ ਸਲਾਹ ਦਿੰਦਾ ਹਾਂ। ਸੰਤੁਲਿਤ ਖਾਦ ਨਾਲ ਉਤਪਾਦਕਤਾ 20% ਤੱਕ ਵਧ ਸਕਦੀ ਹੈ।",
      "ਤੁਸੀਂ ਪੀਐਮ-ਕਿਸਾਨ ਅਤੇ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਸਕੀਮ ਲਈ ਯੋਗ ਹੋ ਸਕਦੇ ਹੋ। ਵੇਰਵੇ ਲਈ ਉੱਪਰ ਸਕੀਮਾਂ ਵਾਲਾ ਭਾਗ ਵੇਖੋ!",
    ],
  },
  about: {
    eyebrow: "ਐਗਰੀਸਮਾਰਟ ਏਆਈ ਬਾਰੇ",
    headingA: "ਕਿਸਾਨਾਂ ਦਾ ਸਸ਼ਕਤੀਕਰਨ",
    headingB: "ਸਮਾਰਟ ਤਕਨਾਲੋਜੀ ਨਾਲ",
    description:
      "AgriSmart AI ਭਾਰਤ ਦਾ ਅਗਲੀ ਪੀੜ੍ਹੀ ਦਾ ਸਮਾਰਟ ਖੇਤੀਬਾੜੀ ਪਲੇਟਫਾਰਮ ਹੈ। ਅਸੀਂ ਰਵਾਇਤੀ ਖੇਤੀ ਤਜ਼ਰਬੇ ਨੂੰ ਆਧੁਨਿਕ ਆਰਟੀਫੀਸ਼ੀਅਲ ਇੰਟੈਲੀਜੈਂਸ ਨਾਲ ਜੋੜ ਕੇ ਕਿਸਾਨਾਂ ਦਾ ਝਾੜ ਵਧਾਉਣ ਅਤੇ ਖਰਚਾ ਘਟਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦੇ ਹਾਂ।",
    missionTitle: "ਸਾਡਾ ਮਿਸ਼ਨ",
    missionDesc:
      "ਹਰ ਭਾਰਤੀ ਕਿਸਾਨ ਤੱਕ ਏਆਈ ਅਤੇ ਖੇਤੀਬਾੜੀ ਦੀ ਸਹੀ ਸਮਝ ਪਹੁੰਚਾਉਣਾ। ਰੀਅਲ-ਟਾਈਮ ਫ਼ਸਲ ਸਲਾਹ, ਮਿੱਟੀ ਸਿਹਤ ਜਾਂਚ, ਮੌਸਮ ਅਲਰਟ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਮੰਡੀ ਭਾਅ ਉਪਲਬਧ ਕਰਵਾਉਣਾ।",
    missionFooter: "ਪੇਂਡੂ ਭਾਰਤ ਵਿੱਚ ਖੇਤਰੀ ਭਾਸ਼ਾਵਾਂ ਵਿੱਚ ਉਪਲਬਧ",
    visionTitle: "ਸਾਡਾ ਵਿਜ਼ਨ",
    visionDesc:
      "ਇੱਕ ਮੌਸਮ-ਅਨੁਕੂਲ ਅਤੇ ਮੁਨਾਫ਼ੇ ਵਾਲਾ ਖੇਤੀ ਈਕੋਸਿਸਟਮ ਤਿਆਰ ਕਰਨਾ ਜਿੱਥੇ ਅੰਦਾਜ਼ਿਆਂ ਦੀ ਥਾਂ ਡਾਟਾ ਆਧਾਰਿਤ ਫ਼ੈਸਲੇ ਲਏ ਜਾਣ।",
    visionFooter: "25,000+ ਤੋਂ ਵੱਧ ਕਿਸਾਨ ਪਰਿਵਾਰਾਂ ਦਾ ਭਰੋਸਾ",
    pillarsHeading: "ਕਿਸਾਨ ਐਗਰੀਸਮਾਰਟ ਏਆਈ ਨੂੰ ਕਿਉਂ ਚੁਣਦੇ ਹਨ",
    pillars: [
      {
        title: "ਏਆਈ-ਸੰਚਾਲਿਤ ਖੇਤੀਬਾੜੀ",
        description:
          "24+ ਫ਼ਸਲਾਂ, ਮਿੱਟੀ ਦੀਆਂ ਕਿਸਮਾਂ ਅਤੇ ਮੌਸਮੀ ਹਾਲਤਾਂ 'ਤੇ ਆਧਾਰਿਤ ਐਡਵਾਂਸਡ ਮਸ਼ੀਨ ਲਰਨਿੰਗ ਮਾਡਲ।",
      },
      {
        title: "ਕਿਸਾਨ-ਪਹਿਲ ਅਤੇ ਬਹੁਭਾਸ਼ਾਈ",
        description:
          "ਸੌਖਾ ਇੰਟਰਫੇਸ, ਵਾਇਸ ਏਆਈ ਸਹਾਇਤਾ ਅਤੇ ਪੰਜਾਬੀ, ਹਿੰਦੀ, ਮਰਾਠੀ ਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਸਹਿਯੋਗ।",
      },
      {
        title: "ਭਰੋਸੇਯੋਗ ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
        description:
          "ਪੀਐਮ-ਕਿਸਾਨ, ਪੀਐਮਐਫਬੀਵਾਈ, ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਅਤੇ ਸਬਸਿਡੀਆਂ ਦੀ ਸਿੱਧੀ ਜਾਣਕਾਰੀ।",
      },
      {
        title: "ਟਿਕਾਊ ਅਤੇ ਮੌਸਮ-ਸਮਾਰਟ ਖੇਤੀ",
        description:
          "ਜੈਵਿਕ ਮਿੱਟੀ ਸੁਧਾਰ, ਸਹੀ ਖਾਦ ਪ੍ਰਬੰਧਨ ਅਤੇ ਪਾਣੀ ਦੀ ਬੱਚਤ ਵਾਲੀ ਸਿੰਚਾਈ ਯੋਜਨਾ।",
      },
    ],
  },
};

export const DICTS: Record<Lang, Dict> = { en, hi, mr, pa };

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "agrismart-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "hi" || saved === "mr" || saved === "pa") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: (next: Lang) => {
        setLangState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      },
      t: DICTS[lang],
    }),
    [lang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
