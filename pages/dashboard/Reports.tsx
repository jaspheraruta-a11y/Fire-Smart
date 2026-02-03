
import React, { useEffect, useState } from 'react';
import ReportsTable from '../../components/ReportsTable';
import { subscribeToIncidents } from '../../services/supabase';
import { Incident } from '../../types';
import { FileDown } from 'lucide-react';

const Reports: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);

    useEffect(() => {
        const unsubscribe = subscribeToIncidents(setIncidents);
        return () => unsubscribe();
    }, []);

    const sortedIncidents = [...incidents].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Incident Reports & Logs</h1>
                <div className="space-x-2">
                     <button className="bg-[#2A2A2A] hover:bg-[#3A3A3A] text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                        <FileDown className="h-4 w-4" />
                        <span>Export CSV</span>
                    </button>
                    <button className="bg-[#E53935] hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center space-x-2">
                        <FileDown className="h-4 w-4" />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 overflow-hidden">
                <ReportsTable incidents={sortedIncidents} />
            </div>
        </div>
    );
};

export default Reports;
