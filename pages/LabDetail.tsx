
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../App';
import { ArrowLeft, Activity, ChevronLeft, ChevronRight, User, Target, Info } from 'lucide-react';

const LabDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { labs, staff, lang } = useApp();
  const lab = labs.find(l => l.id === id);
  const [currentImg, setCurrentImg] = useState(0);

  if (!lab) return <div className="py-24 text-center">Facility Not Found</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-24">
        <Link to="/labs" className="inline-flex items-center text-gray-400 hover:text-black mb-12 transition-colors uppercase text-xs font-bold tracking-widest">
          <ArrowLeft className="mr-2" size={16} /> {lang === 'ko' ? '목록으로 돌아가기' : 'Back to Directory'}
        </Link>

        {/* Hero Gallery (3 Images) */}
        <div className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-6">
               <div className="aspect-video relative overflow-hidden bg-black shadow-2xl rounded-sm">
                  <AnimatePresence mode='wait'>
                    <motion.img 
                      key={currentImg} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      exit={{ opacity: 0 }} 
                      src={lab.images[currentImg]} 
                      className="w-full h-full object-cover opacity-90" 
                    />
                  </AnimatePresence>
                  <div className="absolute inset-y-0 left-0 flex items-center px-4">
                     <button onClick={() => setCurrentImg((prev) => (prev - 1 + lab.images.length) % lab.images.length)} className="p-3 bg-white/10 backdrop-blur text-white rounded-full hover:bg-white hover:text-black transition-all"><ChevronLeft size={24} /></button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4">
                     <button onClick={() => setCurrentImg((prev) => (prev + 1) % lab.images.length)} className="p-3 bg-white/10 backdrop-blur text-white rounded-full hover:bg-white hover:text-black transition-all"><ChevronRight size={24} /></button>
                  </div>
                  <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/60 backdrop-blur text-white font-mono text-xs">
                    IMG_FILE_{currentImg + 1} / 03
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                  {lab.images.slice(0, 3).map((img, i) => (
                    <button key={i} onClick={() => setCurrentImg(i)} className={`aspect-[3/2] overflow-hidden border-2 transition-all ${i === currentImg ? 'border-blue-700' : 'border-transparent opacity-60'}`}>
                      <img src={img} className="w-full h-full object-cover" alt={`thumb ${i}`} />
                    </button>
                  ))}
               </div>
            </div>
            
            <div className="lg:col-span-4 space-y-12">
               <div>
                  <span className="text-blue-700 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Facility Intelligence</span>
                  <h1 className="text-5xl font-black tracking-tighter mb-4">{lang === 'ko' ? lab.name_ko : lab.name_en}</h1>
                  <p className="text-gray-400 font-mono text-sm uppercase">{lab.englishName}</p>
               </div>

               <div className="space-y-6">
                  <h3 className="font-bold border-b border-gray-100 pb-2 uppercase tracking-widest text-xs flex items-center gap-2">
                    <User size={14}/> {lang === 'ko' ? '실험실 담당자' : 'Director'}
                  </h3>
                  <Link 
                    to={`/staff/${lab.staffId}`} 
                    className="flex items-center space-x-4 group p-4 border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all rounded-sm"
                  >
                     <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        <User size={24} className="text-gray-400" />
                     </div>
                     <div>
                        <span className="font-black text-xl group-hover:text-blue-700 block transition-colors">{lab.staffName}</span>
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{lang === 'ko' ? '프로필 보기' : 'VIEW DOSSIER'}</span>
                     </div>
                  </Link>
               </div>

               <div className="space-y-6">
                  <h3 className="font-bold border-b border-gray-100 pb-2 uppercase tracking-widest text-xs flex items-center gap-2">
                    <Target size={14}/> {lang === 'ko' ? '연구실 소개' : 'Introduction'}
                  </h3>
                  <p className="text-black leading-relaxed font-medium text-lg">
                    {lang === 'ko' ? lab.description_ko : lab.description_en}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {lab.specs.map((s, i) => (
                    <div key={i} className="bg-gray-50 p-6 border border-gray-100">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{lang === 'ko' ? s.label_ko : s.label_en}</p>
                       <p className="text-xl font-black text-blue-700">{s.value}</p>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Operational Specs (연구실에서 하는 일) */}
        <div className="py-24 border-t border-gray-100">
           <div className="max-w-4xl">
              <h2 className="text-3xl font-black mb-12 flex items-center gap-4 uppercase tracking-tighter">
                <Activity className="text-blue-700" size={32} /> {lang === 'ko' ? '연구실 업무 및 공정' : 'Research Operations'}
              </h2>
              <div className="prose prose-xl max-w-none text-black font-medium leading-loose whitespace-pre-wrap">
                 {lang === 'ko' ? lab.details_ko : lab.details_en}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LabDetail;
