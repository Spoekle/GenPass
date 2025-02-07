import { useEffect, useState } from 'react';
import { getStandardOptions, getCustomOptions, generatePassword, generateAdvancedPassword } from '../../helper/Passwords/GeneratePass';
import Button from './components/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import CustomCheckbox from './components/CustomCheckbox';
import { useAlert, AlertProvider } from './components/AlertContext';

const Generator = () => {
    const savedOptions = JSON.parse(localStorage.getItem("genpassOptions") || '{}');
    const [password, setPassword] = useState('');
    const [numOptions, setNumOptions] = useState(savedOptions.numOptions ?? 2);
    const [passwordLength, setPasswordLength] = useState(savedOptions.passwordLength ?? 12);
    const [segmentCount, setSegmentCount] = useState(savedOptions.segmentCount ?? 3);
    const [useSegments, setUseSegments] = useState(savedOptions.useSegments ?? true);
    const [useCustomList, setUseCustomList] = useState(savedOptions.useCustomList ?? false);
    const [useDefaultList, setUseDefaultList] = useState(savedOptions.useDefaultList ?? true);
    const [replaceChars, setReplaceChars] = useState(savedOptions.replaceChars ?? true);
    const [isAdvanced, setIsAdvanced] = useState(savedOptions.isAdvanced ?? false);
    const [includeNumbers, setIncludeNumbers] = useState(savedOptions.includeNumbers ?? false);
    const [includeSymbols, setIncludeSymbols] = useState(savedOptions.includeSymbols ?? false);
    const [includeUppercase, setIncludeUppercase] = useState(savedOptions.includeUppercase ?? false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const { addAlert } = useAlert();

    useEffect(() => {
        const opts = { numOptions, passwordLength, segmentCount, useSegments, useCustomList, useDefaultList, replaceChars, isAdvanced, includeNumbers, includeSymbols, includeUppercase };
        localStorage.setItem("genpassOptions", JSON.stringify(opts));
    }, [numOptions, passwordLength, segmentCount, useSegments, useCustomList, useDefaultList, replaceChars, isAdvanced, includeNumbers, includeSymbols, includeUppercase]);

    useEffect(() => {
        generatePassword(getStandardOptions(), 2, false);
    }, []);

    const handleGeneratePassword = () => {
        let pass;
        if (isAdvanced) {
            pass = generateAdvancedPassword(useSegments, segmentCount, passwordLength, includeNumbers, includeSymbols, includeUppercase);
        } else {
            let selectedOptions: string[] = [];
            if (useDefaultList) {
                selectedOptions = [...selectedOptions, ...getStandardOptions()];
            }
            if (useCustomList) {
                selectedOptions = [...selectedOptions, ...getCustomOptions()];
            }
            pass = generatePassword(selectedOptions, numOptions, replaceChars);
        }

        setPassword(pass);
        setPasswordStrength(calculatePasswordStrength(pass));
        addAlert('Password generated successfully', 'success');
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        const lengthCriteria = password.length >= 12;
        const uppercaseCriteria = /[A-Z]/.test(password);
        const lowercaseCriteria = /[a-z]/.test(password);
        const numberCriteria = /[0-9]/.test(password);
        const symbolCriteria = /[^A-Za-z0-9]/.test(password);
        const uniqueCharCriteria = new Set(password).size >= password.length * 0.7;

        if (lengthCriteria) strength += 1;
        if (uppercaseCriteria) strength += 1;
        if (lowercaseCriteria) strength += 1;
        if (numberCriteria) strength += 1;
        if (symbolCriteria) strength += 1;
        if (uniqueCharCriteria) strength += 1;

        switch (strength) {
            case 0:
            case 1:
            case 2:
                return 'Very Weak';
            case 3:
                return 'Weak';
            case 4:
                return 'Moderate';
            case 5:
                return 'Strong';
            case 6:
                return 'Very Strong';
            default:
                return '';
        }
    };

    const handleCopyPassword = () => {
        if (password) {
            navigator.clipboard.writeText(password).then(() => {
                addAlert('Password copied to clipboard!', 'success');
            }).catch(err => {
                console.error('Failed to copy password: ', err);
                addAlert('Failed to copy password', 'error');
            });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 text-white">
            <h1 className="text-4xl font-bold mb-6">Password Generator</h1>
            {isAdvanced ? (
                <Button onClick={() => setIsAdvanced(false)} className="mb-4 border-indigo-500 bg-indigo-500/10">
                    Back to Simple Mode
                </Button>
            ) : (
                <Button onClick={() => setIsAdvanced(true)} className="mb-4 border-indigo-500 bg-indigo-500/10">
                    Advanced Mode
                </Button>
            )}
            {isAdvanced ? (
                <div>
                    <div className="mb-4">
                        <CustomCheckbox checked={useSegments} onChange={() => setUseSegments(!useSegments)} label="Use Segments" />
                        {useSegments ? (
                            <>
                                <Typography id="segmentCount" gutterBottom>
                                    Amount of segments: {segmentCount}
                                </Typography>
                                <Slider
                                    value={segmentCount}
                                    onChange={(_e, value) => setSegmentCount(value as number)}
                                    aria-labelledby="segmentCount"
                                    min={2}
                                    max={6}
                                    valueLabelDisplay="auto"
                                    sx={{ color: 'white' }}
                                />
                            </>
                        ) : (
                            <>
                                <Typography id="passwordLength" gutterBottom>
                                    Password Length: {passwordLength}
                                </Typography>
                                <Slider
                                    value={passwordLength}
                                    onChange={(_e, value) => setPasswordLength(value as number)}
                                    aria-labelledby="passwordLength"
                                    min={8}
                                    max={32}
                                    valueLabelDisplay="auto"
                                    sx={{ color: 'white' }}
                                />
                            </>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <CustomCheckbox checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} label="Include Numbers" />
                        <CustomCheckbox checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} label="Include Symbols" />
                        <CustomCheckbox checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} label="Include Uppercase Letters" />
                    </div>
                    <Button onClick={handleGeneratePassword} className="mb-4 border-green-500 bg-green-500/10">
                        Generate Password
                    </Button>
                </div>
            ) : (
                <div>
                    <div className="mb-4">
                        <Typography id="numOptions" gutterBottom>
                            Number of words : {numOptions}
                        </Typography>
                        <Slider
                            value={numOptions}
                            onChange={(_e, value) => setNumOptions(value as number)}
                            aria-labelledby="numOptions"
                            min={1}
                            max={5}
                            valueLabelDisplay="auto"
                            sx={{ color: 'white' }}
                        />
                        <span className="ml-2 text-center"></span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <CustomCheckbox checked={useDefaultList} onChange={() => setUseDefaultList(!useDefaultList)} label="Use Default Words" />
                        <CustomCheckbox checked={useCustomList} onChange={() => setUseCustomList(!useCustomList)} label="Use Custom Words" />
                        <CustomCheckbox checked={replaceChars} onChange={() => setReplaceChars(!replaceChars)} label="Use Special Characters" />
                    </div>
                    <Button onClick={handleGeneratePassword} className="mb-4 border-green-500 bg-green-500/10">
                        Generate Password
                    </Button>
                </div>
            )}
            {password && (
                <>
                    <h2 className="text-xl font-bold">Generated Password:</h2>
                    <div className='flex space-x-4 mt-4'>
                        <div className="bg-indigo-500/20 border-dashed text-center min-w-64 border-white border-2 text-white font-bold py-3 px-6 rounded-lg">
                            {password}
                        </div>
                        <Button onClick={handleCopyPassword} className='bg-green-500/10 border-green-500 animate-pulse'>
                            Copy Password
                        </Button>
                    </div>
                    <div className={`mt-2 text-lg font-bold ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Moderate' ? 'text-yellow-500' : 'text-green-500'}`}>
                        Strength: {passwordStrength}
                    </div>
                </>
            )}
        </div>
    );
};

const App = () => (
    <AlertProvider>
        <Generator />
    </AlertProvider>
);

export default App;