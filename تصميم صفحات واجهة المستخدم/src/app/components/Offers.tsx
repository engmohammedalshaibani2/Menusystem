import React from 'react';
import { motion } from 'motion/react';

export function Offers() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="px-4 md:px-8 py-12 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 mb-8"
      >
        <h2 className="text-3xl font-black font-['Cairo'] border-r-4 border-[#b48d59] pr-4 text-[#F5F2E8]">العروض المميزة</h2>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Offer 1 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(180,141,89,0.4)" }}
          className="relative rounded-3xl overflow-hidden h-56 md:h-72 group cursor-pointer border border-[#b48d59]/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
        >
          <img 
            src="https://images.unsplash.com/photo-1696950169710-bbed68aec0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWF0JTIwbWFuZGklMjBsYW1iJTIwcmljZXxlbnwxfHx8fDE3ODIyNzc2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="وجبة الغداء"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5e152e]/90 via-[#5e152e]/40 to-transparent flex flex-col justify-end p-8">
            <h3 className="text-2xl font-black font-['Cairo'] mb-2 text-[#F5F2E8]">وجبة الغداء</h3>
            <p className="text-base text-[#F5F2E8]/80 font-medium">فقط 45 ر.س - نصف دجاجة مع مشروب غازي</p>
          </div>
        </motion.div>
        
        {/* Offer 2 */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(180,141,89,0.4)" }}
          className="relative rounded-3xl overflow-hidden h-56 md:h-72 group cursor-pointer border border-[#b48d59]/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
        >
          <img 
            src="https://images.unsplash.com/photo-1777199298385-07e46ccc2004?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhlZCUyMGdyaWxsJTIwa2ViYWIlMjBtZWF0fGVufDF8fHx8MTc4MjI3NzY0NXww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="عرض العائلة"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#5e152e]/90 via-[#5e152e]/40 to-transparent flex flex-col justify-end p-8">
            <div className="absolute top-6 right-6 bg-[#b48d59] text-[#F5F2E8] text-sm px-4 py-1.5 rounded-full font-bold shadow-[0_2px_10px_rgba(180,141,89,0.5)]">
              عرض حصري
            </div>
            <h3 className="text-2xl font-black font-['Cairo'] mb-2 text-[#F5F2E8]">عرض العائلة</h3>
            <p className="text-base text-[#F5F2E8]/80 font-medium">خصم 25% - اطلب 3 أصناف واحصل على خصم 25%</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
