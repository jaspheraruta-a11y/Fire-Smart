
export enum UserRole {
    BFP_ADMIN = 'bfp_admin',
    MONITORING_OFFICER = 'monitoring_officer',
}

export interface UserProfile {
    id: string;
    email: string;
    role: UserRole;
    fullName: string;
}

export enum IncidentStatus {
    ACTIVE = 'active',
    RESPONDING = 'responding',
    RESOLVED = 'resolved',
}

export interface SensorData {
    temperature: number; // in Celsius
    smoke: number; // PPM
    gas: number; // PPM
}

export interface Incident {
    id: string;
    deviceId: string;
    timestamp: string;
    location: {
        lat: number;
        lng: number;
    };
    address: string;
    locationName: string;
    status: IncidentStatus;
    sensorData: SensorData;
    assignedUnit?: string;
    resolvedAt?: string;
}

export interface Device {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
    status: 'online' | 'offline';
    lastSeen: string;
}
