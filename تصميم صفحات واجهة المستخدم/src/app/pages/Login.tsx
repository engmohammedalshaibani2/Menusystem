import image_logo_transparent_1 from '@/imports/logo_transparent-1.png'
import React, { useState } from 'react';
import { EyeOff, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-[#F5F2E8] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-[#b48d59]/30 w-full max-w-md overflow-hidden text-right text-[#5e152e] relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#b48d59] via-[#d4af7a] to-[#b48d59]" />
        
        <div className="p-8 pb-10 flex flex-col items-center">
          {/* Logo */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="mb-6 w-28 h-28 flex items-center justify-center bg-white rounded-full shadow-[0_8px_20px_rgba(180,141,89,0.3)] border-2 border-[#b48d59]/20 p-2"
          >
            <img src={image_logo_transparent_1} alt="Logo" className="w-full h-full object-contain" />
          </motion.div>
          
          <h2 className="text-3xl font-black font-['Cairo'] mb-8 text-[#5e152e]">تسجيل الدخول للمشرف</h2>
          
          <form className="w-full" onSubmit={(e) => e.preventDefault()}>
            <div className="mb-5">
              <label className="block text-sm font-bold text-[#5e152e]/80 mb-2 font-['Cairo']">اسم المستخدم</label>
              <input 
                type="text" 
                placeholder="أدخل اسم المستخدم"
                className="w-full bg-white border-2 border-[#b48d59]/30 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#b48d59] focus:border-transparent transition-all shadow-sm font-medium"
                dir="rtl"
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-bold text-[#5e152e]/80 mb-2 font-['Cairo']">كلمة المرور</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="أدخل كلمة المرور"
                  className="w-full bg-white border-2 border-[#b48d59]/30 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#b48d59] focus:border-transparent transition-all shadow-sm font-medium"
                  dir="rtl"
                />
                <button 
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b48d59] hover:text-[#5e152e] transition-colors p-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
                </button>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(180,141,89,0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#5e152e] text-[#F5F2E8] py-3.5 rounded-xl font-bold font-['Cairo'] text-lg hover:bg-[#7a1b41] transition-all mb-6 shadow-md"
            >
              دخول
            </motion.button>
            
            <div className="text-center">
              <a href="#" className="text-sm font-medium text-[#b48d59] hover:text-[#5e152e] transition-colors border-b border-transparent hover:border-[#5e152e] pb-0.5">
                نسيت كلمة المرور؟
              </a>
            </div>
          </form>
        </div>
        
        <div className="bg-[#5e152e]/5 border-t border-[#b48d59]/20 py-4 text-center">
          <p className="text-xs font-['Cairo'] font-bold text-[#5e152e]/60">حقوق الطبع والنشر © بيت المندي 2026</p>
        </div>
      </motion.div>
    </div>
  );
}
