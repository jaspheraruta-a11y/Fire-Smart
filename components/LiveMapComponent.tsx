
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Incident, IncidentStatus } from '../types';
import { ReactDOMServer } from 'react-dom/server';
import { Flame, CheckCircle, Truck } from 'lucide-react';

interface LiveMapComponentProps {
    incidents: Incident[];
}

const createMarkerIcon = (status: IncidentStatus) => {
    let icon;
    let color;
    let animationClass = '';

    switch (status) {
        case IncidentStatus.ACTIVE:
            icon = <Flame className="h-6 w-6 text-white" />;
            color = '#E53935';
            animationClass = 'pulse-red-animation';
            break;
        case IncidentStatus.RESPONDING:
            icon = <Truck className="h-6 w-6 text-white" />;
            color = '#FDD835';
             animationClass = 'pulse-yellow-animation';
            break;
        case IncidentStatus.RESOLVED:
            icon = <CheckCircle className="h-6 w-6 text-white" />;
            color = '#43A047';
            break;
    }

    const iconHtml = ReactDOMServer.renderToString(
        <div className={`rounded-full p-2`} style={{ backgroundColor: color }}>
            {icon}
        </div>
    );

    return new L.DivIcon({
        html: `<div class="relative flex items-center justify-center"><div class="absolute ${animationClass} rounded-full" style="background-color: ${color}; width: 40px; height: 40px;"></div>${iconHtml}</div>`,
        className: 'bg-transparent border-0',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

const LiveMapComponent: React.FC<LiveMapComponentProps> = ({ incidents }) => {
    const position: [number, number] = [14.5995, 120.9842]; // Manila as default center

    return (
        <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%', backgroundColor: '#0F0F0F' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {incidents.map((incident) => (
                <Marker key={incident.id} position={[incident.location.lat, incident.location.lng]} icon={createMarkerIcon(incident.status)}>
                    <Popup>
                        <div className="bg-[#2A2A2A] text-white p-2 rounded-md border-none w-64">
                            <h3 className="font-bold text-lg mb-2">Incident: {incident.id}</h3>
                            <p><strong>Status:</strong> <span className="capitalize">{incident.status}</span></p>
                            <p><strong>Address:</strong> {incident.address}</p>
                            <p><strong>Detected:</strong> {new Date(incident.timestamp).toLocaleString()}</p>
                            <p><strong>Unit:</strong> {incident.assignedUnit || 'N/A'}</p>
                            <div className="mt-2 pt-2 border-t border-gray-600">
                                <p className="font-semibold">Sensor Data:</p>
                                <ul className="list-disc list-inside text-sm">
                                    <li>Temp: {incident.sensorData.temperature.toFixed(1)}°C</li>
                                    <li>Smoke: {incident.sensorData.smoke} PPM</li>
                                    <li>Gas: {incident.sensorData.gas} PPM</li>
                                </ul>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default LiveMapComponent;
