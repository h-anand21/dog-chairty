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

export const App: React.FC = () => {
  const {
    activeTab,
    selectedDog,
    setSelectedDog,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F2EDE4] dark:bg-[#0B0F19] text-[#1A1C20] dark:text-[#F8FAFC] transition-colors duration-300">
      
      {/* Top Sticky Responsive Navbar */}
      <Navbar />

      {/* Main Content Area with Mobile Safe Bottom Padding */}
      <main className="flex-1 pb-24 sm:pb-28 lg:pb-12">
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

      {/* Floating Mobile Bottom Navigation Bar */}
      <MobileNav />

      {/* Footer */}
      <Footer />
    </div>
  );
};
