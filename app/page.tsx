'use client';

import MainContent from '@/app/components/MainContent';

export default function Page() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--textPrimary)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <main style={{ flexGrow: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <MainContent />
        </main>
      </div>
    </div>
  );
}
