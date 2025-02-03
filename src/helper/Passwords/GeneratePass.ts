import bcrypt from 'bcryptjs';

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
    'girrafe'
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

export const generatePassword = (options: string[], numOptions: number, complexMode: boolean, passwordLength: number): string => {
    if (options.length === 0) return '';

    const shuffledOptions = shuffleArray([...options]);
    let password = shuffledOptions.slice(0, numOptions).map((option, index) => {
        if (index === 0) {
            return option;
        } else {
            return option.charAt(0).toUpperCase() + option.slice(1);
        }
    }).join('');

    if (complexMode) {
        const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
        const randomSpecialChar = specialChars[Math.floor(Math.random() * specialChars.length)];
        const randomIndex = Math.floor(Math.random() * password.length);
        password = password.slice(0, randomIndex) + randomSpecialChar + password.slice(randomIndex);
    }

    return password.slice(0, passwordLength);
};

export const generateAdvancedPassword = (passwordLength: number): string => {
    const segments = [];
    for (let i = 0; i < 3; i++) {
        const segment = bcrypt.genSaltSync(5).replace(/[^a-zA-Z0-9]/g, '').slice(0, 5);
        segments.push(segment);
    }
    return segments.join('-').slice(0, passwordLength);
};