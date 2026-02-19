
import React from 'react';
import { Incident, IncidentStatus } from '../types';

interface ReportsTableProps {
    incidents: Incident[];
}

const statusClasses: { [key in IncidentStatus]: string } = {
    [IncidentStatus.ACTIVE]: 'bg-red-500/20 text-red-300',
    [IncidentStatus.RESPONDING]: 'bg-yellow-500/20 text-yellow-300',
    [IncidentStatus.RESOLVED]: 'bg-green-500/20 text-green-300',
};


const ReportsTable: React.FC<ReportsTableProps> = ({ incidents }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-[#3A3A3A]">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Incident ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Address</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Assigned Unit</th>
                    </tr>
                </thead>
                <tbody className="bg-[#2A2A2A] divide-y divide-gray-700">
                    {incidents.map((incident) => (
                        <tr key={incident.id} className="hover:bg-[#3A3A3A] transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{incident.id.slice(0, 8)}...</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(incident.timestamp).toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 max-w-xs truncate">{incident.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[incident.status]} capitalize`}>
                                    {incident.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{incident.assignedUnit || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportsTable;
