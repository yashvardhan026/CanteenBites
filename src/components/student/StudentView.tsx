'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { StudentHome } from './StudentHome';
import { StudentSearch } from './StudentSearch';
import { StudentCart } from './StudentCart';
import { StudentOrders } from './StudentOrders';
import { StudentProfile } from './StudentProfile';
import { StudentBottomNav } from './StudentBottomNav';

export const StudentView: React.FC = () => {
  const { activeNavTab } = useApp();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 min-h-[calc(100vh-4rem)]">
      {activeNavTab === 'home' && <StudentHome />}
      {activeNavTab === 'search' && <StudentSearch />}
      {activeNavTab === 'cart' && <StudentCart />}
      {activeNavTab === 'orders' && <StudentOrders />}
      {activeNavTab === 'profile' && <StudentProfile />}

      {/* Sticky Bottom Navigation for Mobile & Desktop */}
      <StudentBottomNav />
    </div>
  );
};
