
// This is a MOCK Supabase client to simulate API calls.
// In a real project, you would initialize the actual Supabase client here.
// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { Incident, IncidentStatus, SensorData } from '../types';

// Mock data
const mockIncidents: Incident[] = [
    {
        id: 'inc-1',
        deviceId: 'esp32-001',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        location: { lat: 14.5995, lng: 120.9842 },
        address: '123 Rizal Ave, Santa Cruz, Manila',
        status: IncidentStatus.ACTIVE,
        sensorData: { temperature: 85, smoke: 500, gas: 300 },
        assignedUnit: 'Engine 42',
    },
    {
        id: 'inc-2',
        deviceId: 'esp32-002',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        location: { lat: 14.5547, lng: 121.0244 },
        address: '456 Ayala Ave, Makati',
        status: IncidentStatus.RESPONDING,
        sensorData: { temperature: 60, smoke: 250, gas: 150 },
        assignedUnit: 'Ladder 15',
    },
     {
        id: 'inc-3',
        deviceId: 'esp32-003',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        location: { lat: 14.6760, lng: 121.0437 },
        address: '789 EDSA, Quezon City',
        status: IncidentStatus.RESOLVED,
        sensorData: { temperature: 30, smoke: 50, gas: 20 },
        assignedUnit: 'Rescue 1',
        resolvedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString()
    },
];

// Mock Supabase Realtime subscription
export const subscribeToIncidents = (callback: (incidents: Incident[]) => void) => {
    // Initial data
    callback(mockIncidents);

    // Simulate new incident every 15 seconds
    const newIncidentInterval = setInterval(() => {
        const newId = `inc-${Date.now()}`;
        const newIncident: Incident = {
            id: newId,
            deviceId: `esp32-${Math.floor(Math.random() * 10).toString().padStart(3, '0')}`,
            timestamp: new Date().toISOString(),
            location: {
                lat: 14.55 + Math.random() * 0.15,
                lng: 121.0 + Math.random() * 0.15,
            },
            address: 'New Location, Metro Manila',
            status: IncidentStatus.ACTIVE,
            sensorData: {
                temperature: 70 + Math.random() * 30,
                smoke: 400 + Math.random() * 200,
                gas: 200 + Math.random() * 150,
            },
        };
        mockIncidents.push(newIncident);
        callback([...mockIncidents]);
    }, 15000);

    // Simulate status change every 10 seconds
    const statusUpdateInterval = setInterval(() => {
        const activeIncidents = mockIncidents.filter(inc => inc.status === IncidentStatus.ACTIVE);
        if (activeIncidents.length > 0) {
            const incidentToUpdate = activeIncidents[0];
            incidentToUpdate.status = IncidentStatus.RESPONDING;
            incidentToUpdate.assignedUnit = `Engine ${Math.floor(Math.random() * 50)}`;
            callback([...mockIncidents]);
        }
    }, 10000);


    // Cleanup function
    return () => {
        clearInterval(newIncidentInterval);
        clearInterval(statusUpdateInterval);
    };
};
