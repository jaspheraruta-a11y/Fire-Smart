import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LiveMapComponent from '../../components/LiveMapComponent';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { subscribeToIncidents } from '../../services/supabase';
import { Incident, IncidentStatus } from '../../types';

const LiveMap: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const location = useLocation();
    const focusIncidentId = (location.state as { focusIncidentId?: string } | null)?.focusIncidentId ?? null;

    useEffect(() => {
        const unsubscribe = subscribeToIncidents(setIncidents);
        return () => unsubscribe();
    }, []);

    const statusStr = (s: unknown) => String(s ?? '').toLowerCase();
    const activeIncidents = incidents.filter(i => statusStr(i?.status) === 'active');
    const respondingIncidents = incidents.filter(i => statusStr(i?.status) === 'responding');
    const resolvedIncidents = incidents.filter(i => statusStr(i?.status) === 'resolved');

    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-4">Live Fire Map</h1>
            <div className="flex space-x-6 mb-4 text-white">
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-red-500 pinpoint-blinker-red"></div><span>Active ({activeIncidents.length})</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-yellow-500"></div><span>Responding ({respondingIncidents.length})</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-green-500"></div><span>Resolved ({resolvedIncidents.length})</span></div>
            </div>
            <div className="flex-grow min-h-[60vh] rounded-lg overflow-hidden border border-gray-700 bg-white" style={{ minHeight: '500px', height: '100%' }}>
                <ErrorBoundary>
                    <LiveMapComponent incidents={incidents} focusIncidentId={focusIncidentId} />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default LiveMap;
