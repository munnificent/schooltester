// src/components/layouts/PublicLayout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';
import { RequestFormModal } from '../modals/request-form-modal'; 

const PublicLayout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onApplyClick={() => setIsModalOpen(true)} />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />

      {/* ✅ Активированная модалка */}
      <RequestFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default PublicLayout;
