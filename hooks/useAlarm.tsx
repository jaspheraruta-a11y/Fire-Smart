import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AlarmContextType {
    isMuted: boolean;
    toggleMute: () => void;
}

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const AlarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);

    const toggleMute = () => {
        setIsMuted(prev => !prev);
    };

    return (
        <AlarmContext.Provider value={{ isMuted, toggleMute }}>
            {children}
        </AlarmContext.Provider>
    );
};

export const useAlarm = (): AlarmContextType => {
    const context = useContext(AlarmContext);
    if (context === undefined) {
        throw new Error('useAlarm must be used within an AlarmProvider');
    }
    return context;
};

