export const setPasswordOptions = (options: string[]) => {
    localStorage.setItem('passwordOptions', JSON.stringify(options));
};

export const getPasswordOptions = (): string[] => {
    const savedOptions = localStorage.getItem('passwordOptions');
    return savedOptions ? JSON.parse(savedOptions) : [];
};

export const importOptionsFromFile = (file: File, callback: (options: string[]) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedOptions = JSON.parse(event.target?.result as string);
            if (Array.isArray(importedOptions)) {
                callback(importedOptions);
            } else {
                console.error('Invalid JSON format');
            }
        } catch (error) {
            console.error('Error parsing JSON', error);
        }
    };
    reader.readAsText(file);
};

export const exportOptionsToFile = (options: string[]) => {
    const dataStr = JSON.stringify(options, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'passwordOptions.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};