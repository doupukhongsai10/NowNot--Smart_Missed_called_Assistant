import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import StatusManager from './pages/StatusManager';
import Scheduler from './pages/Scheduler';
import Messages from './pages/Messages';
import CallLog from './pages/CallLog';
import Settings from './pages/Settings';
import CreateStatusModal from './components/CreateStatusModal';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [pageHistory, setPageHistory] = useState(['dashboard']);
  const [editingStatus, setEditingStatus] = useState(null);

  const navigateTo = (page, data = null) => {
    if (page === activePage && !data) return;
    if (data) setEditingStatus(data);
    else setEditingStatus(null);

    setPageHistory((prev) => [...prev, page]);
    setActivePage(page);
  };

  const handleBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory];
      newHistory.pop(); // Remove current page
      const previousPage = newHistory[newHistory.length - 1];
      setPageHistory(newHistory);
      setActivePage(previousPage || 'dashboard');
    } else {
      setActivePage('dashboard');
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} />;
      case 'statuses':
        return <StatusManager onNavigate={navigateTo} />;
      case 'create-status':
        return (
          <CreateStatusModal
            initialStatus={editingStatus}
            onClose={handleBack}
            onSave={handleBack}
          />
        );
      case 'scheduler':
        return <Scheduler />;
      case 'messages':
        return <Messages />;
      case 'log':
        return <CallLog />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  // Keep bottom nav highlighting 'statuses' when on 'create-status'
  const navActiveTab = activePage === 'create-status' ? 'statuses' : activePage;

  return (
    <div className="min-h-dvh relative">
      {/* Background glow orbs */}
      <div className="fixed top-[-12%] left-[-8%] w-[45%] h-[45%] bg-status-active/10 blur-[130px] pointer-events-none z-0 rounded-full" />
      <div className="fixed bottom-[-8%] right-[-8%] w-[35%] h-[35%] bg-group-family/5 blur-[110px] pointer-events-none z-0 rounded-full" />
      <div className="fixed top-[40%] right-[-5%] w-[25%] h-[25%] bg-secondary/5 blur-[90px] pointer-events-none z-0 rounded-full" />

      {/* Top Bar (hidden on create-status page since CreateStatusModal has its own top bar) */}
      {activePage !== 'create-status' && (
        <Header
          activePage={activePage}
          onBack={handleBack}
          onOpenSettings={() => navigateTo('settings')}
        />
      )}

      {/* Main Content Area */}
      <main
        className={`relative z-10 ${
          activePage === 'create-status' ? 'p-0' : 'pt-20 pb-28 px-4'
        } mx-auto`}
        style={{ maxWidth: activePage === 'create-status' ? '100%' : 480 }}
      >
        {renderPage()}
      </main>

      {/* Bottom Nav Bar */}
      <BottomNav activePage={navActiveTab} onNavigate={navigateTo} />
    </div>
  );
}
