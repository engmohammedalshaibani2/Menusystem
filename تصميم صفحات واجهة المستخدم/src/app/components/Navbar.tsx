import image_logo_transparent_1 from '@/imports/logo_transparent-1.png'
import React from 'react';
import { Search, Menu as MenuIcon } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center justify-between px-6 md:px-12 py-5 bg-[#5e152e]/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#b48d59]/20 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
    >
      {/* Right side in RTL (Nav links and Search) */}
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-8 text-base font-bold font-['Cairo']">
          <Link to="/" className="text-[#b48d59] border-b-2 border-[#b48d59] pb-1">قائمة الطعام</Link>
          
          
          
          <button className="text-[#F5F2E8] hover:text-[#b48d59] transition-colors mr-2">
            <Search size={22} />
          </button>
        </div>
        <button className="md:hidden text-[#F5F2E8] hover:text-[#b48d59]">
          <MenuIcon size={28} />
        </button>
      </div>
      
      {/* Left side in RTL (Logo) */}
      <div>
        <Link to="/" className="bg-[#F5F2E8] text-[#5e152e] px-6 py-4 rounded-b-3xl -mt-5 shadow-[0_10px_20px_rgba(180,141,89,0.3)] flex flex-col items-center border-x border-b border-[#b48d59]/30 transform transition-transform hover:scale-105 hover:translate-y-1">
          <img src={image_logo_transparent_1} alt="Logo" className="w-16 h-16 object-contain" />
        </Link>
      </div>
    </motion.nav>
  );
}
