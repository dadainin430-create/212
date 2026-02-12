
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../App';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Monitor, Activity } from 'lucide-react';

const Labs: React.FC = () => {
  const { labs, lang } = useApp();

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-32">
        <header className="mb-32 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-blue-700 font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Facility Overview</span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 uppercase">
              {lang === 'ko' ? '연구소 시설' : 'The Facilities'}
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-xl font-light leading-relaxed">
              {lang === 'ko' 
                ? 'DESSERTOPIA는 감각 데이터의 수집, 합성, 분석을 위한 세 개의 독립된 핵심 연구 구역으로 구성됩니다.' 
                : 'DESSERTOPIA consists of three independent core research zones for the collection, synthesis, and analysis of sensory data.'}
            </p>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {labs.map((lab, idx) => (
            <motion.div 
              key={lab.id} 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col group"
            >
              <Link to={`/labs/${lab.id}`} className="block relative aspect-[4/5] overflow-hidden bg-gray-100 mb-8 rounded-sm">
                <img 
                  src={lab.images[0]} 
                  alt={lab.name_ko} 
                  className="w-full h-full object-cover brightness-90 group-hover:scale-110 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <span className="text-white text-xs font-bold tracking-[0.3em] uppercase opacity-60">FACILITY_{idx + 1}</span>
                </div>
              </Link>
              
              <div className="space-y-6 flex-1 flex flex-col">
                <div>
                  <h2 className="text-3xl font-black tracking-tight mb-2 uppercase group-hover:text-blue-700 transition-colors">
                    {lang === 'ko' ? lab.name_ko : lab.name_en}
                  </h2>
                  <p className="text-blue-600 font-mono text-xs font-bold tracking-widest uppercase mb-4">{lab.englishName}</p>
                </div>
                
                <p className="text-gray-500 text-lg leading-relaxed font-light flex-1">
                  {lang === 'ko' ? lab.description_ko : lab.description_en}
                </p>

                <div className="pt-8">
                  <Link 
                    to={`/labs/${lab.id}`} 
                    className="inline-flex items-center text-xs font-black uppercase tracking-[0.2em] border-b-2 border-black group-hover:border-blue-700 group-hover:text-blue-700 pb-2 transition-all"
                  >
                    {lang === 'ko' ? '실험실 상세 보기' : 'VIEW DETAILS'} <ArrowRight className="ml-3" size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Labs;
