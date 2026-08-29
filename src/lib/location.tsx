"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { toast } from "sonner";

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationContextType {
  location: string;
  coords: Coordinates | null;
  isLive: boolean;
  isLoading: boolean;
  error: string | null;
  fetchLiveLocation: (silent?: boolean) => Promise<string | null>;
  setLocation: (name: string, isLive?: boolean) => void;
}

const DEFAULT_LOCATION = "Bhopal, Madhya Pradesh";
const STORAGE_KEY = "agrismart-location";
const STORAGE_LIVE_KEY = "agrismart-location-is-live";

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

/**
 * Reverse geocode latitude and longitude into City, State format
 */
async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string | null> {
  try {
    // 1. Try BigDataCloud reverse geocode API (Fast, reliable, CORS enabled, no key needed)
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      { signal: AbortSignal.timeout(4000) },
    );
    if (res.ok) {
      const data = await res.json();
      const city =
        data.city ||
        data.locality ||
        data.localityInfo?.administrative?.[3]?.name ||
        data.localityInfo?.administrative?.[2]?.name;
      const state =
        data.principalSubdivision ||
        data.localityInfo?.administrative?.[1]?.name;

      if (city && state) {
        return `${city}, ${state}`;
      } else if (city) {
        return city;
      } else if (state) {
        return state;
      }
    }
  } catch {
    // Fall through to secondary reverse geocoding
  }

  try {
    // 2. Try OpenStreetMap Nominatim
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`,
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(4000),
      },
    );
    if (res.ok) {
      const data = await res.json();
      const addr = data.address || {};
      const city =
        addr.city || addr.town || addr.village || addr.county || addr.district;
      const state = addr.state;
      if (city && state) {
        return `${city}, ${state}`;
      } else if (city) {
        return city;
      }
    }
  } catch {
    // Ignore fallback failure
  }

  return null;
}

/**
 * IP-based location fallback if GPS is denied or unavailable
 */
async function fetchIpLocation(): Promise<{
  name: string;
  coords: Coordinates | null;
} | null> {
  try {
    const res = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.city && data.region) {
        return {
          name: `${data.city}, ${data.region}`,
          coords:
            data.latitude && data.longitude
              ? { latitude: data.latitude, longitude: data.longitude }
              : null,
        };
      }
    }
  } catch {
    // Ignore IP fallback failure
  }
  return null;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<string>(DEFAULT_LOCATION);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [isLive, setIsLive] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setLocationState(saved);
      const savedLive = localStorage.getItem(STORAGE_LIVE_KEY);
      if (savedLive !== null) setIsLive(savedLive !== "false");
    } catch {
      // Ignore localStorage access restrictions
    }
  }, []);

  const setLocation = useCallback((name: string, live: boolean = false) => {
    setLocationState(name);
    setIsLive(live);
    if (!live) {
      setCoords(null);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, name);
      localStorage.setItem(STORAGE_LIVE_KEY, String(live));
    }
  }, []);

  const fetchLiveLocation = useCallback(
    async (silent: boolean = false): Promise<string | null> => {
      setIsLoading(true);
      setError(null);

      // 1. Try Browser Geolocation API
      if (typeof window !== "undefined" && "geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 8000,
                maximumAge: 60000,
              });
            },
          );

          const { latitude, longitude } = position.coords;
          setCoords({ latitude, longitude });

          const geoName = await reverseGeocode(latitude, longitude);
          if (geoName) {
            setLocationState(geoName);
            setIsLive(true);
            localStorage.setItem(STORAGE_KEY, geoName);
            localStorage.setItem(STORAGE_LIVE_KEY, "true");
            setIsLoading(false);
            if (!silent) {
              toast.success(`Live location detected: ${geoName}`);
            }
            return geoName;
          }
        } catch {
          // GPS denied or timed out; proceed to IP-based lookup
        }
      }

      // 2. Fallback to IP-based location auto-detection
      const ipLoc = await fetchIpLocation();
      if (ipLoc) {
        setLocationState(ipLoc.name);
        if (ipLoc.coords) setCoords(ipLoc.coords);
        setIsLive(true);
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, ipLoc.name);
          localStorage.setItem(STORAGE_LIVE_KEY, "true");
        }
        setIsLoading(false);
        if (!silent) {
          toast.success(`Live location detected: ${ipLoc.name}`);
        }
        return ipLoc.name;
      }

      // 3. Fallback to default
      setIsLoading(false);
      return location;
    },
    [location],
  );

  return (
    <LocationContext.Provider
      value={{
        location,
        coords,
        isLive,
        isLoading,
        error,
        fetchLiveLocation,
        setLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
}
