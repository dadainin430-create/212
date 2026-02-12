
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../App';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';

const Staff: React.FC = () => {
  const { staff, lang } = useApp();

  return (
    <div className="bg-white min-h-screen">
      {/* Visual Header */}
      <section className="h-[40vh] bg-gray-900 text-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=1200" 
            className="w-full h-full object-cover" 
            alt="Staff header bg" 
          />
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center z-10"
        >
          <span className="text-blue-500 font-bold tracking-[0.4em] uppercase mb-4 block text-xs">
            Professional Personnel
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">
            Our Architects
          </h1>
        </motion.div>
      </section>

      {/* Grid Directory */}
      <div className="max-w-7xl mx-auto px-4 py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {staff.map((member, idx) => (
            <motion.div 
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link to={`/staff/${member.id}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-6 relative">
                  <img 
                    src={member.image} 
                    className="w-full h-full object-cover brightness-90 transition-transform duration-700 group-hover:scale-105" 
                    alt={member.name_ko} 
                  />
                  <div className="absolute inset-0 bg-blue-700/0 group-hover:bg-blue-700/10 transition-colors duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-white/90 backdrop-blur-sm">
                    <p className="text-[10px] font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2">
                       View Dossier <ArrowRight size={12} />
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-400 font-mono text-[10px] uppercase tracking-widest">
                    <Layers size={12} />
                    <span>{lang === 'ko' ? member.area_ko : member.area_en}</span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-blue-700 transition-colors">
                    {lang === 'ko' ? member.name_ko : member.name_en}
                  </h3>
                  <p className="text-sm text-gray-500 font-light line-clamp-1 italic">
                    {lang === 'ko' ? member.tagline_ko : member.tagline_en}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom CTA or Info */}
      <section className="py-24 border-t border-gray-100 bg-gray-50/30">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-400">Collaboration & Ethics</h2>
          <p className="text-lg text-gray-500 font-light leading-relaxed">
            {lang === 'ko' 
              ? '디저토피아의 모든 운영진은 인류의 감각 최적화와 정서적 안녕을 위해 최상의 윤리 규정을 준수하며 연구에 매진하고 있습니다.' 
              : 'All executives at DESSERTOPIA are dedicated to research, adhering to the highest ethical standards for human sensory optimization and emotional well-being.'}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Staff;
