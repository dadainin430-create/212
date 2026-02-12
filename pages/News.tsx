
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../App';
import { X } from 'lucide-react';

const News: React.FC = () => {
  const { news, lang } = useApp();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  return (
    <div className="bg-white min-h-screen py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16">
          <h1 className="text-6xl font-black tracking-tighter uppercase">Article Scraps</h1>
          <p className="text-gray-400 mt-4">Selected scientific reports and press coverage</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {news.map((article) => (
            <motion.div 
              key={article.id} 
              layoutId={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer border border-gray-100 p-6 hover:shadow-xl transition-all"
            >
              <div className="aspect-[3/4] overflow-hidden mb-6 bg-gray-100">
                <img src={article.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={article.title_ko} />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold text-blue-700 uppercase tracking-widest">
                  <span>{article.tag}</span>
                  <span className="text-gray-400">{article.date}</span>
                </div>
                <h2 className="text-2xl font-black tracking-tight leading-tight group-hover:underline">
                  {lang === 'ko' ? article.title_ko : article.title_en}
                </h2>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div 
              layoutId={selectedArticle.id}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto p-12 relative"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedArticle(null)} className="absolute top-8 right-8 text-gray-400 hover:text-black"><X /></button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <img src={selectedArticle.image} className="w-full h-full object-cover" />
                <div className="space-y-8">
                  <div>
                    <p className="text-blue-700 font-bold text-xs uppercase tracking-widest mb-2">{selectedArticle.tag}</p>
                    <h2 className="text-4xl font-black tracking-tight">{lang === 'ko' ? selectedArticle.title_ko : selectedArticle.title_en}</h2>
                    <p className="text-gray-400 mt-2">{selectedArticle.date}</p>
                  </div>
                  <p className="text-lg text-gray-600 leading-loose font-light">
                    {lang === 'ko' ? selectedArticle.content_ko : selectedArticle.content_en}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
