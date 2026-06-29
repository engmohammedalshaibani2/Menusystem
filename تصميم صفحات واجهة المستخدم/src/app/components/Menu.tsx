import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const categories = ["الكل", "مندي", "مشاوي", "سلطات", "مقبلات", "حلويات", "مشروبات"];

const menuItems = [
  {
    id: 1,
    title: "مشكل مشاوي - طبق",
    description: "قطعة لحم ضأن طرية مع أرز صغير",
    price: "45 ر.س",
    image: "https://images.unsplash.com/photo-1777199298385-07e46ccc2004?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXhlZCUyMGdyaWxsJTIwa2ViYWIlMjBtZWF0fGVufDF8fHx8MTc4MjI3NzY0NXww&ixlib=rb-4.1.0&q=80&w=1080",
    category: "مشاوي"
  },
  {
    id: 2,
    title: "مندي لحم - نفر",
    description: "قطعة لحم ضأن طرية مع أرز",
    price: "65 ر.س",
    image: "https://images.unsplash.com/photo-1696950169710-bbed68aec0e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWF0JTIwbWFuZGklMjBsYW1iJTIwcmljZXxlbnwxfHx8fDE3ODIyNzc2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "مندي"
  },
  {
    id: 3,
    title: "مندي دجاج - نصف حبة",
    description: "نصف دجاجة مع أرز بسمتي فاخر",
    price: "45 ر.س",
    image: "https://images.unsplash.com/photo-1603496987674-79600a000f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5kaSUyMGNoaWNrZW4lMjByaWNlJTIwYXJhYmljJTIwZm9vZHxlbnwxfHx8fDE3ODIyNzc2NDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    category: "مندي"
  }
];

export function Menu() {
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filteredItems = activeCategory === "الكل" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="px-4 md:px-8 py-12 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex items-center gap-2 mb-8"
      >
        <h2 className="text-3xl font-black font-['Cairo'] border-r-4 border-[#b48d59] pr-4 text-[#F5F2E8]">قائمة الطعام</h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap gap-3 mb-10"
      >
        {categories.map((cat) => (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-2.5 rounded-full border-2 transition-all font-bold ${
              activeCategory === cat 
                ? "bg-[#F5F2E8] text-[#5e152e] border-[#F5F2E8] shadow-[0_4px_15px_rgba(180,141,89,0.4)]" 
                : "border-[#b48d59]/40 text-[#F5F2E8] hover:bg-[#b48d59]/20"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </motion.div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id} 
              className="bg-[#F5F2E8] rounded-3xl overflow-hidden flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-[#b48d59]/20 hover:shadow-[0_12px_40px_rgba(180,141,89,0.3)] transition-shadow duration-300"
            >
              <div className="p-5 flex-grow">
                <div className="rounded-2xl overflow-hidden mb-5 h-56 relative group">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>
                <h3 className="text-[#5e152e] text-2xl font-black font-['Cairo'] mb-2 text-center">{item.title}</h3>
                <p className="text-[#6a1a36]/80 text-base text-center mb-5 min-h-[48px] font-medium">{item.description}</p>
                <div className="text-center text-[#b48d59] font-black text-2xl mb-4">{item.price}</div>
              </div>
              <div className="p-5 pt-0">
                
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
