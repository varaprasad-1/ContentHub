import React from 'react';

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
  { id: 'dashboard', label: '📈 Dashboard', icon: '📊' },
  { id: 'calendar', label: '📅 Content Calendar', icon: '📆' },
  { id: 'posts', label: '📝 Posts', icon: '📝' },
  { id: 'analytics', label: '📉 Analytics', icon: '📊' },
  { id: 'schedules', label: '⏰ Schedules', icon: '⏱️' },
];

  return (
    <div className="sidebar">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
