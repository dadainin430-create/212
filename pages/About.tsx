
import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../App';

const About: React.FC = () => {
  const { config, lang } = useApp();

  return (
    <div className="bg-white">
      {/* Intro Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
          <span className="text-blue-700 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">01 Introduction</span>
          <h2 className="text-5xl font-black mb-8 tracking-tighter">{lang === 'ko' ? '연구소 소개' : 'About Lab'}</h2>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            {lang === 'ko' ? config.aboutIntro_ko : config.aboutIntro_en}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}>
          <img src={config.aboutIntroImg} className="w-full h-[500px] object-cover shadow-2xl" alt="Intro" />
        </motion.div>
      </section>

      {/* Purpose Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="lg:order-2">
            <img src={config.aboutPurposeImg} className="w-full h-[500px] object-cover shadow-2xl" alt="Purpose" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="lg:order-1">
            <span className="text-blue-700 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">02 Purpose</span>
            <h2 className="text-5xl font-black mb-8 tracking-tighter">{lang === 'ko' ? '연구소 목적' : 'Our Purpose'}</h2>
            <p className="text-xl text-gray-500 font-light leading-relaxed">
              {lang === 'ko' ? config.aboutPurpose_ko : config.aboutPurpose_en}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
          <span className="text-blue-700 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">03 Vision</span>
          <h2 className="text-5xl font-black mb-8 tracking-tighter">{lang === 'ko' ? '연구소 비전' : 'Future Vision'}</h2>
          <p className="text-xl text-gray-500 font-light leading-relaxed">
            {lang === 'ko' ? config.aboutVision_ko : config.aboutVision_en}
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}>
          <img src={config.aboutVisionImg} className="w-full h-[500px] object-cover shadow-2xl" alt="Vision" />
        </motion.div>
      </section>
    </div>
  );
};

export default About;
