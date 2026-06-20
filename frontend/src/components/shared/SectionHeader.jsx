import React from 'react';
import * as Icons from 'lucide-react';

const SectionHeader = ({ title, iconName, color }) => {
    const Icon = Icons[iconName] || Icons.HelpCircle;

    return (
        <div className="flex items-center space-x-4 mb-8">
            <div className={`p-3 rounded-2xl bg-${color}-100 dark:bg-dark-accent/10 text-${color}-600 dark:text-dark-accent shadow-sm border border-${color}-200 dark:border-dark-accent/20 transition-colors duration-500`}>
                <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-black text-gray-800 dark:text-dark-text-main tracking-tight transition-colors duration-500 italic uppercase">{title}</h2>
        </div>
    );
};

export default SectionHeader;
