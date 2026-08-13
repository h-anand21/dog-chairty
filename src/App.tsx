import React from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { Footer } from './components/layout/Footer';
import { DiscoverPage } from './pages/DiscoverPage';
import { AdoptFlowPage } from './pages/AdoptFlowPage';
import { FeedPage } from './pages/FeedPage';
import { ChatPage } from './pages/ChatPage';
import { MyDogsPage } from './pages/MyDogsPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DogDetailModal } from './components/discover/DogDetailModal';
import { AdoptionApplicationModal } from './components/adoption/AdoptionApplicationModal';
import { ListDogModal } from './components/adoption/ListDogModal';
import { ReportListingModal } from './components/adoption/ReportListingModal';
import { CelebrationModal } from './components/common/CelebrationModal';
import { AdoptionCertificateModal } from './components/adoption/AdoptionCertificateModal';
import { AuthModal } from './components/auth/AuthModal';
import { OtpToast } from './components/auth/OtpToast';

export const App: React.FC = () => {
  const {
    activeTab,
    selectedDog,
    setSelectedDog,
    isAuthModalOpen,
    setIsAuthModalOpen,
    activeOtpSession,
    dismissOtpToast,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#111317]">
      
      {/* Top Simulated Real-Time SMS Banner */}
      {activeOtpSession && (
        <OtpToast
          phone={activeOtpSession.phone}
          code={activeOtpSession.code}
          onAutoFill={(code) => {
            // Trigger auto-fill in modal inputs
            const digits = code.split('');
            digits.forEach((d, idx) => {
              const el = document.getElementById(`otp-input-${idx}`) as HTMLInputElement;
              if (el) el.value = d;
            });
          }}
          onClose={dismissOtpToast}
        />
      )}

      {/* Top Sticky Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'discover' && (
          <DiscoverPage onSelectDog={(dog) => setSelectedDog(dog)} />
        )}
        {activeTab === 'adopt_flow' && <AdoptFlowPage />}
        {activeTab === 'feed' && <FeedPage />}
        {activeTab === 'chat' && <ChatPage />}
        {activeTab === 'my_dogs' && <MyDogsPage />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Modals */}
      <DogDetailModal
        dog={selectedDog}
        onClose={() => setSelectedDog(null)}
      />
      <AdoptionApplicationModal />
      <ListDogModal />
      <ReportListingModal />
      <CelebrationModal />
      <AdoptionCertificateModal />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};
