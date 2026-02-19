import React, { useEffect, useRef, useState } from 'react';
import { subscribeToIncidents } from '../services/supabase';
import { Incident, IncidentStatus } from '../types';
import { alarmSystem } from '../utils/alarm';
import { useAlarm } from '../hooks/useAlarm';

/**
 * Global incident watcher that:
 * - Plays a loud alarm whenever there are active incidents (unless muted)
 * - Shows browser notifications when new incidents become active
 *
 * Mounted once inside the dashboard layout so it works on any page.
 */
const IncidentMonitor: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const previousActiveCountRef = useRef<number>(0);
    const { isMuted } = useAlarm();

    // Subscribe globally to incidents
    useEffect(() => {
        const unsubscribe = subscribeToIncidents(setIncidents);
        return () => {
            unsubscribe();
            alarmSystem.stopAlarm();
        };
    }, []);

    // Request browser notification permission once
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!('Notification' in window)) return;

        if (Notification.permission === 'default') {
            // Fire and forget – browsers may ignore if not user-initiated
            Notification.requestPermission().catch(() => {
                // Ignore errors
            });
        }
    }, []);

    // Monitor for active incidents -> alarm + web notifications
    useEffect(() => {
        const activeIncidents = incidents.filter(
            incident =>
                incident.status === IncidentStatus.ACTIVE ||
                (typeof incident.status === 'string' &&
                    incident.status.toLowerCase() === 'active')
        );

        const currentActiveCount = activeIncidents.length;
        const previousActiveCount = previousActiveCountRef.current;

        // Handle audio alarm
        if (currentActiveCount > 0 && !isMuted) {
            if (!alarmSystem.getIsPlaying() || currentActiveCount > previousActiveCount) {
                alarmSystem.playAlarm().catch(error => {
                    console.error('Failed to play global alarm:', error);
                });
            }
        } else {
            alarmSystem.stopAlarm();
        }

        // Handle browser notifications when new incidents appear
        const newIncidentsCount = currentActiveCount - previousActiveCount;
        if (newIncidentsCount > 0) {
            if (typeof window !== 'undefined' && 'Notification' in window) {
                if (Notification.permission === 'granted') {
                    const title =
                        newIncidentsCount === 1
                            ? 'New fire incident detected'
                            : `${newIncidentsCount} new fire incidents detected`;

                    const body =
                        currentActiveCount === 1
                            ? 'There is 1 active fire incident that requires attention.'
                            : `There are now ${currentActiveCount} active fire incidents.`;

                    try {
                        new Notification(title, {
                            body,
                            tag: 'fire-smart-active-incident',
                            renotify: true,
                        });
                    } catch (err) {
                        console.error('Failed to show notification:', err);
                    }
                }
            }
        }

        previousActiveCountRef.current = currentActiveCount;
    }, [incidents, isMuted]);

    // This component has no visual output
    return null;
};

export default IncidentMonitor;

