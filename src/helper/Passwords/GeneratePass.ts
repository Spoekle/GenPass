import { standardOptions } from './options/StandardOptions';
import type { Option } from '@/types';
import { safeLocalStorage } from '@/utils/storage';

export type { Option };

// =============================================================================
// CRYPTOGRAPHICALLY SECURE RANDOM NUMBER GENERATION
// Uses Web Crypto API (crypto.getRandomValues) for true randomness
// =============================================================================

/**
 * Generate a cryptographically secure random integer in range [min, max] (inclusive)
 * Uses rejection sampling to avoid modulo bias
 */
const secureRandomInt = (min: number, max: number): number => {
    const range = max - min + 1;

    // Calculate the number of random bytes needed
    const bytesNeeded = Math.ceil(Math.log2(range) / 8) || 1;
    const cutoff = Math.floor((256 ** bytesNeeded) / range) * range;

    const randomBuffer = new Uint8Array(bytesNeeded);
    let randomValue: number;

    // Use rejection sampling to avoid modulo bias
    do {
        crypto.getRandomValues(randomBuffer);
        randomValue = randomBuffer.reduce((acc, byte, i) => acc + byte * (256 ** i), 0);
    } while (randomValue >= cutoff);

    return min + (randomValue % range);
};

// =============================================================================
// PASSWORD GENERATION UTILITIES
// =============================================================================

export const getStandardOptions = (): Option[] => {
    return standardOptions;
};

export const getCustomOptions = (): Option[] => {
    return safeLocalStorage.getJSON<Option[]>('passwordOptions', []);
};

/**
 * Cryptographically secure array shuffle using Fisher-Yates algorithm
 */
export const shuffleArray = <T,>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = secureRandomInt(0, i);
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

// Character replacement map for password enhancement
const charReplacementMap: { [key: string]: string } = {
    'E': '3',
    'a': '@',
    'S': '$',
    'o': '0',
    'i': '!',
    'B': '8',
    'l': '1',
    't': '+',
    's': '$',
    'A': '4',
    'O': '0'
};

/**
 * Replace characters with special symbols based on replacement map
 * Uses secure random to determine which characters to replace
 */
const replaceCharacters = (str: string): string => {
    return str
        .split('')
        .map(char => {
            if (charReplacementMap[char] && secureRandomInt(1, 10) <= 3) {
                return charReplacementMap[char];
            }
            return char;
        })
        .join('');
};

// =============================================================================
// ENTROPY CALCULATION
// =============================================================================

/**
 * Calculate password entropy in bits
 */
export const calculatePasswordEntropy = (password: string): number => {
    const charSetSize = new Set(password.split('')).size;
    return Math.log2(Math.pow(charSetSize, password.length));
};

/**
 * Get password strength label based on entropy
 */
export const getPasswordStrength = (entropy: number): string => {
    if (entropy < 28) return 'Very Weak';
    if (entropy < 36) return 'Weak';
    if (entropy < 60) return 'Moderate';
    if (entropy < 80) return 'Strong';
    return 'Very Strong';
};

// =============================================================================
// PASSWORD GENERATION FUNCTIONS
// =============================================================================

/**
 * Generate word-based memorable passwords
 * Uses cryptographically secure random selection with weighted options
 */
export const generatePassword = (
    options: Option[],
    numOptions: number,
    replaceChars: boolean,
    amount: number = 1
): string => {
    // Validate and sanitize inputs
    const validatedNumOptions = Math.max(1, Math.min(Math.floor(numOptions), 10));
    const validatedAmount = Math.max(1, Math.min(Math.floor(amount), 100));

    const results: string[] = [];

    for (let a = 0; a < validatedAmount; a++) {
        if (options.length === 0) {
            results.push('');
        } else {
            // Create a copy for weighted selection without replacement
            const availableOptions = [...options];
            const selectedParts: string[] = [];

            for (let i = 0; i < validatedNumOptions && availableOptions.length > 0; i++) {
                const totalWeight = availableOptions.reduce((sum, opt) => sum + opt.weight, 0);
                const threshold = secureRandomInt(0, totalWeight - 1);

                let runningSum = 0;
                let selectedIndex = 0;
                for (let j = 0; j < availableOptions.length; j++) {
                    runningSum += availableOptions[j].weight;
                    if (runningSum > threshold) {
                        selectedIndex = j;
                        break;
                    }
                }

                const { option } = availableOptions.splice(selectedIndex, 1)[0];
                if (i === 0) {
                    selectedParts.push(option);
                } else {
                    selectedParts.push(option.charAt(0).toUpperCase() + option.slice(1));
                }
            }

            let password = selectedParts.join('');

            // Apply character replacements for added security
            if (replaceChars) {
                password = replaceCharacters(password);
            }

            // Add random numbers for additional entropy
            const randomNumbers = secureRandomInt(10, 99);
            password += randomNumbers.toString();

            results.push(password);
        }
    }

    return results.join("\n");
};

/**
 * Generate random character-based passwords
 * Uses cryptographically secure random character selection
 */
export const generateAdvancedPassword = (
    useSegments: boolean,
    segmentCount: number,
    passwordLength: number,
    includeNumbers: boolean,
    includeSymbols: boolean,
    includeUppercase: boolean,
    amount: number = 1
): string => {
    // Validate and sanitize inputs
    const validatedSegmentCount = Math.max(1, Math.min(Math.floor(segmentCount), 10));
    const validatedPasswordLength = Math.max(8, Math.min(Math.floor(passwordLength), 128));
    const validatedAmount = Math.max(1, Math.min(Math.floor(amount), 100));

    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    // Build character set based on options
    let characterSet = characters;

    if (includeNumbers) {
        characterSet += numbers;
    }
    if (includeSymbols) {
        characterSet += symbols;
    }
    if (includeUppercase) {
        characterSet += characters.toUpperCase();
    }

    // Fallback to lowercase if nothing selected
    if (characterSet.length === 0) {
        characterSet = characters;
    }

    const generateSegment = () => {
        let segment = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = secureRandomInt(0, characterSet.length - 1);
            segment += characterSet[randomIndex];
        }
        return segment;
    };

    const results: string[] = [];

    for (let a = 0; a < validatedAmount; a++) {
        if (useSegments) {
            const segments: string[] = [];
            for (let i = 0; i < validatedSegmentCount; i++) {
                segments.push(generateSegment());
            }
            results.push(segments.join('-'));
        } else {
            let password = '';
            for (let i = 0; i < validatedPasswordLength; i++) {
                const randomIndex = secureRandomInt(0, characterSet.length - 1);
                password += characterSet[randomIndex];
            }
            results.push(password);
        }
    }

    return results.join("\n");
};
