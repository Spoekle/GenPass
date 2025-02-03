import { useState } from 'react';
import { getStandardOptions, getCustomOptions, generatePassword, generateAdvancedPassword } from '../../helper/Passwords/GeneratePass';
import Button from './components/Button';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import CustomCheckbox from './components/CustomCheckbox';
import { useAlert, AlertProvider } from './components/AlertContext';

const Generator = () => {
    const [password, setPassword] = useState('');
    const [numOptions, setNumOptions] = useState(1);
    const [passwordLength, setPasswordLength] = useState(12);
    const [useCustomList, setUseCustomList] = useState(false);
    const [useDefaultList, setUseDefaultList] = useState(true);
    const [replaceChars, setReplaceChars] = useState(false);
    const [complexMode, setComplexMode] = useState(false);
    const [isAdvanced, setIsAdvanced] = useState(false);
    const [includeNumbers, setIncludeNumbers] = useState(false);
    const [includeSymbols, setIncludeSymbols] = useState(false);
    const [includeUppercase, setIncludeUppercase] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');
    const { addAlert } = useAlert();

    const handleGeneratePassword = () => {
        let pass;
        if (isAdvanced) {
            pass = generateAdvancedPassword(passwordLength);
        } else {
            let selectedOptions: string[] = [];
            if (useDefaultList) {
                selectedOptions = [...selectedOptions, ...getStandardOptions()];
            }
            if (useCustomList) {
                selectedOptions = [...selectedOptions, ...getCustomOptions()];
            }
            if (replaceChars) {
                selectedOptions = selectedOptions.map(option =>
                    option.replace(/o/g, '0').replace(/a/g, '@').replace(/e/g, '3')
                );
            }
            if (includeNumbers) {
                selectedOptions.push('0123456789');
            }
            if (includeSymbols) {
                selectedOptions.push('!@#$%^&*()');
            }
            if (includeUppercase) {
                selectedOptions = selectedOptions.map(option => option + option.toUpperCase());
            }
            pass = generatePassword(selectedOptions, numOptions, complexMode, passwordLength);
        }

        setPassword(pass);
        setPasswordStrength(calculatePasswordStrength(pass));
        addAlert('Password generated successfully', 'success');
    };

    const calculatePasswordStrength = (password: string) => {
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        switch (strength) {
            case 0:
            case 1:
                return 'Weak';
            case 2:
                return 'Moderate';
            case 3:
            case 4:
                return 'Strong';
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
                <Button onClick={() => setIsAdvanced(false)} className="mb-4">
                Back to Simple Mode
            </Button>
            ) : (
                <Button onClick={() => setIsAdvanced(true)} className="mb-4">
                    Advanced Mode
                </Button>
            )}
            {isAdvanced ? (
                <div>
                    <div className="mb-4">
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
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <CustomCheckbox checked={complexMode} onChange={() => setComplexMode(!complexMode)} label="Complex Mode" />
                        <CustomCheckbox checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} label="Include Numbers" />
                        <CustomCheckbox checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} label="Include Symbols" />
                        <CustomCheckbox checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} label="Include Uppercase Letters" />
                    </div>
                    <Button onClick={handleGeneratePassword} className="mb-4">
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
                    <Button onClick={handleGeneratePassword} className="mb-4">
                        Generate Password
                    </Button>

                </div>
            )}
            {password && (
                <div className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg mt-4">
                    {password}
                </div>
            )}
            {password && (
                <div className={`mt-2 text-lg font-bold ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Moderate' ? 'text-yellow-500' : 'text-green-500'}`}>
                    Strength: {passwordStrength}
                </div>
            )}
            {password && (
                <div className="flex space-x-4 mt-4">
                    <Button onClick={handleCopyPassword}>
                        Copy Password
                    </Button>
                </div>
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