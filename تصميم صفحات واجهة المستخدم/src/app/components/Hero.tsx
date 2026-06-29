import React from 'react';
import { motion } from 'motion/react';

export function Hero() {
  return (
    <div className="px-4 md:px-8 py-12 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl rounded-3xl overflow-hidden relative h-[350px] md:h-[450px] shadow-[0_8px_30px_rgba(180,141,89,0.3)] border border-[#b48d59]/20"
      >
        <img 
          src="https://images.unsplash.com/photo-1603496987674-79600a000f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kaSUyMGNoaWNrZW4lMjByaWNlJTIwYXJhYmljJTIwZm9vZHxlbnwxfHx8fDE3ODIyNzc2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080" 
          alt="Mandi Chicken"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#5e152e]/90 via-[#5e152e]/40 to-transparent flex flex-col items-center justify-end pb-12">
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="mt-[-60px] relative z-10 text-center bg-[#F5F2E8] text-[#5e152e] rounded-3xl shadow-[0_10px_40px_rgba(180,141,89,0.4)] max-w-3xl border-2 border-[#b48d59]/30 mx-4 px-[39px] py-[15px]"
      >
        <h1 className="text-3xl md:text-5xl font-black mb-4 font-['Cairo'] tracking-tight">أهلاً بكم في مطعم بيت المندي</h1>
        <p className="text-[#6a1a36] mb-8 text-lg md:text-xl font-medium">بيت المندي بيت الجميع - المنيو الرقمي</p>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0 4px 15px rgba(180,141,89,0.5)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#b48d59] text-white hover:bg-[#c9a16c] transition-colors px-10 py-3 rounded-full font-bold text-lg shadow-lg"
        >
          قائمة الطعام
        </motion.button>
      </motion.div>
    </div>
  );
}
