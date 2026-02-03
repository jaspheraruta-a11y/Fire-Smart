
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Wifi } from 'lucide-react';

const FireSmartLogo: React.FC = () => (
    <div className="flex items-center space-x-2">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#E53935"/>
            <path d="M13.26 6.74L12 5L10.74 6.74C9.13 8.35 8 10.58 8 13C8 16.31 10.69 19 14 19C14.7 19 15.37 18.87 16 18.63C15.12 16.89 14.26 14.88 13.26 6.74Z" fill="#FB8C00"/>
        </svg>
        <span className="text-3xl font-bold tracking-wider text-white">FIRE SMART</span>
    </div>
);

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0F0F0F] text-[#CFCFCF] overflow-x-hidden">
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-red-500/20 blur-3xl filter"></div>
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl filter"></div>
            </div>
            
            <main className="relative z-10">
                {/* Hero Section */}
                <section className="flex flex-col items-center justify-center h-screen text-center px-4">
                    <FireSmartLogo />
                    <h1 className="mt-6 text-4xl md:text-6xl font-extrabold text-white tracking-tight">
                        IoT-Driven Fire Detection for Faster Emergency Response
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-gray-400">
                        A revolutionary platform connecting smart IoT devices directly to the Bureau of Fire Protection for proactive safety and immediate action.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link to="/login" className="px-8 py-3 bg-[#E53935] text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 glow-red">
                            Login to Dashboard
                        </Link>
                        <a href="#features" className="px-8 py-3 bg-[#2A2A2A] text-white font-semibold rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105">
                            View System Overview
                        </a>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 px-4 bg-[#121212]">
                    <div className="container mx-auto">
                        <h2 className="text-4xl font-bold text-center text-white mb-12">System Core Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={<Wifi className="h-10 w-10 text-[#FB8C00]" />}
                                title="Real-time Fire Detection"
                                description="Smart sensors detect fire, smoke, and gas in seconds, transmitting data instantly to our secure cloud platform."
                            />
                            <FeatureCard 
                                icon={<MapPin className="h-10 w-10 text-[#43A047]" />}
                                title="Automatic Location Mapping"
                                description="GPS-enabled devices automatically pinpoint the exact incident location on a live map for immediate dispatcher awareness."
                            />
                            <FeatureCard 
                                icon={<ShieldCheck className="h-10 w-10 text-[#E53935]" />}
                                title="Direct BFP Integration"
                                description="Alerts are streamed directly to the BFP Admin Dashboard, eliminating delays and enabling faster unit dispatch."
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
    <div className="bg-[#2A2A2A] p-8 rounded-xl border border-gray-700 hover:border-[#E53935] transition-colors duration-300 flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
    </div>
);

export default LandingPage;
