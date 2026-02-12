
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { 
  ShieldAlert, ChevronLeft, FileText, Database, Terminal, X, ImageIcon, Maximize2, Lock, Play, AlertTriangle, Loader2
} from 'lucide-react';
import { ArchivePhase, ArchiveLab, ArchiveFile } from '../types';

type SequenceState = 'normal' | 'trigger' | 'narrative' | 'quote';

interface TriggerText {
  id: number;
  text: string;
  x: number;
  y: number;
  size: string;
  rotate: number;
  opacity: number;
  isFlipped: boolean;
  isGlitchy: boolean;
  isFlickering: boolean;
  zIndex: number;
  weight: number;
  glow: string;
  duration: number;
}

const SecretArchive: React.FC = () => {
  const { phases, lang, setAuthorized } = useApp();
  const navigate = useNavigate();
  const [view, setView] = useState<'phase-select' | 'lab-select' | 'lab-detail'>('phase-select');
  const [selectedPhase, setSelectedPhase] = useState<ArchivePhase | null>(null);
  const [selectedLab, setSelectedLab] = useState<ArchiveLab | null>(null);
  const [selectedFile, setSelectedFile] = useState<ArchiveFile | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const [sequence, setSequence] = useState<SequenceState>('normal');
  const [glitchLevel, setGlitchLevel] = useState(0); 
  const [unlockedCount, setUnlockedCount] = useState<number>(() => {
    const saved = localStorage.getItem('unlocked_phase_count');
    return saved ? parseInt(saved, 10) : 1;
  });

  const [visitedLabs, setVisitedLabs] = useState<Set<string>>(new Set());
  const [dwellTime, setDwellTime] = useState(0);
  const DWELL_REQUIRED = 5; 
  const [isUnlocking, setIsUnlocking] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const [showQuoteButton, setShowQuoteButton] = useState(false);
  const [showNarrativeNext, setShowNarrativeNext] = useState(false);
  
  const [triggerTexts, setTriggerTexts] = useState<TriggerText[]>([]);
  const textIdRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  const HORROR_PHRASES = useMemo(() => [
    'Request for Research Termination', '연구 중단 요청드립니다', '연구 중단해주세요',
    'STOP', 'PLEASE STOP', '실험을 멈춰주세요', 'SYSTEM OVERRIDE REQUESTED',
    'DO NOT PROCEED', '중단 권고', 'BREACH', 'HELP ME', 'THEY ARE WATCHING',
    'DATA CORRUPTION', 'ETHICS VIOLATION', 'ABORT', 'FATAL ERROR', 'VOID', 'NO ESCAPE',
    '연구를 멈추십시오', '피실험자 사망 지수 폭발', '통제 불능', 'D-100', 'KILL_PROCESS',
    'LOG_ERROR_999', 'BREACH_DETECTED', 'ACCESS_VIOLATION', 'TERMINATE_IMMEDIATELY',
    'SAVE THEM', 'DARKNESS', 'PLEASE', 'DON\'T LOOK', 'ACCESS DENIED', 'CRITICAL FAILURE'
  ], []);

  const { themeColor, themeRgb } = (() => {
    if (sequence === 'trigger') return { themeColor: '#FF0000', themeRgb: '255, 0, 0' };
    if (!selectedPhase || view === 'phase-select') return { themeColor: '#00ff41', themeRgb: '0, 255, 65' };
    const idx = phases.findIndex(p => p.id === selectedPhase.id);
    if (idx === 0) return { themeColor: '#00ff41', themeRgb: '0, 255, 65' };
    if (idx === 1) return { themeColor: '#00FF66', themeRgb: '0, 255, 102' };
    if (idx === 2) return { themeColor: '#00FFC3', themeRgb: '0, 255, 195' };
    return { themeColor: '#00ff41', themeRgb: '0, 255, 65' };
  })();

  const allLabsVisitedInCurrentPhase = useMemo(() => {
    if (!selectedPhase) return false;
    const isPhase3 = phases.findIndex(p => p.id === selectedPhase.id) === 2;
    if (!isPhase3) return false;
    return selectedPhase.labs.every(lab => visitedLabs.has(lab.id));
  }, [selectedPhase, visitedLabs, phases]);

  useEffect(() => {
    localStorage.setItem('unlocked_phase_count', unlockedCount.toString());
  }, [unlockedCount]);

  useEffect(() => {
    if (view === 'lab-detail' && selectedLab) {
      setVisitedLabs(prev => {
        const next = new Set(prev);
        next.add(selectedLab.id);
        return next;
      });
    }
  }, [view, selectedLab]);

  useEffect(() => {
    let timer: number;
    if (view !== 'phase-select' && selectedPhase) {
      const currentIdx = phases.findIndex(p => p.id === selectedPhase.id);
      if (currentIdx + 1 === unlockedCount && unlockedCount < phases.length) {
        setIsUnlocking(true);
        timer = window.setInterval(() => {
          setDwellTime(prev => {
            if (prev + 1 >= DWELL_REQUIRED) {
              setUnlockedCount(unlockedCount + 1);
              setIsUnlocking(false);
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
    } else {
      setDwellTime(0);
      setIsUnlocking(false);
    }
    return () => clearInterval(timer);
  }, [view, selectedPhase, unlockedCount, phases]);

  useEffect(() => {
    if (view === 'phase-select') {
      setGlitchLevel(0);
    } else if (selectedPhase) {
      setGlitchLevel(phases.findIndex(p => p.id === selectedPhase.id));
    }
  }, [view, selectedPhase, phases]);

  useEffect(() => {
    if (sequence === 'trigger') {
      startTimeRef.current = Date.now();
      const startHorrorAudio = () => {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioCtxRef.current = ctx;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(15, ctx.currentTime);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          osc.connect(gain); gain.connect(ctx.destination);
          osc.start();

          const playNoise = () => {
            if (sequence !== 'trigger') return;
            const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const nGain = ctx.createGain();
            nGain.gain.setValueAtTime(0.1, ctx.currentTime);
            noise.connect(nGain); nGain.connect(ctx.destination);
            noise.start();
            setTimeout(playNoise, Math.random() * 50 + 10);
          };
          playNoise();
        } catch(e) {}
      };
      startHorrorAudio();

      const spawnInterval = setInterval(() => {
        const timeElapsed = (Date.now() - startTimeRef.current) / 1000;
        const batchSize = Math.floor(Math.random() * 6) + Math.min(Math.floor(timeElapsed * 2), 25);
        const newBatch: TriggerText[] = [];

        for (let i = 0; i < batchSize; i++) {
          const isLarge = Math.random() > 0.94;
          const isGlitchy = Math.random() > 0.3;
          const isFlickering = Math.random() > 0.5;
          const weight = Math.random() > 0.5 ? 200 : 400;
          const brightRed = Math.random() > 0.3 ? '#FF0000' : '#800000';
          
          newBatch.push({
            id: textIdRef.current++,
            text: HORROR_PHRASES[Math.floor(Math.random() * HORROR_PHRASES.length)],
            x: Math.random() * 110 - 5,
            y: Math.random() * 110 - 5,
            size: isLarge ? `${Math.random() * 6 + 3}rem` : `${Math.random() * 1.5 + 0.4}rem`,
            rotate: Math.random() * 60 - 30,
            opacity: Math.random() * 0.8 + 0.2,
            isFlipped: Math.random() > 0.9,
            isGlitchy: isGlitchy,
            isFlickering: isFlickering,
            zIndex: Math.floor(Math.random() * 200),
            weight: weight,
            glow: `0 0 ${Math.random() * 15 + 5}px ${brightRed}`,
            duration: Math.random() * 2 + 1
          });
        }
        
        setTriggerTexts(prev => [...prev.slice(-500), ...newBatch]);
      }, 30);

      return () => {
        clearInterval(spawnInterval);
        if (audioCtxRef.current) audioCtxRef.current.close();
      };
    }
  }, [sequence, HORROR_PHRASES]);

  useEffect(() => {
    if (sequence === 'narrative') {
      const timer = setTimeout(() => setShowNarrativeNext(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [sequence]);

  useEffect(() => {
    if (sequence === 'quote') {
      const timer = setTimeout(() => setShowQuoteButton(true), 6000);
      return () => clearTimeout(timer);
    }
  }, [sequence]);

  const handlePhaseSelect = (phase: ArchivePhase, index: number) => {
    if (index >= unlockedCount) {
      alert(lang === 'ko' ? '이전 실험 결과 확인이 필요합니다.' : 'Previous experiment results must be reviewed first.');
      return;
    }
    setSelectedPhase(phase);
    setView('lab-select');
  };

  const handleFileClick = (file: ArchiveFile) => setSelectedFile(file);

  if (sequence === 'trigger') {
    return (
      <div 
        className="fixed inset-0 z-[1000] bg-black overflow-hidden flex items-center justify-center cursor-pointer select-none font-horror"
        onClick={() => {
          setSequence('narrative');
          setShowNarrativeNext(false);
        }}
      >
        <div className="absolute inset-0 animate-intense-flicker pointer-events-none z-[1001] bg-red-950/10" />
        <div className="absolute inset-0 animate-global-shake pointer-events-none z-[1002]" />
        
        <div className="relative w-full h-full z-[1005]">
          {triggerTexts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: t.opacity, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className={`absolute uppercase whitespace-nowrap pointer-events-none leading-none 
                ${t.isGlitchy ? 'animate-text-glitch' : ''} 
                ${t.isFlickering ? 'animate-text-flicker-heavy' : ''} 
                ${Math.random() > 0.8 ? 'animate-text-break' : ''}`}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                fontSize: t.size,
                fontWeight: t.weight,
                color: '#FF0000',
                transform: `rotate(${t.rotate}deg) ${t.isFlipped ? 'scaleX(-1)' : ''}`,
                zIndex: t.zIndex,
                textShadow: t.glow,
                filter: Math.random() > 0.7 ? 'blur(1px)' : 'none'
              }}
            >
              {t.text}
            </motion.div>
          ))}
        </div>
        
        <div className="absolute inset-0 pointer-events-none z-[1006] animate-heavy-noise opacity-30 mix-blend-screen" />
        <div className="absolute inset-0 pointer-events-none z-[1007] bg-gradient-to-t from-black via-transparent to-black" />
        <div className="absolute inset-0 pointer-events-none z-[1008] opacity-30 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)]" />
      </div>
    );
  }

  if (sequence === 'narrative') {
    return (
      <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto text-white select-none selection:bg-white selection:text-black">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 3 }}
          className="max-w-4xl w-full text-center space-y-8 md:space-y-12 leading-relaxed"
        >
          <div className="space-y-6 md:space-y-10">
            <p className="text-sm md:text-xl font-light">
              디저토피아 연구소는 인간을 가장 쉽고,<br />
              가장 확실하게 이상향(도파민 상태) 에 도달시키기 위해 설립되었습니다.
            </p>

            <p className="text-sm md:text-xl font-light">
              연구소는 행복을 단순한 정신적 개념이 아닌,<br />
              화학적으로 재현 가능한 구조로 정의했습니다.  그리고 그 구조를 가장 순수하게 구현할 수 있는 매개체가 디저트라고 판단했습니다.
            </p>

            <p className="text-sm md:text-xl font-light">
              초기 실험에서는 디저트 섭취만으로도 목표 감정 상태에 쉽게 도달할 수 있었습니다.<br />
              그러나 실험이 반복될수록 감정은 점점 불안정해졌고,<br />
              그 조절은 더 이상 유지되지 않았습니다.
            </p>

            <p className="text-base md:text-2xl font-bold tracking-widest pt-4 md:pt-8 uppercase">
              디저토피아는 디저트(Dessert)와 유토피아(Utopia)의 합성어입니다.
            </p>

            <p className="text-sm md:text-xl font-light italic opacity-80">
              디저트를 통해 쉽게 이상적인 상태에 도달하려 했지만, 그 시도는 실패로 끝났습니다.
            </p>

            <p className="text-sm md:text-xl font-light text-red-500 pt-2 md:pt-4">
              결국 디저토피아는 이상향이 아닌,<br />
              불안과 붕괴를 떠올리게 하는 디스토피아를 연상시키는 이름으로 남았습니다.
            </p>
          </div>

          <AnimatePresence>
            {showNarrativeNext && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                onClick={() => setSequence('quote')}
                className="mt-10 md:mt-16 px-10 md:px-14 py-4 md:py-6 border border-white/40 text-white hover:bg-white hover:text-black transition-all text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase bg-black"
              >
                [ NEXT ]
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  if (sequence === 'quote') {
    return (
      <div className="fixed inset-0 z-[1000] bg-black flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden font-horror">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 4 }} className="w-full max-w-5xl flex flex-col items-center space-y-12 md:space-y-16">
          <div className="flex flex-col items-center space-y-10 md:space-y-14 w-full">
            <div 
              className="text-red-600 text-[11px] sm:text-[18px] md:text-2xl font-light tracking-[0.1em] leading-[1.8] flex flex-col items-center"
              style={{ textShadow: '0 0 18px rgba(255, 0, 0, 0.9), 0 0 6px rgba(255, 0, 0, 0.6)' }}
            >
              <span>Hell on earth has always been created</span>
              <span>when humans tried to build their own heaven.</span>
            </div>
            
            <div 
              className="text-red-600 text-[11px] sm:text-[18px] md:text-2xl font-light tracking-[0.1em] leading-[1.8] flex flex-col items-center"
              style={{ textShadow: '0 0 18px rgba(255, 0, 0, 0.9), 0 0 6px rgba(255, 0, 0, 0.6)' }}
            >
              <span>지구상에 지옥이 만들어졌던 것은</span>
              <span>항상 인간이 자신들의 천국을 만들려고 할 때였다.</span>
            </div>
          </div>
          
          <p className="text-red-950 text-[9px] font-mono tracking-[1em] uppercase pt-16 border-t border-red-950/20 w-48 mx-auto">
            — DESSERTOPIA Final Ethics Report —
          </p>
        </motion.div>
        
        <AnimatePresence>
          {showQuoteButton && (
            <motion.button 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              onClick={() => { setAuthorized(false); navigate('/'); }} 
              className="mt-28 px-14 py-7 border border-red-950 text-red-950 hover:text-red-600 hover:border-red-600 transition-all text-[10px] font-mono tracking-[0.6em] uppercase bg-black hover:bg-red-950/5"
            >
              [ REBOOT SYSTEM ]
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div 
      style={{ '--theme-color': themeColor, '--theme-rgb': themeRgb } as React.CSSProperties} 
      className={`min-h-screen bg-black text-[#00ff41] font-mono flex flex-col relative overflow-hidden ${glitchLevel === 2 ? 'chromatic-aberration' : ''}`}
    >
      <div className="fixed inset-0 z-[300] pointer-events-none overflow-hidden">
        <AnimatePresence>
          {glitchLevel >= 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
              {glitchLevel === 1 && <div className="absolute inset-0 animate-flicker-subtle opacity-15 bg-white/5" />}
              {glitchLevel === 2 && (
                <>
                  <div className="absolute inset-0 animate-heavy-noise opacity-15" />
                  <div className="absolute inset-0 animate-heavy-flicker bg-white/10" />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="crt-overlay pointer-events-none fixed inset-0 z-[60]" />
      <div className="scanline pointer-events-none fixed inset-0 z-[60] opacity-20" />
      
      <header className="h-16 border-b border-[#00ff41]/20 bg-black flex items-center justify-between px-8 z-40 sticky top-0">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-red-500 animate-pulse">
            <ShieldAlert size={18} />
            <span className="text-xs font-black tracking-widest uppercase">RESTRICTED</span>
          </div>
          <div className="h-4 w-px bg-[#00ff41]/20" />
          {isUnlocking && (
            <div className="flex items-center space-x-3 text-[10px] font-bold text-blue-500 animate-pulse">
              <Loader2 size={12} className="animate-spin" />
              <span>ANALYZING_DATA_STREAM ({Math.floor((dwellTime/DWELL_REQUIRED)*100)}%)</span>
            </div>
          )}
        </div>
        <div className="text-[10px] opacity-40 uppercase tracking-widest">INT_9982 // SESSION_ACTIVE</div>
      </header>

      <main className={`flex-1 overflow-y-auto z-10 p-8 md:p-16 custom-scrollbar pb-32 transition-all duration-75 ${glitchLevel === 2 ? 'animate-vibration-heavy' : glitchLevel === 1 ? 'animate-vibration-mild' : ''}`}>
        <AnimatePresence mode="wait">
          {view === 'phase-select' && (
            <motion.div key="phase-select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-7xl mx-auto py-12">
              <h2 className={`text-4xl font-black mb-20 text-center uppercase tracking-[0.2em] border-y border-[#00ff41]/10 py-10 ${glitchLevel === 2 ? 'animate-text-split-heavy' : ''}`}>
                {lang === 'ko' ? '실험 분기 선택' : 'SELECT RESEARCH PHASE'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {phases.map((phase, i) => {
                  const isLocked = i >= unlockedCount;
                  return (
                    <button key={phase.id} onClick={() => handlePhaseSelect(phase, i)} className={`group relative p-10 border transition-all text-left overflow-hidden h-72 flex flex-col justify-between ${isLocked ? 'border-[#00ff41]/10 bg-black/80 cursor-not-allowed grayscale' : 'border-[#00ff41]/30 bg-white/5 hover:bg-[#00ff41]/10 shadow-[0_0_20px_rgba(var(--theme-rgb),0.1)]'}`}>
                       {isLocked && (
                         <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                            <Lock size={40} className="text-red-900 mb-4" />
                            <span className="text-[10px] font-black text-red-900 tracking-widest uppercase">LOCKED_BY_PROTOCOL</span>
                         </div>
                       )}
                       <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                          <Database size={40} />
                       </div>
                       <div className="space-y-2">
                          <span className="text-[10px] font-bold text-white/40 block tracking-widest uppercase">ARCHIVE_LOG_0{i+1}</span>
                          <h3 className={`text-4xl font-black group-hover:translate-x-2 transition-transform ${!isLocked && i === 1 ? 'animate-text-jitter-mild' : !isLocked && i === 2 ? 'animate-text-split-heavy' : ''}`}>{phase.range}</h3>
                       </div>
                       {!isLocked && (
                         <div className="flex items-center space-x-2 text-[10px] font-bold uppercase group-hover:text-white">
                            <Play size={10} fill="currentColor" />
                            <span>DECRYPT</span>
                         </div>
                       )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {(view === 'lab-select' || view === 'lab-detail') && selectedPhase && (
            <motion.div key="lab-content" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="max-w-6xl mx-auto relative">
              {view === 'lab-select' ? (
                <>
                  <button 
                    onClick={() => setView('phase-select')} 
                    className="mb-12 flex items-center text-xl md:text-3xl font-black text-white hover:text-[#00ff41] transition-colors gap-4 uppercase"
                  >
                    <ChevronLeft size={36} /> [ RETURN ]
                  </button>
                  
                  <div className="mb-20 border-l-4 border-[#00ff41] pl-10 py-4">
                    <h1 className={`text-5xl font-black tracking-tighter mb-4 uppercase ${glitchLevel === 2 ? 'animate-text-split-heavy' : glitchLevel === 1 ? 'animate-text-jitter-mild' : ''}`}>
                      {lang === 'ko' ? selectedPhase.title_ko : selectedPhase.title_en}
                    </h1>
                    <p className="text-xl opacity-60 font-light whitespace-pre-wrap leading-relaxed">
                      {lang === 'ko' ? selectedPhase.desc_ko : selectedPhase.desc_en}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {selectedPhase.labs.map((lab) => (
                      <button key={lab.id} onClick={() => { setSelectedLab(lab); setView('lab-detail'); }} className="p-10 border border-[#00ff41]/30 bg-black hover:border-[#00ff41] transition-all group text-left flex flex-col h-[400px] relative overflow-hidden">
                        <div className="mb-10 text-[#00ff41]/40 group-hover:text-[#00ff41]"><Terminal size={32} /></div>
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">{lang === 'ko' ? lab.name_ko : lab.name_en}</h3>
                        <p className="text-sm opacity-60 leading-relaxed italic mb-10 flex-1 font-light">{lang === 'ko' ? lab.intro_ko : lab.intro_en}</p>
                        <div className="pt-6 border-t border-[#00ff41]/10 text-[10px] font-bold group-hover:text-white flex justify-between uppercase">
                          <span>OPEN_DATA</span>
                          <span>&gt;&gt;</span>

                        </div>
                      </button>
                    ))}
                  </div>

                  {glitchLevel === 2 && allLabsVisitedInCurrentPhase && (
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-20 border-4 border-red-900 bg-red-950/20 p-14 text-center group cursor-pointer hover:bg-red-600/30 transition-all relative overflow-hidden animate-vibration-heavy shadow-[0_0_40px_rgba(255,0,0,0.1)]" onClick={() => setSequence('trigger')}>
                      <div className="absolute inset-0 bg-red-600/5 animate-pulse" />
                      <h3 className="text-6xl font-black text-red-600 mb-4 glitch-text" data-text="D+100">D+100</h3>
                      <p className="text-red-500 font-bold tracking-[0.5em] uppercase text-xs">UNAUTHORIZED_ACCESS_DETECTED // BREACH_LEVEL_7</p>
                    </motion.div>
                  )}
                </>
              ) : selectedLab && (
                <>
                  <div className="mb-16 border-b border-[#00ff41]/20 pb-12">
                    <h1 className={`text-4xl font-black mb-6 uppercase tracking-tight ${glitchLevel >= 1 ? 'animate-text-jitter-mild' : ''}`}>{lang === 'ko' ? selectedLab.name_ko : selectedLab.name_en}</h1>
                    <div className="text-lg opacity-80 font-light whitespace-pre-wrap leading-relaxed max-w-4xl">
                      {lang === 'ko' ? selectedLab.detail_ko : selectedLab.detail_en}
                    </div>
                  </div>
                  <div className="space-y-12">
                    {selectedLab.name_ko === '샘플 카탈로그실' || 
                     selectedLab.name_ko === '조합 실험실' || 
                     (glitchLevel === 2 && selectedLab.name_ko === '분석 기록실') ? (
                      <div className="flex flex-col space-y-16">
                        {selectedLab.files.flatMap(file => file.images).map((img, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="w-full relative cursor-zoom-in overflow-hidden shadow-[0_0_50px_rgba(var(--theme-rgb),0.05)]"
                            onClick={() => setZoomedImage(img)}
                          >
                            <img 
                              src={img} 
                              className="w-full h-auto grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-1000" 
                              alt="archive high res" 
                            />
                            <div className="absolute top-8 right-8 p-4 bg-black/60 text-[#00ff41] opacity-0 hover:opacity-100 transition-all backdrop-blur-md">
                              <Maximize2 size={32} />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {selectedLab.files.map(file => (
                          <div 
                            key={file.id} 
                            className="group p-8 border border-[#00ff41]/10 bg-white/5 hover:border-[#00ff41] hover:bg-[#00ff41]/5 flex justify-between items-center transition-all cursor-pointer" 
                            onClick={() => handleFileClick(file)}
                          >
                            <div className="flex items-center space-x-6">
                              <FileText size={24} className="text-[#00ff41]/30 group-hover:text-[#00ff41]" />
                              <span className="text-sm font-bold tracking-tight uppercase">[{lang === 'ko' ? file.title_ko : file.title_en}]</span>
                            </div>
                            <div className="text-[10px] font-black px-8 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all uppercase">DECRYPT</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-20 flex justify-start">
                    <button 
                      onClick={() => setView('lab-select')} 
                      className="flex items-center text-xl md:text-3xl font-black text-white hover:text-[#00ff41] transition-colors gap-4 uppercase"
                    >
                      <ChevronLeft size={36} /> [ BACK ]
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedFile && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[500] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-8 overflow-y-auto custom-scrollbar" 
            onClick={() => setSelectedFile(null)}
          >
            <div className={`max-w-5xl w-full bg-black border border-[#00ff41]/30 p-12 relative my-auto ${glitchLevel === 2 ? 'animate-chromatic' : ''}`} onClick={e => e.stopPropagation()}>
               <button onClick={() => setSelectedFile(null)} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"><X size={32} /></button>
               <h2 className={`text-3xl font-black uppercase text-white mb-12 border-b border-[#00ff41]/10 pb-8 ${glitchLevel >= 1 ? 'animate-text-jitter-mild' : ''}`}>
                 {lang === 'ko' ? selectedFile.title_ko : selectedFile.title_en}
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  {selectedFile.images.map((img, i) => (
                    <div key={i} className="aspect-video bg-white/5 border border-[#00ff41]/20 overflow-hidden flex items-center justify-center group relative cursor-zoom-in" onClick={() => setZoomedImage(img)}>
                      <img src={img} className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-100 transition-all duration-700" alt="intel" />
                      <div className="absolute top-4 right-4 p-2 bg-black/60 text-[#00ff41] opacity-0 group-hover:opacity-100 transition-all"><Maximize2 size={16} /></div>
                    </div>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[600] bg-black/99 overflow-y-auto cursor-zoom-out custom-scrollbar-hide" 
            onClick={() => setZoomedImage(null)}
          >
            <div className="min-h-screen flex items-start justify-center p-0 md:p-12">
               <motion.img 
                  initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                  src={zoomedImage} className="w-full max-w-7xl h-auto" alt="zoomed" 
               />
            </div>
            <div className="fixed top-8 right-8 z-[700] p-4 bg-black/60 backdrop-blur-md rounded-full border border-white/20 text-white/60 hover:text-white transition-all cursor-pointer">
               <X size={32} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="h-12 bg-black border-t border-[#00ff41]/10 flex items-center px-8 text-[9px] font-bold tracking-[0.3em] text-[#00ff41]/30 uppercase overflow-hidden">
        <div className="flex items-center space-x-12 animate-marquee">
          <span>SYSLOG_DECAY: {glitchLevel * 50}%</span>
          <span>WARNING: SYSTEM_OVERHEATING</span>
          <span>MEMORY_INTEGRITY: {glitchLevel === 2 ? 'FAILED' : 'STABLE'}</span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        
        @keyframes vibration-mild { 0%, 100% { transform: translate(0,0); } 92% { transform: translate(1px, 0.5px); } 95% { transform: translate(-1px, -0.5px); } }
        .animate-vibration-mild { animation: vibration-mild 0.5s infinite linear; }

        @keyframes text-jitter-mild { 0%, 93% { transform: translate(0); opacity: 1; } 95% { transform: translate(-2px, 1px); opacity: 0.7; } 97% { transform: translate(2px, -1px); opacity: 0.9; } }
        .animate-text-jitter-mild { animation: text-jitter-mild 2s infinite; }

        @keyframes flicker-subtle { 0%, 100% { filter: brightness(100%); } 96% { filter: brightness(140%); } 98% { filter: brightness(85%); } }
        .animate-flicker-subtle { animation: flicker-subtle 5s infinite; }

        @keyframes intense-flicker { 0%, 100% { opacity: 0; } 50% { opacity: 0.15; } 98% { opacity: 0.05; } }
        .animate-intense-flicker { animation: intense-flicker 0.05s infinite; }

        @keyframes global-shake { 0%, 100% { transform: translate(0,0); } 10% { transform: translate(-2px, 2px); } 20% { transform: translate(2px, -2px); } }
        .animate-global-shake { animation: global-shake 0.1s infinite; }

        @keyframes text-break { 0% { transform: translate(0,0) skewX(0); } 5% { transform: translate(-5px, 2px) skewX(20deg); clip-path: inset(10% 0 80% 0); } 10% { transform: translate(5px, -2px) skewX(-20deg); clip-path: inset(80% 0 10% 0); } 15% { transform: translate(0,0) skewX(0); clip-path: inset(0 0 0 0); } }
        .animate-text-break { animation: text-break 0.4s infinite; }

        @keyframes text-glitch { 
          0% { transform: translate(0,0) skewX(0); } 
          20% { transform: translate(-3px, 1px) skewX(10deg); } 
          40% { transform: translate(3px, -1px) skewX(-10deg); } 
          60% { transform: translate(-2px, 2px) skewX(5deg); clip-path: inset(10% 0 85% 0); } 
          80% { transform: translate(2px, -2px) skewX(-5deg); clip-path: inset(80% 0 10% 0); } 
          100% { transform: translate(0,0) skewX(0); } 
        }
        .animate-text-glitch { animation: text-glitch 0.2s infinite; }

        @keyframes text-flicker-heavy { 
          0%, 100% { opacity: 1; filter: brightness(100%); } 
          33% { opacity: 0.4; filter: brightness(150%); } 
          66% { opacity: 0.8; filter: brightness(50%); } 
          80% { opacity: 0; filter: brightness(0%); }
          90% { opacity: 1; filter: brightness(200%); }
        }
        .animate-text-flicker-heavy { animation: text-flicker-heavy 0.15s infinite; }

        @keyframes vibration-heavy { 0%, 100% { transform: translate(0,0); } 10% { transform: translate(-5px, 3px); } 20% { transform: translate(5px, -3px); } }
        .animate-vibration-heavy { animation: vibration-heavy 0.08s infinite; }

        @keyframes heavy-noise {
          0%, 100% { background-position: 0 0; }
          10% { background-position: -5% -10%; }
          20% { background-position: -15% 5%; }
          30% { background-position: 7% -25%; }
          40% { background-position: 20% 25%; }
          50% { background-position: -25% 10%; }
        }
        .animate-heavy-noise { 
          background: url('https://www.transparenttextures.com/patterns/asfalt-dark.png');
          animation: heavy-noise 0.2s steps(4) infinite;
        }

        .chromatic-aberration::before, .chromatic-aberration::after { content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1000; opacity: 0.4; mix-blend-mode: screen; }
        .chromatic-aberration::before { box-shadow: 4px 0 0 rgba(255, 0, 0, 0.6); animation: rgb-red 0.07s infinite; }
        .chromatic-aberration::after { box-shadow: -4px 0 0 rgba(0, 255, 0, 0.6); animation: rgb-blue 0.07s infinite; }

        @keyframes rgb-red { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(4px, 2px); } }
        @keyframes rgb-blue { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-4px, -2px); } }

        @keyframes heavy-flicker { 0%, 98%, 100% { opacity: 0; } 99% { opacity: 0.5; } }
        .animate-heavy-flicker { animation: heavy-flicker 0.06s infinite; }

        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--theme-color); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default SecretArchive;
