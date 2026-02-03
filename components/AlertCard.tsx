
import React from 'react';
import { Incident, IncidentStatus } from '../types';
import { MapPin, Thermometer, Wind, Zap } from 'lucide-react';

interface AlertCardProps {
    incident: Incident;
}

const statusStyles = {
    [IncidentStatus.ACTIVE]: {
        borderColor: 'border-red-500',
        glowClass: 'glow-red',
        bgColor: 'bg-red-900/30'
    },
    [IncidentStatus.RESPONDING]: {
        borderColor: 'border-yellow-500',
        glowClass: 'glow-yellow',
        bgColor: 'bg-yellow-900/30'
    },
    [IncidentStatus.RESOLVED]: {
        borderColor: 'border-green-500',
        glowClass: '',
        bgColor: 'bg-green-900/30'
    }
};

const AlertCard: React.FC<AlertCardProps> = ({ incident }) => {
    const styles = statusStyles[incident.status];

    return (
        <div className={`rounded-xl border ${styles.borderColor} ${styles.bgColor} overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-2xl`}>
             <div className={`p-4 border-b ${styles.borderColor}`}>
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white">INCIDENT #{incident.id.slice(-6)}</h3>
                     <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles.bgColor} border ${styles.borderColor} capitalize`}>
                        {incident.status}
                    </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">{new Date(incident.timestamp).toLocaleString()}</p>
             </div>
             <div className="p-4 space-y-4">
                <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 mt-1 text-gray-400" />
                    <p className="text-gray-200">{incident.address}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <SensorReading icon={<Thermometer className="h-5 w-5 mx-auto text-red-400" />} label="Temp" value={`${incident.sensorData.temperature.toFixed(0)}°C`} />
                    <SensorReading icon={<Wind className="h-5 w-5 mx-auto text-yellow-400" />} label="Smoke" value={`${incident.sensorData.smoke} PPM`} />
                    <SensorReading icon={<Zap className="h-5 w-5 mx-auto text-orange-400" />} label="Gas" value={`${incident.sensorData.gas} PPM`} />
                </div>
             </div>
             <div className={`p-4 bg-black/20 flex space-x-2`}>
                <button className="flex-1 bg-[#E53935] text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm">Dispatch Unit</button>
                <button className="flex-1 bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors text-sm">Responding</button>
                <button className="flex-1 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm">Resolved</button>
             </div>
        </div>
    );
};

interface SensorReadingProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

const SensorReading: React.FC<SensorReadingProps> = ({ icon, label, value }) => (
    <div className="bg-black/30 p-2 rounded-md">
        {icon}
        <p className="text-xs text-gray-400 mt-1">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
    </div>
);

export default AlertCard;
