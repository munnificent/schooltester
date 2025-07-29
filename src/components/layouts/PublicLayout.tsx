import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header';
import Footer from '../footer';
// import { RequestFormModal } from '../modals/RequestFormModal'; // TODO: Создать этот компонент

const PublicLayout: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onApplyClick={() => setIsModalOpen(true)} />
      <main className="flex-grow">
        {/* Здесь будут рендериться все публичные страницы */}
        <Outlet />
      </main>
      <Footer />
      
      {/* TODO: Раскомментировать, когда модальное окно будет готово */}
      {/* <RequestFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
    </div>
  );
};

export default PublicLayout;