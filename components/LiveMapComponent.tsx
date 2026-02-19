import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Incident, IncidentStatus } from '../types';

// Valencia City, Bukidnon, Philippines - center so whole city is visible
const VALENCIA_CITY_CENTER: [number, number] = [7.9064, 125.0942];
const VALENCIA_DEFAULT_ZOOM = 13;

interface LiveMapComponentProps {
    incidents: Incident[];
    /** When set, map will fly to this incident and zoom in */
    focusIncidentId?: string | null;
}

/** Normalize status to enum (API may return string). */
function normalizeStatus(status: IncidentStatus | string | undefined): IncidentStatus {
    const s = String(status ?? 'active').toLowerCase();
    if (s === 'resolved') return IncidentStatus.RESOLVED;
    if (s === 'responding') return IncidentStatus.RESPONDING;
    return IncidentStatus.ACTIVE;
}

const createMarkerIcon = (status: IncidentStatus | string | undefined) => {
    const normalized = normalizeStatus(status);
    let iconSvg: string;
    let color: string;
    let animationClass = '';
    let backgroundStyle = '';

    switch (normalized) {
        case IncidentStatus.ACTIVE:
            // Exclamation mark icon SVG with red and orange gradient background
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><defs><linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" /><stop offset="50%" style="stop-color:#E53935;stop-opacity:1" /><stop offset="100%" style="stop-color:#C62828;stop-opacity:1" /></linearGradient></defs><circle cx="12" cy="12" r="10" fill="url(#fireGradient)"/><text x="12" y="17" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">!</text></svg>';
            color = '#E53935';
            animationClass = 'pinpoint-blinker-red';
            // Use gradient background for active fires
            backgroundStyle = 'background: linear-gradient(135deg, #FF6B35 0%, #E53935 50%, #C62828 100%);';
            break;
        case IncidentStatus.RESPONDING:
            // Truck icon SVG
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><path d="M12 17h6"/><path d="M15 17v-4"/><path d="M7 17v-4"/><path d="M9 17H7"/><path d="M19 17h-2"/></svg>';
            color = '#FDD835';
            animationClass = 'pulse-yellow-animation';
            backgroundStyle = `background-color: ${color};`;
            break;
        case IncidentStatus.RESOLVED:
            // CheckCircle icon SVG
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
            color = '#43A047';
            backgroundStyle = `background-color: ${color};`;
            break;
        default:
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.5-1-2-1-4a3.5 3.5 0 0 0-1.5 4c0 1.5 0 2.5-1 3.5"/><path d="M14.5 16.5A2.5 2.5 0 0 1 12 14c0-1.5 1-2 1-4a3.5 3.5 0 0 1 1.5 4c0 1.5 0 2.5 1 3.5"/></svg>';
            color = '#757575';
            backgroundStyle = `background-color: ${color};`;
    }

    const iconHtml = `<div class="rounded-full p-2" style="${backgroundStyle} display: flex; align-items: center; justify-content: center;">${iconSvg}</div>`;

    return new L.DivIcon({
        html: `<div class="relative flex items-center justify-center"><div class="absolute ${animationClass} rounded-full" style="background-color: ${color}; width: 40px; height: 40px;"></div>${iconHtml}</div>`,
        className: 'bg-transparent border-0',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

function MapResizer() {
    const map = useMap();
    useEffect(() => {
        // Invalidate map size after mount to fix black screen issue when navigating
        const timer1 = setTimeout(() => {
            map.invalidateSize();
        }, 100);
        
        const timer2 = setTimeout(() => {
            map.invalidateSize();
        }, 500);
        
        // Also invalidate on window resize
        const handleResize = () => {
            map.invalidateSize();
        };
        window.addEventListener('resize', handleResize);
        
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            window.removeEventListener('resize', handleResize);
        };
    }, [map]);
    return null;
}

function MapFocusController({
    focusIncidentId,
    incidents,
}: {
    focusIncidentId: string | null | undefined;
    incidents: Incident[];
}) {
    const map = useMap();
    useEffect(() => {
        if (!focusIncidentId || !incidents.length) return;
        const incident = incidents.find((i) => i.id === focusIncidentId);
        if (incident?.location?.lat != null && incident?.location?.lng != null) {
            map.flyTo(
                [incident.location.lat, incident.location.lng],
                17,
                { duration: 1.2 }
            );
        }
    }, [focusIncidentId, incidents, map]);
    return null;
}

const LiveMapComponent: React.FC<LiveMapComponentProps> = ({
    incidents,
    focusIncidentId = null,
}) => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div className="w-full h-full min-h-[400px] bg-white flex items-center justify-center rounded-lg">
                <div className="animate-pulse text-gray-500">Loading map...</div>
            </div>
        );
    }

    return (
        <MapContainer
            center={VALENCIA_CITY_CENTER}
            zoom={VALENCIA_DEFAULT_ZOOM}
            style={{ height: '100%', width: '100%', backgroundColor: '#ffffff', zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            <MapResizer />
            <MapFocusController focusIncidentId={focusIncidentId} incidents={incidents} />
            {incidents
                .filter((incident) => incident?.location?.lat != null && incident?.location?.lng != null)
                .map((incident) => {
                    const lat = incident.location.lat;
                    const lng = incident.location.lng;
                    const sensor = incident.sensorData;
                    const temp = sensor?.temperature ?? 0;
                    const smoke = sensor?.smoke ?? 0;
                    const gas = sensor?.gas ?? 0;
                    return (
                        <Marker key={incident.id} position={[lat, lng]} icon={createMarkerIcon(incident.status)}>
                            <Popup>
                                <div className="bg-white text-gray-900 p-2 rounded-md border border-gray-200 shadow-md w-64">
                                    <h3 className="font-bold text-lg mb-2">Incident: {incident.id}</h3>
                                    <p><strong>Status:</strong> <span className="capitalize">{String(incident.status ?? 'active')}</span></p>
                                    <p><strong>Address:</strong> {incident.address ?? 'Unknown'}</p>
                                    <p><strong>Detected:</strong> {incident.timestamp ? new Date(incident.timestamp).toLocaleString() : '—'}</p>
                                    <p><strong>Unit:</strong> {incident.assignedUnit || 'N/A'}</p>
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                        <p className="font-semibold">Sensor Data:</p>
                                        <ul className="list-disc list-inside text-sm">
                                            <li>Temp: {Number(temp).toFixed(1)}°C</li>
                                            <li>Smoke: {smoke} PPM</li>
                                            <li>Gas: {gas} PPM</li>
                                        </ul>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
        </MapContainer>
    );
};

export default LiveMapComponent;
