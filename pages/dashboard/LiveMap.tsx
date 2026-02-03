
import React, { useEffect, useState } from 'react';
import LiveMapComponent from '../../components/LiveMapComponent';
import { subscribeToIncidents } from '../../services/supabase';
import { Incident, IncidentStatus } from '../../types';

const LiveMap: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        const unsubscribe = subscribeToIncidents(setIncidents);
        return () => unsubscribe();
    }, []);

    const activeIncidents = incidents.filter(i => i.status === IncidentStatus.ACTIVE);
    const respondingIncidents = incidents.filter(i => i.status === IncidentStatus.RESPONDING);
    const resolvedIncidents = incidents.filter(i => i.status === IncidentStatus.RESOLVED);


    return (
        <div className="h-full flex flex-col">
            <h1 className="text-3xl font-bold text-white mb-4">Live Fire Map</h1>
            <div className="flex space-x-6 mb-4">
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-red-500"></div><span>Active ({activeIncidents.length})</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-yellow-500"></div><span>Responding ({respondingIncidents.length})</span></div>
                <div className="flex items-center space-x-2"><div className="w-4 h-4 rounded-full bg-green-500"></div><span>Resolved ({resolvedIncidents.length})</span></div>
            </div>
            <div className="flex-grow rounded-lg overflow-hidden border border-gray-700">
                <LiveMapComponent incidents={incidents} />
            </div>
        </div>
    );
};

export default LiveMap;
