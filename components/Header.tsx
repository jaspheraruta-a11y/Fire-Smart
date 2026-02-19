
import React, { useState, useEffect } from 'react';
import { Bell, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { subscribeToIncidents } from '../services/supabase';
import { Incident, IncidentStatus } from '../types';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeAlerts, setActiveAlerts] = useState(0);

    useEffect(() => {
        const unsubscribe = subscribeToIncidents((incidents: Incident[]) => {
            const active = incidents.filter(i => i.status === IncidentStatus.ACTIVE).length;
            setActiveAlerts(active);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    
    return (
        <header className="bg-[#2A2A2A] p-4 flex justify-between items-center border-b border-gray-700">
            <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 pulse-green-animation"></div>
                    <span className="text-sm font-medium text-emerald-300">SYSTEM ONLINE</span>
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <div className="relative">
                    <Bell className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer" />
                    {activeAlerts > 0 && (
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#E53935] text-xs font-bold text-white pulse-red-animation">
                            {activeAlerts}
                        </span>
                    )}
                </div>
                <div className="text-right">
                    <p className="font-semibold text-white text-sm">{user?.fullName}</p>
                    <p className="text-xs text-gray-400 capitalize">{user?.role.replace('_', ' ')}</p>
                </div>
                <button 
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-[#3A3A3A] transition-colors"
                    title="Logout"
                >
                    <LogOut className="h-5 w-5 text-gray-300" />
                </button>
            </div>
        </header>
    );
};

export default Header;
