import { Volume2, VolumeX } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AlertCard from '../../components/AlertCard';
import { resolveIncident, respondToIncident, subscribeToIncidents } from '../../services/supabase';
import { Incident, IncidentStatus } from '../../types';
import { useAlarm } from '../../hooks/useAlarm';

const Alerts: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
    const { isMuted, toggleMute } = useAlarm();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = subscribeToIncidents(setIncidents);
        return () => {
            unsubscribe();
        };
    }, []);

    // Show active and responding incidents, most recent first
    const activeIncidents = useMemo(() => {
        return [...incidents]
            .filter(incident =>
                incident.status === IncidentStatus.ACTIVE ||
                incident.status === IncidentStatus.RESPONDING ||
                (typeof incident.status === 'string' &&
                    (incident.status.toLowerCase() === 'active' ||
                     incident.status.toLowerCase() === 'responding'))
            )
            .sort(
                (a, b) =>
                    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
    }, [incidents]);

    const handleDispatch = async (incidentId: string) => {
        try {
            // Optimistically update local state so UI and alarm react instantly
            setIncidents(prev =>
                prev.map(incident =>
                    incident.id === incidentId
                        ? { ...incident, status: IncidentStatus.RESPONDING }
                        : incident
                )
            );

            // Persist status change in Supabase
            await respondToIncident(incidentId);
        } catch (error) {
            console.error('Failed to mark incident as responding:', error);
        }
    };

    const handleResolve = async (incidentId: string) => {
        try {
            setIsUpdatingId(incidentId);
            await resolveIncident(incidentId);
        } catch (error) {
            console.error('Failed to mark incident as resolved:', error);
        } finally {
            setIsUpdatingId(null);
        }
    };

    const handleViewOnMap = (incident: Incident) => {
        navigate('/dashboard/map', { state: { focusIncidentId: incident.id } });
    };

    const handleToggleMute = () => {
        toggleMute();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Live Alerts</h1>
                    <p className="text-gray-400 text-sm">
                        Active alerts: <span className="font-bold text-white">{activeIncidents.length}</span>
                        {activeIncidents.length > 0 && (
                            <span className="ml-2 text-red-400 animate-pulse">⚠️ ALERT ACTIVE</span>
                        )}
                    </p>
                </div>
                <button
                    onClick={handleToggleMute}
                    className={`p-3 rounded-lg transition-colors ${
                        isMuted
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                    title={isMuted ? 'Unmute Alarm' : 'Mute Alarm'}
                >
                    {isMuted ? (
                        <VolumeX className="h-6 w-6" />
                    ) : (
                        <Volume2 className="h-6 w-6" />
                    )}
                </button>
            </div>
            {activeIncidents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeIncidents.map(incident => (
                        <AlertCard
                            key={incident.id}
                            incident={incident}
                            onResolve={handleResolve}
                            onDispatch={handleDispatch}
                            onViewOnMap={handleViewOnMap}
                            isResolving={isUpdatingId === incident.id}
                        />
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
