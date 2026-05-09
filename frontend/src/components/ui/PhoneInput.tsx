import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhoneInputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    error?: boolean;
}

/**
 * A generic phone input that allows any format.
 * 
 * Auto-formats local Jordanian numbers (07XXXXXXXX) for convenience,
 * but allows any number (international, different lengths, etc.).
 * Accepts digits, +, spaces, and dashes.
 */
export function PhoneInput({
    value,
    onChange,
    className,
    error,
    ...rest
}: PhoneInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    function formatLocal(digits: string): string {
        // 10 digits starting with 07 -> format as 07X XXXX XXXX
        if (digits.length === 10 && digits.startsWith("07")) {
            return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
        }
        return digits;
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const raw = e.target.value;

        // Allow only digits, +, spaces, dashes
        const cleaned = raw.replace(/[^\d+\s\-]/g, "");

        // If starts with +, it's probably international, let the user type
        if (cleaned.startsWith("+")) {
            onChange(cleaned);
            return;
        }

        // Try smart formatting for local-looking numbers
        const digitsOnly = cleaned.replace(/\D/g, "");
        if (digitsOnly.length <= 10) {
            onChange(formatLocal(digitsOnly));
        } else {
            onChange(cleaned); // Allow longer numbers without forcing format
        }
    }

    return (
        <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                {...rest}
                ref={inputRef}
                type="tel"
                inputMode="tel"
                dir="ltr"
                placeholder="e.g. 07XXXXXXXX or +962..."
                value={value}
                onChange={handleChange}
                maxLength={20}
                className={cn(
                    "pl-10 h-12 bg-input border-border focus:ring-2 focus:ring-ring",
                    error && "border-destructive focus:ring-destructive",
                    className
                )}
            />
        </div>
    );
}
