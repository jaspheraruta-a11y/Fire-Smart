
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Incident } from '../types';

interface AnalyticsChartProps {
    incidents: Incident[];
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ incidents }) => {
    // Process data for the last 7 days
    const data = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const count = incidents.filter(inc => new Date(inc.timestamp).toDateString() === date.toDateString()).length;
        return { name: day, incidents: count };
    }).reverse();

    return (
        <div style={{ width: '100%', height: 300 }}>
             <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A4A4A" />
                    <XAxis dataKey="name" stroke="#CFCFCF" />
                    <YAxis stroke="#CFCFCF" />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#2A2A2A', 
                            border: '1px solid #4A4A4A'
                        }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="incidents" stroke="#E53935" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnalyticsChart;
