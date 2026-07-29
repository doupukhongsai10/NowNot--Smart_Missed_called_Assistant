import React, { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import StatusManager from './pages/StatusManager';
import Scheduler from './pages/Scheduler';
import Messages from './pages/Messages';
import CallLog from './pages/CallLog';
import Settings from './pages/Settings';
import Auth from './pages/Auth';
import CreateStatusModal from './components/CreateStatusModal';
import { StatusProvider, useStatusContext } from './context/StatusContext';
import useScheduler from './hooks/useScheduler';
import authStore from './store/authStore';

/**
 * AppShell — lives INSIDE <StatusProvider> so it can safely call useStatusContext().
 * Handles routing, navigation history, and the scheduler tick loop.
 */
function AppShell() {
  const [activePage, setActivePage] = useState('dashboard');
  const [pageHistory, setPageHistory] = useState(['dashboard']);
  const [editingStatus, setEditingStatus] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => authStore.getSession());

  // Mount the 60-second scheduler tick loop for the lifetime of the app.
  // refreshActiveStatus comes from the shared StatusContext so all pages update.
  const { refreshActiveStatus } = useStatusContext();
  useScheduler({ onStatusChange: refreshActiveStatus });

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

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    authStore.logout();
    setCurrentUser(null);
    setActivePage('auth');
  };

  const renderPage = () => {
    if (activePage === 'auth') {
      return <Auth onLoginSuccess={handleLoginSuccess} />;
    }

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
            onSave={() => { handleBack(); refreshActiveStatus(); }}
          />
        );
      case 'scheduler':
        return <Scheduler />;
      case 'messages':
        return <Messages />;
      case 'log':
        return <CallLog />;
      case 'settings':
        return <Settings onLogout={handleLogout} />;
      case 'auth':
        return <Auth onLoginSuccess={handleLoginSuccess} />;
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  // If on Auth page, render Auth full screen
  if (activePage === 'auth') {
    return <Auth onLoginSuccess={handleLoginSuccess} />;
  }

  // Keep bottom nav highlighting 'statuses' when on 'create-status'
  const navActiveTab = activePage === 'create-status' ? 'statuses' : activePage;

  return (
    <div className="min-h-dvh relative">
      {/* Background glow orbs */}
      <div className="fixed top-[-12%] left-[-8%] w-[45%] h-[45%] bg-status-active/10 blur-[130px] pointer-events-none z-0 rounded-full" />
      <div className="fixed bottom-[-8%] right-[-8%] w-[35%] h-[35%] bg-group-family/5 blur-[110px] pointer-events-none z-0 rounded-full" />
      <div className="fixed top-[40%] right-[-5%] w-[25%] h-[25%] bg-secondary/5 blur-[90px] pointer-events-none z-0 rounded-full" />

      {/* Top Bar (hidden on create-status page) */}
      {activePage !== 'create-status' && (
        <Header
          activePage={activePage}
          onBack={handleBack}
          onOpenSettings={() => navigateTo('settings')}
          onAuthClick={() => setActivePage('auth')}
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
      {activePage !== 'create-status' && (
        <BottomNav activePage={navActiveTab} onNavigate={navigateTo} />
      )}
    </div>
  );
}

/**
 * App — the root component. Wraps everything in <StatusProvider> so all
 * descendant components share the same activeStatus state instance.
 */
export default function App() {
  return (
    <StatusProvider>
      <AppShell />
    </StatusProvider>
  );
}
