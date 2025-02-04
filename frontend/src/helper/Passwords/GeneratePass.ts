export const standardOptions = [
    'dog',
    'lizard',
    'turtle',
    'dragon',
    'watermelon',
    'horse',
    'cat',
    'elephant',
    'tiger',
    'giraffe'
];

export const getCustomOptions = (): string[] => {
    const savedOptions = localStorage.getItem('passwordOptions');
    return savedOptions ? JSON.parse(savedOptions) : [];
};

export const getStandardOptions = (): string[] => {
    return standardOptions;
};

export const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const charReplacementMap: { [key: string]: string } = {
    'e': '3',
    'a': '@',
    's': '$',
    'o': '0',
    'i': '!',
};

const replaceCharacters = (str: string): string => {
    return str.split('').map(char => {
        if (charReplacementMap[char.toLowerCase()] && Math.random() < 0.5) {
            return charReplacementMap[char.toLowerCase()];
        }
        return char;
    }).join('');
};

export const generatePassword = (
    options: string[],
    numOptions: number,
    replaceChars: boolean
): string => {
    if (options.length === 0) return '';

    const shuffledOptions = shuffleArray([...options]);
    let password = shuffledOptions.slice(0, numOptions).map((option, index) => {
        if (index === 0) {
            return option;
        } else {
            return option.charAt(0).toUpperCase() + option.slice(1);
        }
    }).join('');

    if (replaceChars) {
        password = replaceCharacters(password);
    }

    return password;
};

export const generateAdvancedPassword = (
    useSegments: boolean,
    segmentCount: number,
    passwordLength: number,
    includeNumbers: boolean,
    includeSymbols: boolean,
    includeUppercase: boolean
): string => {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()';

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

    const generateSegment = () => {
        let segment = '';
        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characterSet.length);
            segment += characterSet[randomIndex];
        }
        return segment;
    };

    if (useSegments) {
        const segments = [];
        for (let i = 0; i < segmentCount; i++) {
            segments.push(generateSegment());
        }
        return segments.join('-');
    } else {
        let password = '';
        for (let i = 0; i < passwordLength; i++) {
            const randomIndex = Math.floor(Math.random() * characterSet.length);
            password += characterSet[randomIndex];
        }
        return password;
    }
};