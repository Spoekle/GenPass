import React, { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Button from './Button';
import './MobileWordList.css';

interface MobileWordListProps {
    options: string[];
    removeOption: (index: number) => void;
}

const MobileWordList: React.FC<MobileWordListProps> = ({ options, removeOption }) => {
    const [isListOpen, setIsListOpen] = useState(false);
    const [bottomPosition, setBottomPosition] = useState('-bottom-8');

    const toggleList = () => {
        setIsListOpen(!isListOpen);
    };

    useEffect(() => {
        setBottomPosition(isListOpen ? 'bottom-0' : '-bottom-8');
    }, [isListOpen]);

    return (
        <div className={`fixed z-20 ${bottomPosition} w-full block md:hidden transition-all duration-300`}>
            {isListOpen ? (
                <Button onClick={() => toggleList()} className="w-full flex items-center text-center justify-center rounded-t-lg rounded-b-none backdrop-blur-sm"><FaArrowDown /> Hide List <FaArrowDown /></Button>
            ) : (
                <Button onClick={() => toggleList()} className="w-full flex items-center text-center justify-center rounded-t-lg rounded-b-none backdrop-blur-sm"><FaArrowUp /> Word List <FaArrowUp /></Button>
            )}
            <div className={`relative flex flex-col w-full bg-neutral-900/70 backdrop-blur-sm rounded-lg p-4 overflow-hidden slide-up ${isListOpen ? 'open' : ''}`}>
                <div className='absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-neutral-900 to-transparent z-30'></div>
                <h1 className="text-2xl font-bold mb-8 z-20">Current Words ({options.length}):</h1>
                <ul className="relative z-20 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full rounded-lg overflow-y-scroll max-h-[50vh]">
                    {options.length === 0 ? (
                        <li className="text-center text-gray-500 border-2 border-dashed border-gray-500 p-4 bg-neutral-800/50 rounded-lg">No words added yet. Add some words to get started!</li>
                    ) : (
                        <>
                            {options.map((option, index) => (
                                <li key={index} className="flex w-full items-center border-1 border-gray-500 justify-between p-2 bg-neutral-800 rounded-lg">
                                    {option}
                                    <Button onClick={() => removeOption(index)} className="ml-4">Remove</Button>
                                </li>
                            ))}
                        </>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default MobileWordList;