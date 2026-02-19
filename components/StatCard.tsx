
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: 'red' | 'orange' | 'yellow' | 'green';
}

const colorClasses = {
    red: { bg: 'bg-red-900/20', border: 'border-red-500/50', text: 'text-red-400' },
    orange: { bg: 'bg-orange-900/20', border: 'border-orange-500/50', text: 'text-orange-400' },
    yellow: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
    green: { bg: 'bg-green-900/20', border: 'border-green-500/50', text: 'text-green-400' },
};

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    const classes = colorClasses[color];

    return (
        <div className={`p-6 rounded-lg border ${classes.border} ${classes.bg} backdrop-blur-sm flex items-center space-x-4`}>
            <div className={`p-3 rounded-full ${classes.bg}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-400">{title}</p>
                <p className={`text-3xl font-bold ${classes.text}`}>{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
