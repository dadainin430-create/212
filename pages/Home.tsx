
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../App';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const { config, lang, news } = useApp();
  const latestResearch = news.slice(0, 3);

  return (
    <div className="bg-white">
      {/* Main Hero Slider Area */}
      <section className="relative h-[85vh] overflow-hidden flex items-center">
        <div className="absolute inset-0">
          <img src={config.introImage} className="w-full h-full object-cover brightness-50" alt="Hero" />
        </div>
        <div className="max-w-7xl mx-auto px-4 w-full relative z-10 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight mb-8 max-w-4xl">
              {lang === 'ko' ? config.introTitle_ko : config.introTitle_en}
            </h1>
            <p className="text-lg md:text-xl opacity-80 max-w-3xl font-light leading-relaxed mb-12 whitespace-pre-wrap">
              {lang === 'ko' ? config.introDesc_ko : config.introDesc_en}
            </p>
            <div className="flex space-x-4">
              <Link to="/labs" className="px-10 py-5 bg-blue-700 text-white font-bold tracking-widest uppercase flex items-center hover:bg-white hover:text-blue-700 transition-all">
                {lang === 'ko' ? '자세히 보기' : 'LEARN MORE'} <ChevronRight className="ml-2" size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Corporate Summary Section (Identity) */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-blue-700 font-bold uppercase tracking-[0.3em] text-sm mb-4 block">Our Identity</span>
            <h2 className="text-5xl font-black tracking-tighter mb-8">
              {lang === 'ko' ? config.homeIdentityTitle_ko : config.homeIdentityTitle_en}
            </h2>
            <p className="text-gray-500 text-lg font-light leading-relaxed mb-10">
              {lang === 'ko' ? config.homeIdentityDesc_ko : config.homeIdentityDesc_en}
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-10">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">FOUNDED</p>
                <p className="text-xl font-bold">{config.homeIdentityFounded}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">LOCATION</p>
                <p className="text-xl font-bold">{config.homeIdentityLocation}</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 aspect-video relative overflow-hidden shadow-2xl">
             <img src={config.homeIdentityImg} className="w-full h-full object-cover" alt="Identity" />
             <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-900 text-white py-32">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: config.homeStat1Label, value: config.homeStat1Value },
            { label: config.homeStat2Label, value: config.homeStat2Value },
            { label: config.homeStat3Label, value: config.homeStat3Value },
            { label: config.homeStat4Label, value: config.homeStat4Value }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <p className="text-5xl font-black tracking-tighter text-blue-500">{item.value}</p>
              <p className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* From Our Blog Section */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
         <div className="flex justify-between items-end mb-16">
            <div>
               <h2 className="text-4xl font-black tracking-tighter uppercase">
                 {lang === 'ko' ? config.homeResearchTitle_ko : config.homeResearchTitle_en}
               </h2>
               <p className="text-gray-400">
                 {lang === 'ko' ? config.homeResearchDesc_ko : config.homeResearchDesc_en}
               </p>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestResearch.map((item) => (
              <BlogCard 
                key={item.id}
                title={lang === 'ko' ? item.title_ko : item.title_en} 
                date={item.date} 
                tag={item.tag} 
                image={item.image}
              />
            ))}
         </div>
      </section>
    </div>
  );
};

const BlogCard = ({ title, date, tag, image }: any) => (
  <div className="group cursor-pointer">
    <div className="aspect-[3/2] bg-gray-100 overflow-hidden mb-6 relative">
      <img src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={title} />
      <div className="absolute inset-0 bg-blue-700/0 group-hover:bg-blue-700/10 transition-colors"></div>
    </div>
    <div className="space-y-2">
      <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">{tag}</span>
      <h3 className="text-xl font-bold group-hover:underline">{title}</h3>
      <p className="text-sm text-gray-400 font-mono">{date}</p>
    </div>
  </div>
);

export default Home;
