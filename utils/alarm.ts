/**
 * Loud audio alarm system for fire alerts
 * Uses Web Audio API for maximum volume and control
 */

class AlarmSystem {
    private audioContext: AudioContext | null = null;
    private activeOscillators: OscillatorNode[] = [];
    private gainNode: GainNode | null = null;
    private isPlaying = false;
    private volume = 1.0; // Maximum volume (0.0 to 1.0)
    private loopTimeout: NodeJS.Timeout | null = null;
    private restartTimeout: NodeJS.Timeout | null = null;

    /**
     * Initialize the audio context (must be called after user interaction)
     */
    private async initAudioContext(): Promise<void> {
        if (this.audioContext) return;

        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
        }
    }

    /**
     * Play a loud fire alarm sound using Web Audio API
     * This creates a siren-like sound that can be very loud
     */
    async playAlarm(): Promise<void> {
        if (this.isPlaying) return;

        await this.initAudioContext();
        if (!this.audioContext) {
            console.error('Audio context not available');
            return;
        }

        try {
            this.isPlaying = true;
            this.playAlarmLoop();
        } catch (error) {
            console.error('Error playing alarm:', error);
            this.isPlaying = false;
        }
    }

    /**
     * Internal method to play the alarm loop continuously
     */
    private playAlarmLoop(): void {
        if (!this.audioContext || !this.isPlaying) return;

        try {
            // Create multiple oscillators for a more complex, louder alarm sound
            const osc1 = this.audioContext.createOscillator();
            const osc2 = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            const compressor = this.audioContext.createDynamicsCompressor();

            // Configure oscillators for a loud, attention-grabbing dual-tone siren
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(800, this.audioContext.currentTime);
            
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1000, this.audioContext.currentTime);

            // Create modulation for siren effect
            const modOsc1 = this.audioContext.createOscillator();
            const modOsc2 = this.audioContext.createOscillator();
            const modGain1 = this.audioContext.createGain();
            const modGain2 = this.audioContext.createGain();

            modOsc1.type = 'sine';
            modOsc1.frequency.value = 2.5; // Siren modulation speed
            modGain1.gain.value = 300; // Frequency deviation

            modOsc2.type = 'sine';
            modOsc2.frequency.value = 2.5;
            modGain2.gain.value = 300;

            // Connect modulation
            modOsc1.connect(modGain1);
            modGain1.connect(osc1.frequency);
            modOsc2.connect(modGain2);
            modGain2.connect(osc2.frequency);

            // Set volume to maximum with compressor for loudness
            compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime);
            compressor.knee.setValueAtTime(30, this.audioContext.currentTime);
            compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
            compressor.attack.setValueAtTime(0, this.audioContext.currentTime);
            compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);

            gain.gain.setValueAtTime(this.volume, this.audioContext.currentTime);

            // Connect all nodes
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(compressor);
            compressor.connect(this.audioContext.destination);

            // Start all oscillators
            modOsc1.start();
            modOsc2.start();
            osc1.start();
            osc2.start();

            // Store references for cleanup
            this.activeOscillators = [osc1, osc2, modOsc1, modOsc2];
            this.gainNode = gain;

            // Stop after 1.5 seconds and restart for continuous alarm
            this.loopTimeout = setTimeout(() => {
                if (this.isPlaying && this.audioContext) {
                    try {
                        osc1.stop();
                        osc2.stop();
                        modOsc1.stop();
                        modOsc2.stop();
                    } catch (e) {
                        // Oscillators may already be stopped
                    }
                    // Clear the array since these oscillators are done
                    this.activeOscillators = [];
                    // Restart immediately for continuous alarm
                    this.restartTimeout = setTimeout(() => {
                        if (this.isPlaying) {
                            this.playAlarmLoop();
                        }
                    }, 50);
                }
            }, 1500);

        } catch (error) {
            console.error('Error in alarm loop:', error);
            this.isPlaying = false;
        }
    }

    /**
     * Stop the alarm
     */
    stopAlarm(): void {
        // Set isPlaying to false first to prevent restart loops
        this.isPlaying = false;
        
        // Clear any pending timeouts
        if (this.loopTimeout) {
            clearTimeout(this.loopTimeout);
            this.loopTimeout = null;
        }
        if (this.restartTimeout) {
            clearTimeout(this.restartTimeout);
            this.restartTimeout = null;
        }
        
        // Stop all active oscillators
        this.activeOscillators.forEach(osc => {
            try {
                osc.stop();
            } catch (e) {
                // Oscillator may already be stopped
            }
        });
        this.activeOscillators = [];
        
        // Clear gain node reference
        this.gainNode = null;
    }

    /**
     * Set alarm volume (0.0 to 1.0)
     */
    setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.gainNode && this.audioContext) {
            this.gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        }
    }

    /**
     * Check if alarm is currently playing
     */
    getIsPlaying(): boolean {
        return this.isPlaying;
    }
}

// Export singleton instance
export const alarmSystem = new AlarmSystem();
