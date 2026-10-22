import type { Option } from '@/types';
import { safeLocalStorage } from '@/utils/storage';

const STORAGE_KEY = 'passwordOptions';

export const setPasswordOptions = (options: Option[]): void => {
  safeLocalStorage.setJSON(STORAGE_KEY, options);
};

export const getPasswordOptions = (): Option[] => {
  return safeLocalStorage.getJSON<Option[]>(STORAGE_KEY, []);
};

export const importOptionsFromFile = (file: File, callback: (options: Option[]) => void): void => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedOptions = JSON.parse(event.target?.result as string);
      if (Array.isArray(importedOptions)) {
        callback(importedOptions);
      } else {
        console.error('Invalid JSON format: expected an array');
      }
    } catch (error) {
      console.error('Error parsing JSON', error);
    }
  };
  reader.readAsText(file);
};

export const exportOptionsToFile = (options: Option[]): void => {
  const dataStr = JSON.stringify(options, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'passwordOptions.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
