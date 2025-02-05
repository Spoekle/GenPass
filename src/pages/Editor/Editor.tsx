import { useState, useEffect } from 'react';
import { setPasswordOptions, getPasswordOptions, importOptionsFromFile, exportOptionsToFile } from '../../helper/Passwords/Editor';
import Button from './components/Button';
import { useAlert, AlertProvider } from './components/AlertContext';
import MobileWordList from './components/MobileWordList';

const Editor = () => {
    const [options, setOptions] = useState<string[]>([]);
    const [newOption, setNewOption] = useState('');
    const { addAlert } = useAlert();

    useEffect(() => {
        setOptions(getPasswordOptions());
    }, []);

    const addOption = () => {
        if (newOption.trim() === '') {
            addAlert('Words gotta have letters dummy :D', 'error');
            return;
        }
        const updatedOptions = [...options, newOption.trim().toLowerCase()];
        setOptions(updatedOptions);
        setPasswordOptions(updatedOptions);
        setNewOption('');
    };

    const removeOption = (index: number) => {
        const updatedOptions = options.filter((_, i) => i !== index);
        setOptions(updatedOptions);
        setPasswordOptions(updatedOptions);
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            importOptionsFromFile(file, (importedOptions) => {
                const updatedOptions = [...options, ...importedOptions];
                setOptions(updatedOptions);
                setPasswordOptions(updatedOptions);
            });
            addAlert('Options imported successfully', 'success');
        }
    };

    const handleExport = () => {
        if (options.length === 0) {
            addAlert('No options to export', 'error');
            return;
        }
        exportOptionsToFile(options);
    };

    const clearOptions = () => {
        if (options.length === 0) {
            addAlert('Nothing to clear :)', 'error');
            return;
        }
        setOptions([]);
        setPasswordOptions([]);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center h-screen bg-neutral-900 text-white">
            <div className="flex flex-col items-center">
                <h1 className="text-4xl font-bold mb-6 text-center">Password Config Editor</h1>
                <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addOption()}
                    placeholder="Add new word"
                    className="mb-4 p-2 rounded bg-neutral-800 text-white"
                />
                <Button onClick={addOption} className="mb-4">Add Word</Button>
                <p className="mb-4">or</p>
                <div
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="mb-4 p-4 py-8 border-2 border-dashed border-gray-500 rounded text-center"
                >
                    Drop JSON file here to import your word list <br />or
                    <br />
                    <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        id="fileInput"
                        onChange={(e) => {
                            if (e.target.files) {
                                importOptionsFromFile(e.target.files[0], (importedOptions) => {
                                    const updatedOptions = [...options, ...importedOptions];
                                    setOptions(updatedOptions);
                                    setPasswordOptions(updatedOptions);
                                    addAlert('Options imported successfully', 'success');
                                });
                            }
                        }}
                    />
                    <label htmlFor="fileInput" className="cursor-pointer block text-indigo-500 hover:text-indigo-400 transition duration-200">
                        select a file
                    </label>
                </div>
                <Button onClick={handleExport} className="mb-4">Export Words</Button>
                {options.length > 0 && <Button onClick={clearOptions} className="mb-4 bg-red-500/10 border-red-500">Clear Words</Button>}
            </div>
            <div className="hidden md:block w-full max-w-md mx-8">
                <h2 className="text-xl font-bold mb-4">Current words ({options.length}):</h2>
                <ul className="hidden md:block w-full max-w-md overflow-y-auto max-h-[80vh]">
                    {options.length === 0 ? (
                        <li className="text-center text-gray-500 border-2 border-dashed border-gray-500 p-4 bg-neutral-800/50 rounded-lg">No words added yet. Add some words to get started!</li>
                    ) : (
                        <>

                            {options.map((option, index) => (
                                <li key={index} className="flex items-center justify-between mb-2 p-2 bg-neutral-800 rounded-lg">
                                    {option}
                                    <Button onClick={() => removeOption(index)} className="ml-4">Remove</Button>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </div>
            <MobileWordList
                options={options}
                removeOption={removeOption}
            />
        </div>
    );
};

const App = () => (
    <AlertProvider>
        <Editor />
    </AlertProvider>
);

export default App;