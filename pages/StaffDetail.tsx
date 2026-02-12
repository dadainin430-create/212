
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../App';
import { ArrowLeft, Award, BookOpen, Target, Shield } from 'lucide-react';

const StaffDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { staff, lang } = useApp();
  const member = staff.find(s => s.id === id);

  if (!member) return <div className="py-24 text-center">Researcher Not Found</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <Link to="/staff" className="inline-flex items-center text-gray-400 hover:text-black mb-12 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft className="mr-2" size={16} /> Back to Directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-[4/5] overflow-hidden bg-gray-100 shadow-2xl"
          >
            <img 
              src={member.image} 
              alt={lang === 'ko' ? member.name_ko : member.name_en} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <span className="text-blue-700 font-bold tracking-widest text-[10px] uppercase block mb-4">Personnel Dossier</span>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none">
                {lang === 'ko' ? member.name_ko : member.name_en}
              </h1>
              <p className="text-xl text-gray-400 font-light mt-4 italic">
                {lang === 'ko' ? member.tagline_ko : member.tagline_en}
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="p-3 bg-gray-50 text-blue-700 border border-blue-100"><Target size={20} /></div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-1">Primary Field</h3>
                  <p className="text-xl font-bold">{lang === 'ko' ? member.area_ko : member.area_en}</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="p-3 bg-gray-50 text-blue-700 border border-blue-100"><BookOpen size={20} /></div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-1">Full Biography</h3>
                  <p className="text-gray-500 leading-relaxed font-light">
                    {lang === 'ko' ? member.bio_ko : member.bio_en}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="p-3 bg-gray-50 text-blue-700 border border-blue-100"><Shield size={20} /></div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-1">Authorization Level</h3>
                  <p className="text-xl font-bold text-blue-900">
                    {lang === 'ko' ? member.authLevel_ko : member.authLevel_en}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex items-center gap-2">
              <Award className="text-blue-700" size={16} />
              <p className="text-xs font-mono text-gray-300 uppercase tracking-[0.3em]">Signature Verified: ✅ DIGITAL_CERT_88102</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;
