
import React, { useState, useEffect, useMemo } from 'react';
import AlertCard from '../../components/AlertCard';
import { subscribeToIncidents } from '../../services/supabase';
import { Incident, IncidentStatus } from '../../types';

const Alerts: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        const unsubscribe = subscribeToIncidents(setIncidents);
        return () => unsubscribe();
    }, []);

    const activeAndRespondingIncidents = useMemo(() => {
        return incidents
            .filter(inc => inc.status === IncidentStatus.ACTIVE || inc.status === IncidentStatus.RESPONDING)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [incidents]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Live Alerts</h1>
            {activeAndRespondingIncidents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeAndRespondingIncidents.map(incident => (
                        <AlertCard key={incident.id} incident={incident} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-[#2A2A2A] rounded-lg border border-gray-700">
                    <p className="text-gray-400 text-lg">No active alerts at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default Alerts;
