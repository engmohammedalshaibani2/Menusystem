import React from 'react';
import { Outlet } from 'react-router';

export function RootLayout() {
  return (
    <div 
      className="min-h-screen font-['Tajawal'] text-white relative"
      style={{
        backgroundColor: '#5e152e',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L33 27L60 30L33 33L30 60L27 33L0 30L27 27Z' fill='none' stroke='%23b48d59' stroke-opacity='0.15' stroke-width='0.5'/%3E%3Cpath d='M15 15L30 0L45 15L60 30L45 45L30 60L15 45L0 30Z' fill='none' stroke='%23b48d59' stroke-opacity='0.1' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '120px 120px'
      }}
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#5e152e]/80 to-[#7a1b41]/90 pointer-events-none z-0" />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
