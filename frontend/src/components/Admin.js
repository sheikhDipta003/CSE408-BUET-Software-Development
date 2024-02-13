import React, { useState } from 'react';
import UserManagement from './UserManagement';
import ContentManagement from './ContentManagement';
import AnalyticsReports from './AnalyticsReports';
import EventManagement from './EventManagement';

const Admin = ({adminId}) => {
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [activeSubMenu, setActiveSubMenu] = useState('Analytics');

    console.log("Admin.js = ", adminId);

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
        setActiveSubMenu('');
    };

    const handleSubMenuClick = (submenu) => {
        setActiveSubMenu(submenu);
    };

    return (
        <div className="flex justify-center py-8">
            <div className="flex">
                <div className="min-w-32 p-4 border-r border-red-500">
                    <h2 className="text-lg font-bold mb-4">Admin Menu</h2>
                    <ul>
                        <li className={`cursor-pointer ${activeMenu === 'Dashboard' ? 'text-red-500 font-bold' : 'text-black'} mb-4`} onClick={() => handleMenuClick('Dashboard')}>Dashboard</li>
                        <li className={`cursor-pointer ${activeMenu === 'My Profile' ? 'text-red-500 font-bold' : 'text-black'} mb-4`} onClick={() => handleMenuClick('My Profile')}>My Profile</li>
                        <li className={`cursor-pointer ${activeMenu === 'Settings' ? 'text-red-500 font-bold' : 'text-black'} mb-4`} onClick={() => handleMenuClick('Settings')}>Settings</li>
                    </ul>
                </div>
                <div className="w-full p-4">
                    {activeMenu === 'Dashboard' && (
                        <div>
                            <ul className="flex ">
                                <li className={`cursor-pointer ${activeSubMenu === 'Analytics' ? 'border-b-4 border-b-red-500 mb-4 text-blue-700 bg-yellow-200 rounded-md rounded-b-none p-2' : 'text-black mb-4 rounded-md rounded-b-none p-2 bg-slate-300'} mb-1 mr-4`} onClick={() => handleSubMenuClick('Analytics')}>Analytics & Reports</li>
                                <li className={`cursor-pointer ${activeSubMenu === 'UserManagement' ? 'border-b-4 border-b-red-500 mb-4 text-blue-700 bg-yellow-200 rounded-md  rounded-b-none p-2' : 'text-black mb-4 rounded-md rounded-b-none p-2 bg-slate-300'} mb-1 mr-4`} onClick={() => handleSubMenuClick('UserManagement')}>User Management</li>
                                <li className={`cursor-pointer ${activeSubMenu === 'ContentManagement' ? 'border-b-4 border-b-red-500 mb-4 text-blue-700 bg-yellow-200 rounded-md  rounded-b-none p-2' : 'text-black mb-4 rounded-md rounded-b-none p-2 bg-slate-300'} mb-1 mr-4`} onClick={() => handleSubMenuClick('ContentManagement')}>Content Management</li>
                                <li className={`cursor-pointer ${activeSubMenu === 'EventManagement' ? 'border-b-4 border-b-red-500 mb-4 text-blue-700 bg-yellow-200 rounded-md rounded-b-none p-2' : 'text-black mb-4 rounded-md rounded-b-none p-2 bg-slate-300'} mb-1 mr-4`} onClick={() => handleSubMenuClick('EventManagement')}>Event Management</li>
                            </ul>
                            {activeSubMenu === 'UserManagement' && <UserManagement />}
                            {activeSubMenu === 'ContentManagement' && <ContentManagement />}
                            {activeSubMenu === 'Analytics' && <AnalyticsReports />}
                            {activeSubMenu === 'EventManagement' && <EventManagement />}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
