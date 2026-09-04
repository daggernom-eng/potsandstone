import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pots and Stones - Admin Management Portal',
  description: 'Kitchen and order dispatch administration dashboard',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans">
      {children}
    </div>
  );
}
