import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navigation, MapPin, Clock, ChevronDown } from "lucide-react";
import { useCheckAuth } from "@/hooks/useAuth";
import { useGetUserLocations } from "@/hooks/useUser";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Smart location input with:
 * - GPS auto-detect button
 * - Dropdown of most-used past locations (for authenticated users with history)
 * - Auto-fills the most-used location if the field is empty and history exists
 */
export function LocationInput({
  value,
  onChange,
  placeholder,
  className = "",
}: LocationInputProps) {
  const { t, i18n } = useTranslation();
  const dir = i18n.language === "ar" ? "rtl" : "ltr";
  const [isLocating, setIsLocating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autoFilledRef = useRef(false); // prevent repeated auto-fills

  // Auth check — only fetch locations for authenticated regular users
  const { isAuthenticated, isUser } = useCheckAuth();
  const shouldFetchLocations = Boolean(isAuthenticated && isUser);

  // Conditionally fetch past locations
  const { savedLocations } = useGetUserLocations(shouldFetchLocations);

  const hasSavedLocations =
    shouldFetchLocations && Array.isArray(savedLocations) && savedLocations.length > 0;

  // Auto-fill the most-used location exactly once if the field is still empty
  useEffect(() => {
    if (
      !autoFilledRef.current &&
      hasSavedLocations &&
      !value &&
      savedLocations[0]
    ) {
      autoFilledRef.current = true;
      onChange(savedLocations[0]);
    }
  }, [hasSavedLocations]); // only re-run when hasSavedLocations changes

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
        onChange(mapsLink);
        setIsLocating(false);
        toast.success("Location detected!");
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied. Please allow access and try again.");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location unavailable. Please enter your address manually.");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out. Please try again.");
            break;
          default:
            toast.error("Could not get your location. Please enter your address manually.");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const safeValue = value ?? "";
  const isGoogleMapsLink = safeValue.startsWith("https://www.google.com/maps");

  return (
    <div ref={dropdownRef} className="relative">
      <div className="relative flex items-center">
        <Input
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || t("book.form.address_placeholder")}
          className={`${dir === "rtl" ? "pl-20 pr-4" : "pr-20 pl-4"} ${className}`}
          onFocus={() => hasSavedLocations && setShowDropdown(true)}
        />

        {/* Right-side action buttons */}
        <div
          className={`absolute ${dir === "rtl" ? "left-1" : "right-1"} flex items-center gap-0`}
        >
          {/* Past locations toggle — only when history exists */}
          {hasSavedLocations && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Past locations"
              onClick={() => setShowDropdown((v) => !v)}
            >
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
              />
            </Button>
          )}

          {/* GPS button — always shown */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={getCurrentLocation}
            disabled={isLocating}
            title="Use my current location"
          >
            <Navigation
              className={`h-4 w-4 text-primary ${isLocating ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Google Maps link copy hint */}
      {isGoogleMapsLink && (
        <button
          type="button"
          className="mt-1 text-xs text-primary/70 hover:text-primary flex items-center gap-1 transition-colors"
          onClick={() => {
            navigator.clipboard
              .writeText(safeValue)
              .then(() => toast.success("Location link copied!"))
              .catch(() => toast.error("Could not copy to clipboard"));
          }}
        >
          <MapPin className="h-3 w-3" />
          Copy GPS link
        </button>
      )}

      {/* Past locations dropdown */}
      {showDropdown && hasSavedLocations && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-xl overflow-hidden">
          <div className="px-3 py-2 border-b border-border/50">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Frequent Locations
            </p>
          </div>
          {savedLocations.map((loc, i) => {
            if (!loc) return null; // skip null/empty entries
            const isGMaps = loc.startsWith("https://www.google.com/maps");
            const displayLabel = isGMaps
              ? `📍 GPS Location ${i + 1}`
              : loc.length > 60
                ? loc.slice(0, 60) + "…"
                : loc;
            return (
              <button
                key={i}
                type="button"
                className={`w-full px-3 py-2.5 text-left text-sm hover:bg-accent transition-colors flex items-start gap-2 ${safeValue === loc ? "bg-primary/5 text-primary" : ""}`}
                onClick={() => {
                  onChange(loc);
                  setShowDropdown(false);
                }}
              >
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                <span className="truncate">{displayLabel}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
