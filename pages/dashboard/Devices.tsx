
import React from 'react';
import { Smartphone, PlusCircle } from 'lucide-react';

const Devices: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">IoT Device Management</h1>
                 <button className="bg-[#E53935] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                    <PlusCircle className="h-5 w-5" />
                    <span>Register New Device</span>
                </button>
            </div>
            <div className="p-10 bg-[#2A2A2A] rounded-lg border border-gray-700 text-center">
                <Smartphone className="h-16 w-16 mx-auto text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold text-white">Device Management Coming Soon</h2>
                <p className="text-gray-400 mt-2">This section will allow you to register, monitor, and manage all Fire Smart IoT devices.</p>
            </div>
        </div>
    );
};

export default Devices;
