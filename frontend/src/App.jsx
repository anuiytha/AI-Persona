import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatInterface from './components/ChatInterface.jsx';
import { getStats } from './services/api.js';
import './App.css';

function App() {
    const [activeTab, setActiveTab] = useState('chat');
    const [stats, setStats] = useState({
        totalDocuments: 0,
        vectorStoreStatus: 'inactive'
    });

    // Persona information
    const persona = {
        name: "Mallikarjuna Iytha",
        role: "CEO of Inclusive Divyangjan Entrepreneur Association (IDEA)",
        description: "Chat with Mallikarjuna Iytha based on his interviews, articles, videos, and professional documents."
    };

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const statsData = await getStats();
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'chat':
                return <ChatInterface persona={persona} />;
            case 'stats':
                return (
                    <div className="stats-container">
                        <div className="persona-header">
                            <h2>Chatting with {persona.name}</h2>
                            <p className="persona-role">{persona.role}</p>
                            <p className="persona-description">{persona.description}</p>
                        </div>

                        <h3>Knowledge Base Statistics</h3>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h4>Total Documents</h4>
                                <p className="stat-number">{stats.totalDocuments}</p>
                                <small>Interviews, articles, videos, and documents</small>
                            </div>
                            <div className="stat-card">
                                <h4>Vector Store Status</h4>
                                <p className={`stat-status ${stats.vectorStoreStatus}`}>
                                    {stats.vectorStoreStatus}
                                </p>
                                <small>AI knowledge base health</small>
                            </div>
                            <div className="stat-card">
                                <h4>Persona</h4>
                                <p className="stat-persona">{persona.name}</p>
                                <small>AI personality based on real person</small>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <ChatInterface persona={persona} />;
        }
    };

    return (
        <div className="app">
            <Sidebar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                stats={stats}
                persona={persona}
            />
            <main className="main-content">
                {renderContent()}
            </main>
        </div>
    );
}

export default App;
