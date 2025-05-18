'use client';

import Header from '@/app/components/Header';
import Sidebar from '@/app/components/Sidebar';
import MainContent from '@/app/components/MainContent';

export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--mui-palette-background-default)', color: 'var(--mui-palette-text-primary)', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Sidebar />
        <main style={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <MainContent />
        </main>
      </div>
    </div>
  );
}
