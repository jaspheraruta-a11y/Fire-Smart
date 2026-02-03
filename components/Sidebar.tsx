
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Siren, Smartphone, BarChart2, Settings } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/overview' },
    { name: 'Live Map', icon: Map, path: '/dashboard/map' },
    { name: 'Alerts', icon: Siren, path: '/dashboard/alerts' },
    { name: 'Devices', icon: Smartphone, path: '/dashboard/devices' },
    { name: 'Reports', icon: BarChart2, path: '/dashboard/reports' },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-[#2A2A2A] flex-shrink-0 p-4 flex flex-col border-r border-gray-700">
            <div className="flex items-center space-x-2 mb-10 px-2">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#E53935"/><path d="M13.26 6.74L12 5L10.74 6.74C9.13 8.35 8 10.58 8 13C8 16.31 10.69 19 14 19C14.7 19 15.37 18.87 16 18.63C15.12 16.89 14.26 14.88 13.26 6.74Z" fill="#FB8C00"/></svg>
                <span className="text-xl font-bold tracking-wider text-white">FIRE SMART</span>
            </div>
            <nav className="flex-1">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => 
                                    `flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
                                    isActive 
                                        ? 'bg-[#E53935] text-white shadow-lg' 
                                        : 'text-gray-300 hover:bg-[#3A3A3A] hover:text-white'
                                    }`
                                }
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;
