import React from 'react';
import { MessageCircle, BarChart3, User } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, stats, persona }) => {
    const tabs = [
        {
            id: 'chat',
            label: 'Chat',
            icon: MessageCircle,
            description: `Talk with ${persona.name}`
        },
        {
            id: 'stats',
            label: 'Statistics',
            icon: BarChart3,
            description: 'View knowledge base status'
        }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <User size={32} />
                    <h1>{persona.name}</h1>
                </div>
                <p className="tagline">{persona.role}</p>
                <p className="persona-subtitle">AI Persona Chatbot</p>
            </div>

            <nav className="sidebar-nav">
                <ul className="nav-list">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <li key={tab.id}>
                                <button
                                    className={`nav-item ${isActive ? 'active' : ''}`}
                                    onClick={() => onTabChange(tab.id)}
                                >
                                    <Icon size={20} />
                                    <div className="nav-content">
                                        <span className="nav-label">{tab.label}</span>
                                        <span className="nav-description">{tab.description}</span>
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="knowledge-base-stats">
                    <h3>Knowledge Base</h3>
                    <div className="stat-item">
                        <span className="stat-label">Documents</span>
                        <span className="stat-value">{stats.totalDocuments}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Status</span>
                        <span className={`stat-status ${stats.vectorStoreStatus}`}>
                            {stats.vectorStoreStatus}
                        </span>
                    </div>
                    <div className="persona-info">
                        <h4>AI Persona</h4>
                        <p className="persona-name">{persona.name}</p>
                        <p className="persona-role-small">{persona.role}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
