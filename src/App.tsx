import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Groups from './pages/Groups';
import Architecture from './pages/Architecture';
import Configuration from './pages/Configuration';
import Production from './pages/Production';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { resolvedTheme } = useTheme();

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Admin Dashboard',
      users: 'User Management',
      reports: 'Reports & Moderation',
      groups: 'Group Management',
      architecture: 'System Architecture',
      configuration: 'Configuration Guide',
      production: 'Production Status',
    };
    return titles[currentPage] || 'PrayChat Admin';
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'users': return <Users />;
      case 'reports': return <Reports />;
      case 'groups': return <Groups />;
      case 'architecture': return <Architecture />;
      case 'configuration': return <Configuration />;
      case 'production': return <Production />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen ${resolvedTheme === 'dark' ? 'bg-surface-900' : 'bg-surface-50'}`}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
      />
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <Header
          title={getPageTitle()}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
