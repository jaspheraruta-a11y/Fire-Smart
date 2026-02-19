
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings: React.FC = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <div className="p-10 bg-[#2A2A2A] rounded-lg border border-gray-700 text-center">
                <SettingsIcon className="h-16 w-16 mx-auto text-gray-500 mb-4 animate-spin" />
                <h2 className="text-xl font-semibold text-white">Settings Page Coming Soon</h2>
                <p className="text-gray-400 mt-2">Manage user profiles, notification preferences, and system configurations here.</p>
            </div>
        </div>
    );
};

export default Settings;
