"use client";

import {
  createElement,
  useRef,
  useState,
  useEffect,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flower2,
  LeafyGreen,
  Palmtree,
  Sprout,
  Wheat as WheatIcon,
  Apple as AppleIcon,
  Coffee as CoffeeIcon,
  Grape as GrapeIcon,
  Sparkles,
  TreePine,
  Sun,
  Droplets,
  Thermometer,
  X,
  Search,
} from "lucide-react";
import { Reveal } from "./reveal";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import cropsBg from "@/assets/crops-bg.jpg";
import cropWheat from "@/assets/crop-wheat.jpg";
import cropRice from "@/assets/crop-rice.jpg";
import cropMaize from "@/assets/crop-maize.jpg";
import cropCotton from "@/assets/crop-cotton.jpg";
import cropSugarcane from "@/assets/crop-sugarcane.jpg";
import cropBlackgram from "@/assets/crop-blackgram.jpg";
import cropChickpea from "@/assets/crop-chickpea.jpg";
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

export interface SupportedCrop {
  id: string;
  name: string;
  hindiName: string;
  marathiName: string;
  punjabiName: string;
  category:
    | "Cereal / Grain"
    | "Pulse / Legume"
    | "Fruit"
    | "Cash Crop"
    | "Vegetable / Melon"
    | "Plantation";
  season: "Kharif" | "Rabi" | "Zaid" | "Annual / Perennial";
  tempRange: string;
  rainfall: string;
  phRange: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ALL_SUPPORTED_CROPS_LIST: SupportedCrop[] = [
  {
    id: "apple",
    name: "Apple",
    hindiName: "सेब",
    marathiName: "सफरचंद",
    punjabiName: "ਸੇਬ",
    category: "Fruit",
    season: "Annual / Perennial",
    tempRange: "15°C – 24°C",
    rainfall: "1000 – 1250 mm",
    phRange: "5.5 – 6.5",
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80",
    icon: AppleIcon,
  },
  {
    id: "banana",
    name: "Banana",
    hindiName: "केला",
    marathiName: "केळी",
    punjabiName: "ਕੇਲਾ",
    category: "Fruit",
    season: "Annual / Perennial",
    tempRange: "20°C – 35°C",
    rainfall: "1200 – 2000 mm",
    phRange: "6.0 – 7.5",
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
    icon: Palmtree,
  },
  {
    id: "blackgram",
    name: "Blackgram",
    hindiName: "उड़द",
    marathiName: "उडीद",
    punjabiName: "ਮਾਂਹ",
    category: "Pulse / Legume",
    season: "Kharif",
    tempRange: "25°C – 35°C",
    rainfall: "600 – 750 mm",
    phRange: "6.5 – 7.8",
    image: cropBlackgram.src,
    icon: Sprout,
  },
  {
    id: "chickpea",
    name: "Chickpea",
    hindiName: "चना",
    marathiName: "हरभरा",
    punjabiName: "ਛੋਲੇ",
    category: "Pulse / Legume",
    season: "Rabi",
    tempRange: "15°C – 25°C",
    rainfall: "400 – 600 mm",
    phRange: "6.0 – 8.0",
    image: cropChickpea.src,
    icon: Sprout,
  },
  {
    id: "coconut",
    name: "Coconut",
    hindiName: "नारियल",
    marathiName: "नारळ",
    punjabiName: "ਨਾਰੀਅਲ",
    category: "Plantation",
    season: "Annual / Perennial",
    tempRange: "22°C – 32°C",
    rainfall: "1500 – 2500 mm",
    phRange: "5.2 – 8.0",
    image: cropCoconut.src,
    icon: Palmtree,
  },
  {
    id: "coffee",
    name: "Coffee",
    hindiName: "कॉफ़ी",
    marathiName: "कॉफी",
    punjabiName: "ਕੌਫੀ",
    category: "Plantation",
    season: "Annual / Perennial",
    tempRange: "15°C – 28°C",
    rainfall: "1500 – 2200 mm",
    phRange: "5.0 – 6.5",
    image: cropCoffee.src,
    icon: CoffeeIcon,
  },
  {
    id: "cotton",
    name: "Cotton",
    hindiName: "कपास",
    marathiName: "कापूस",
    punjabiName: "ਕਪਾਹ",
    category: "Cash Crop",
    season: "Kharif",
    tempRange: "21°C – 30°C",
    rainfall: "500 – 1000 mm",
    phRange: "6.0 – 8.0",
    image: cropCotton.src,
    icon: Flower2,
  },
  {
    id: "grapes",
    name: "Grapes",
    hindiName: "अंगूर",
    marathiName: "द्राक्षे",
    punjabiName: "ਅੰਗੂਰ",
    category: "Fruit",
    season: "Annual / Perennial",
    tempRange: "15°C – 35°C",
    rainfall: "500 – 900 mm",
    phRange: "6.5 – 8.0",
    image:
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80",
    icon: GrapeIcon,
  },
  {
    id: "jute",
    name: "Jute",
    hindiName: "जूट / पटसन",
    marathiName: "ताग",
    punjabiName: "ਪਟਸਨ",
    category: "Cash Crop",
    season: "Kharif",
    tempRange: "24°C – 37°C",
    rainfall: "1200 – 1800 mm",
    phRange: "6.0 – 7.5",
    image: cropJute.src,
    icon: LeafyGreen,
  },
  {
    id: "kidneybeans",
    name: "Kidney Beans",
    hindiName: "राजमा",
    marathiName: "राजमा",
    punjabiName: "ਰਾਜਮਾਂਹ",
    category: "Pulse / Legume",
    season: "Kharif",
    tempRange: "15°C – 25°C",
    rainfall: "600 – 1000 mm",
    phRange: "5.5 – 6.8",
    image: cropKidneybeans.src,
    icon: Sprout,
  },
  {
    id: "lentil",
    name: "Lentil",
    hindiName: "मसूर",
    marathiName: "मसूर",
    punjabiName: "ਮਸਰ",
    category: "Pulse / Legume",
    season: "Rabi",
    tempRange: "18°C – 30°C",
    rainfall: "400 – 600 mm",
    phRange: "6.0 – 7.5",
    image: cropLentil.src,
    icon: Sprout,
  },
  {
    id: "maize",
    name: "Maize",
    hindiName: "मक्का",
    marathiName: "मका",
    punjabiName: "ਮੱਕੀ",
    category: "Cereal / Grain",
    season: "Kharif",
    tempRange: "18°C – 27°C",
    rainfall: "600 – 1100 mm",
    phRange: "5.8 – 7.5",
    image: cropMaize.src,
    icon: LeafyGreen,
  },
  {
    id: "mango",
    name: "Mango",
    hindiName: "आम",
    marathiName: "आंबा",
    punjabiName: "ਅੰਬ",
    category: "Fruit",
    season: "Zaid",
    tempRange: "24°C – 35°C",
    rainfall: "750 – 2500 mm",
    phRange: "5.5 – 7.5",
    image: cropMango.src,
    icon: TreePine,
  },
  {
    id: "mothbeans",
    name: "Moth Beans",
    hindiName: "मोठ",
    marathiName: "मटकी",
    punjabiName: "ਮੋਠ",
    category: "Pulse / Legume",
    season: "Kharif",
    tempRange: "24°C – 32°C",
    rainfall: "300 – 500 mm",
    phRange: "6.0 – 8.0",
    image: cropMothbeans.src,
    icon: Sprout,
  },
  {
    id: "mungbean",
    name: "Mung Bean",
    hindiName: "मूंग",
    marathiName: "मूग",
    punjabiName: "ਮੂੰਗੀ",
    category: "Pulse / Legume",
    season: "Zaid",
    tempRange: "27°C – 35°C",
    rainfall: "600 – 750 mm",
    phRange: "6.2 – 7.2",
    image: cropMungbean.src,
    icon: Sprout,
  },
  {
    id: "muskmelon",
    name: "Muskmelon",
    hindiName: "खरबूजा",
    marathiName: "खरबूज",
    punjabiName: "ਖਰਬੂਜਾ",
    category: "Vegetable / Melon",
    season: "Zaid",
    tempRange: "20°C – 32°C",
    rainfall: "400 – 600 mm",
    phRange: "6.0 – 7.0",
    image: cropMuskmelon.src,
    icon: Sun,
  },
  {
    id: "orange",
    name: "Orange",
    hindiName: "संतरा",
    marathiName: "संत्रा",
    punjabiName: "ਸੰਤਰਾ",
    category: "Fruit",
    season: "Annual / Perennial",
    tempRange: "15°C – 35°C",
    rainfall: "1000 – 1500 mm",
    phRange: "6.0 – 7.5",
    image:
      "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=800&q=80",
    icon: Sun,
  },
  {
    id: "papaya",
    name: "Papaya",
    hindiName: "पपीता",
    marathiName: "पपई",
    punjabiName: "ਪਪੀਤਾ",
    category: "Fruit",
    season: "Annual / Perennial",
    tempRange: "21°C – 33°C",
    rainfall: "1000 – 1800 mm",
    phRange: "6.0 – 6.8",
    image:
      "https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=800&q=80",
    icon: Palmtree,
  },
  {
    id: "pigeonpeas",
    name: "Pigeon Peas",
    hindiName: "अरहर / तुअर",
    marathiName: "तूर",
    punjabiName: "ਤੂਰ / ਅਰਹਰ",
    category: "Pulse / Legume",
    season: "Kharif",
    tempRange: "20°C – 35°C",
    rainfall: "600 – 1000 mm",
    phRange: "5.0 – 7.0",
    image: cropPigeonpeas.src,
    icon: Sprout,
  },
  {
    id: "pomegranate",
    name: "Pomegranate",
    hindiName: "अनार",
    marathiName: "डाळिंब",
    punjabiName: "ਅਨਾਰ",
    category: "Fruit",
    season: "Annual / Perennial",
    tempRange: "20°C – 38°C",
    rainfall: "500 – 800 mm",
    phRange: "5.5 – 7.2",
    image: cropPomegranate.src,
    icon: Sparkles,
  },
  {
    id: "rice",
    name: "Rice",
    hindiName: "धान",
    marathiName: "भात / तांदूळ",
    punjabiName: "ਝੋਨਾ / ਚੌਲ",
    category: "Cereal / Grain",
    season: "Kharif",
    tempRange: "20°C – 35°C",
    rainfall: "1000 – 2000 mm",
    phRange: "5.0 – 6.5",
    image: cropRice.src,
    icon: Sprout,
  },
  {
    id: "watermelon",
    name: "Watermelon",
    hindiName: "तरबूज",
    marathiName: "कलिंगड",
    punjabiName: "ਤਰਬੂਜ",
    category: "Vegetable / Melon",
    season: "Zaid",
    tempRange: "24°C – 35°C",
    rainfall: "400 – 600 mm",
    phRange: "6.0 – 7.0",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    icon: Sun,
  },
  {
    id: "sugarcane",
    name: "Sugarcane",
    hindiName: "गन्ना",
    marathiName: "ऊस",
    punjabiName: "ਗੰਨਾ",
    category: "Cash Crop",
    season: "Annual / Perennial",
    tempRange: "20°C – 35°C",
    rainfall: "1500 – 2500 mm",
    phRange: "6.0 – 7.5",
    image: cropSugarcane.src,
    icon: Palmtree,
  },
  {
    id: "wheat",
    name: "Wheat",
    hindiName: "गेहूं",
    marathiName: "गहू",
    punjabiName: "ਕਣਕ",
    category: "Cereal / Grain",
    season: "Rabi",
    tempRange: "15°C – 25°C",
    rainfall: "350 – 750 mm",
    phRange: "6.0 – 7.5",
    image: cropWheat.src,
    icon: WheatIcon,
  },
];

export function getCropDisplayName(crop: SupportedCrop, lang: string): string {
  if (lang === "hi") return crop.hindiName;
  if (lang === "mr") return crop.marathiName || crop.hindiName;
  if (lang === "pa") return crop.punjabiName || crop.hindiName;
  return crop.name;
}

export function getCropSecondaryName(
  crop: SupportedCrop,
  lang: string,
): string {
  if (lang === "en") return crop.hindiName;
  return crop.name;
}

export function getLocalizedSeason(season: string, lang: string): string {
  if (season === "Kharif") {
    if (lang === "hi") return "खरीफ़";
    if (lang === "mr") return "खरीप";
    if (lang === "pa") return "ਸਾਉਣੀ";
    return "Kharif";
  }
  if (season === "Rabi") {
    if (lang === "hi") return "रबी";
    if (lang === "mr") return "रब्बी";
    if (lang === "pa") return "ਹਾੜ੍ਹੀ";
    return "Rabi";
  }
  if (season === "Zaid") {
    if (lang === "hi") return "जायद";
    if (lang === "mr") return "झायद";
    if (lang === "pa") return "ਜ਼ਾਇਦ";
    return "Zaid";
  }
  if (season.includes("Annual")) {
    if (lang === "hi") return "वार्षिक / बहुवर्षीय";
    if (lang === "mr") return "वार्षिक / बारमाही";
    if (lang === "pa") return "ਸਾਲਾਨਾ / ਸਦਾਬਹਾਰ";
    return "Annual / Perennial";
  }
  return season;
}

/**
 * Horizontally auto-scrolling crop rail with continuous infinite flow, pause-on-hover & manual navigation.
 */
export function CropRail({
  onSelectCrop,
}: {
  onSelectCrop?: (crop: SupportedCrop) => void;
}) {
  const { lang, t } = useLanguage();
  const railRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);

  function scrollByCard(dir: 1 | -1) {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.querySelector<HTMLElement>("[data-crop-card]");
    const step = card ? card.offsetWidth + 16 : 280;
    rail.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  // Smooth seamless infinite auto-scrolling
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let animationFrameId: number;
    const scrollSpeed = 1.0; // smooth natural scroll speed

    const autoScroll = () => {
      if (!isPaused && !isDragging && rail) {
        const halfWidth = rail.scrollWidth / 2;
        if (halfWidth > 0 && rail.scrollLeft >= halfWidth) {
          rail.scrollLeft -= halfWidth;
        } else {
          rail.scrollLeft += scrollSpeed;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, isDragging]);

  // Pointer drag to scroll support
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rail = railRef.current;
    if (!rail) return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartScroll.current = rail.scrollLeft;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rail = railRef.current;
    if (!rail) return;
    const delta = e.clientX - dragStartX.current;
    rail.scrollLeft = dragStartScroll.current - delta;
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const cards = Array.from(
      railRef.current?.querySelectorAll<HTMLElement>("[data-crop-card]") ?? [],
    );
    const index = cards.indexOf(e.target as HTMLElement);
    if (index === -1) return;
    e.preventDefault();
    const next =
      cards[
        (index + (e.key === "ArrowRight" ? 1 : -1) + cards.length) %
          cards.length
      ];
    next?.focus();
    next?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }

  const navButtonClass =
    "flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition-all hover:bg-white/25 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf cursor-pointer shadow-sm";

  // Doubled array for seamless wrap-around marquee loop
  const displayCrops = [
    ...ALL_SUPPORTED_CROPS_LIST,
    ...ALL_SUPPORTED_CROPS_LIST,
  ];

  return (
    <div
      className="min-w-0 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsDragging(false);
      }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${isPaused ? "bg-amber-400" : "bg-leaf animate-pulse"}`}
          />
          <span>
            {isPaused ? t.crops.paused : t.crops.autoScrolling} •{" "}
            {ALL_SUPPORTED_CROPS_LIST.length} {t.crops.varieties}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label={t.crops.prev || "Previous"}
            className={navButtonClass}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label={t.crops.next || "Next"}
            className={navButtonClass}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        role="list"
        aria-label={t.crops.eyebrow}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex min-w-0 gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
      >
        {displayCrops.map((crop, idx) => {
          const mainName = getCropDisplayName(crop, lang);
          const subName = getCropSecondaryName(crop, lang);
          const localizedSeason = getLocalizedSeason(crop.season, lang);

          return (
            <figure
              key={`${crop.id}-${idx}`}
              data-crop-card
              role="listitem"
              tabIndex={0}
              onClick={() => onSelectCrop?.(crop)}
              aria-label={`${mainName} — ${t.crops.bestSeason || "Best Season:"} ${localizedSeason}`}
              className="group relative w-56 sm:w-64 shrink-0 overflow-hidden rounded-2xl outline-none transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/70 focus-visible:-translate-y-2 focus-visible:shadow-2xl focus-visible:shadow-black/70 focus-visible:ring-2 focus-visible:ring-leaf cursor-pointer bg-forest-card"
            >
              <img
                src={crop.image}
                alt={mainName}
                width={640}
                height={960}
                loading="lazy"
                draggable={false}
                className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:h-80"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent transition-opacity duration-300 group-hover:opacity-90"
                aria-hidden="true"
              />

              {/* Top Left Icon Pill */}
              <span
                className="absolute left-3.5 top-3.5 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 dark:bg-[#081f15]/95 text-primary shadow-md backdrop-blur-xs transition-transform duration-300 group-hover:scale-115 group-hover:rotate-6"
                aria-hidden="true"
              >
                {createElement(crop.icon, {
                  className: "h-5 w-5 text-[#168447]",
                })}
              </span>

              {/* Category Tag */}
              <span className="absolute right-3.5 top-3.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur-md border border-white/15 transition-transform duration-300 group-hover:scale-105">
                {crop.category}
              </span>

              {/* Bottom Caption */}
              <figcaption className="absolute inset-x-4 bottom-4">
                <div className="flex items-baseline gap-1.5">
                  <p className="font-display text-lg font-bold text-white group-hover:text-leaf transition-colors">
                    {mainName}
                  </p>
                  {subName && subName !== mainName && (
                    <span className="text-xs text-white/75 font-medium">
                      ({subName})
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/85 mt-0.5">
                  {t.crops.bestSeason || "Best Season:"}{" "}
                  <span className="text-leaf font-bold">{localizedSeason}</span>
                </p>
              </figcaption>

              {/* Bottom Right Arrow Action */}
              <span
                className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur transition-all duration-300 group-hover:border-transparent group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110"
                aria-hidden="true"
              >
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </figure>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Full-bleed photo panel with intro text + scrollable crop rail
 */
export function CropsPanel({
  ctaHref = "/crop-recommendation",
  bleed = false,
}: {
  ctaHref?: string;
  bleed?: boolean;
}) {
  const { lang, t } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<SupportedCrop | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);

  const rawCategories = [
    "All",
    "Cereal / Grain",
    "Pulse / Legume",
    "Fruit",
    "Cash Crop",
    "Vegetable / Melon",
    "Plantation",
  ];

  const categories = t.crops.categories || rawCategories;

  const filteredCrops = ALL_SUPPORTED_CROPS_LIST.filter((crop) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      crop.name.toLowerCase().includes(q) ||
      crop.hindiName.toLowerCase().includes(q) ||
      crop.marathiName.toLowerCase().includes(q) ||
      crop.punjabiName.toLowerCase().includes(q) ||
      crop.season.toLowerCase().includes(q);

    const matchesCategory =
      selectedCategoryIndex === 0 ||
      crop.category === rawCategories[selectedCategoryIndex];

    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className={cn(
        "relative flex flex-col justify-between gap-10 overflow-hidden bg-forest p-6 sm:p-10 lg:p-12",
        bleed
          ? "min-h-[46rem] lg:min-h-[50rem]"
          : "min-h-[40rem] rounded-[2.5rem]",
      )}
    >
      <img
        src={cropsBg.src}
        alt=""
        width={1920}
        height={1080}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-forest/95 via-forest/60 to-forest/20"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-forest/90 to-transparent"
        aria-hidden="true"
      />

      {/* Header Info */}
      <div className="relative max-w-xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-leaf">
          {t.crops.eyebrow || "Crops We Support"}
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-forest-foreground sm:text-4xl lg:text-5xl">
          {t.crops.heading || "From Traditional to Hybrid — We Cover All"}
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-forest-foreground/80 sm:text-base">
          {t.crops.description ||
            "Get recommendations for a wide range of crops suitable for your region, soil type and season."}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCatalogOpen(true)}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90 cursor-pointer shadow-lg shadow-emerald-950/40"
          >
            <span>
              {t.crops.cta || "View All Crops"} (
              {ALL_SUPPORTED_CROPS_LIST.length})
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <Link
            href="/crop-recommendation"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:bg-white/20"
          >
            <Sparkles className="h-4 w-4 text-leaf" />
            <span>{t.crops.engineBtn || "AI Recommendation Engine"}</span>
          </Link>
        </div>
      </div>

      {/* Auto-scrolling Rail */}
      <div className="relative">
        <CropRail onSelectCrop={(crop) => setSelectedCrop(crop)} />
      </div>

      {/* MODAL 1: Crop Quick Detail Dialog */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 bg-[#0c2419] p-6 text-white shadow-2xl animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setSelectedCrop(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer z-10"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative -mx-6 -mt-6 mb-5 h-52 overflow-hidden">
              <img
                src={selectedCrop.image}
                alt={getCropDisplayName(selectedCrop, lang)}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c2419] via-[#0c2419]/30 to-black/30" />
              <div className="absolute bottom-3 left-6">
                <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white shadow">
                  {selectedCrop.category}
                </span>
                <h3 className="mt-1 font-display text-2xl font-bold text-white">
                  {getCropDisplayName(selectedCrop, lang)}{" "}
                  <span className="text-white/70 text-lg font-normal">
                    ({getCropSecondaryName(selectedCrop, lang)})
                  </span>
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center gap-1.5 text-white/70">
                  <Sun className="h-4 w-4 text-leaf" />
                  <span>{t.crops.bestSeason || "Best Season"}</span>
                </div>
                <span className="mt-1 block text-sm font-bold text-white">
                  {getLocalizedSeason(selectedCrop.season, lang)}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center gap-1.5 text-white/70">
                  <Thermometer className="h-4 w-4 text-rose-400" />
                  <span>{t.crops.idealTemp || "Ideal Temp"}</span>
                </div>
                <span className="mt-1 block text-sm font-bold text-white">
                  {selectedCrop.tempRange}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center gap-1.5 text-white/70">
                  <Droplets className="h-4 w-4 text-sky-400" />
                  <span>{t.crops.rainfallNeed || "Rainfall Need"}</span>
                </div>
                <span className="mt-1 block text-sm font-bold text-white">
                  {selectedCrop.rainfall}
                </span>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5">
                <div className="flex items-center gap-1.5 text-white/70">
                  <Sprout className="h-4 w-4 text-emerald-400" />
                  <span>{t.crops.optimalPh || "Optimal Soil pH"}</span>
                </div>
                <span className="mt-1 block text-sm font-bold text-white">
                  {selectedCrop.phRange}
                </span>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <Link
                href="/crop-recommendation"
                className="flex-1 rounded-xl bg-primary py-3 text-center text-xs font-bold text-primary-foreground shadow transition hover:bg-primary/90"
              >
                {t.crops.analyzeBtn || "Analyze Field Suitability →"}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Full Crops Catalog Modal */}
      {isCatalogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative max-h-[88vh] w-full max-w-4xl flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-[#092117] text-white shadow-2xl animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-5 sm:p-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-leaf">
                  {t.crops.catalogTitle || "Complete Agricultural Database"}
                </span>
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                  {t.crops.allSupported || "All Supported Crops"} (
                  {ALL_SUPPORTED_CROPS_LIST.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCatalogOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 sm:p-6 border-b border-white/10 bg-black/20">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
                <input
                  type="text"
                  placeholder={
                    t.crops.searchPlaceholder ||
                    "Search crop by name, season, or category..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-full rounded-xl border border-white/15 bg-white/5 pl-10 pr-4 text-xs text-white placeholder:text-white/40 focus:border-leaf focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat, idx) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategoryIndex(idx)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-xs font-semibold whitespace-nowrap transition cursor-pointer",
                      selectedCategoryIndex === idx
                        ? "bg-primary text-white"
                        : "bg-white/5 text-white/70 hover:bg-white/10",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of Crops */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCrops.map((crop) => {
                  const mainName = getCropDisplayName(crop, lang);
                  const subName = getCropSecondaryName(crop, lang);
                  const locSeason = getLocalizedSeason(crop.season, lang);

                  return (
                    <div
                      key={crop.id}
                      onClick={() => {
                        setIsCatalogOpen(false);
                        setSelectedCrop(crop);
                      }}
                      className="group relative flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/10 hover:border-leaf/50 transition-all cursor-pointer"
                    >
                      <img
                        src={crop.image}
                        alt={mainName}
                        className="h-16 w-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-bold text-sm text-white truncate">
                            {mainName}
                          </span>
                          {subName && subName !== mainName && (
                            <span className="text-[11px] text-white/60">
                              ({subName})
                            </span>
                          )}
                        </div>
                        <span className="inline-block mt-0.5 rounded bg-leaf/20 px-1.5 py-0.5 text-[10px] font-semibold text-leaf">
                          {crop.category}
                        </span>
                        <p className="text-[11px] text-white/70 mt-1 truncate">
                          {locSeason} • {crop.rainfall}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredCrops.length === 0 && (
                <div className="py-12 text-center text-white/60">
                  <p className="text-sm">
                    {t.crops.noCropsFound || "No crops found matching"} "
                    {searchQuery}".
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Crops() {
  return (
    <section id="crops">
      <Reveal>
        <CropsPanel bleed />
      </Reveal>
    </section>
  );
}
