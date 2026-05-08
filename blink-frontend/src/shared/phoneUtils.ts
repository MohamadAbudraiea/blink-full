/**
 * Generic phone number utilities
 */

/** Loose regex for any phone number (optional +, digits, spaces, dashes) */
export const PHONE_REGEX = /^[+]?[\d\s\-]{7,15}$/;

/**
 * Validates if the input looks like any valid phone number.
 * Minimum 7 digits for international/local standards.
 */
export function isValidPhone(value: string): boolean {
    if (!value) return false;
    const digits = value.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 15;
}

/**
 * Provides smart formatting for Jordanian numbers if they match the 10-digit 07 pattern,
 * otherwise returns digits as-is.
 */
export function formatPhone(value: string): string {
    const cleaned = value.replace(/[^\d+]/g, "");

    if (cleaned.startsWith("+")) return cleaned;

    const digits = cleaned.replace(/\D/g, "");

    // Smart format for Jordan local numbers
    if (digits.length === 10 && digits.startsWith("07")) {
        return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
    }

    return cleaned;
}
