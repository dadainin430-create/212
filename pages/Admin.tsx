
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../App';
import { 
  Save, Users, FlaskRound, Palette, Globe, Image as ImageIcon, Info, 
  Database, Target, Shield, BookOpen, Lock, ShieldCheck, Edit3, X, 
  ShieldAlert, Loader2, FileText, Plus, Trash2, ChevronDown, ChevronUp,
  Layout, BarChart3, Quote
} from 'lucide-react';

const Admin: React.FC = () => {
  const { config, setConfig, staff, setStaff, labs, setLabs, phases, setPhases, lang } = useApp();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [localConfig, setLocalConfig] = useState(config);
  const [localStaff, setLocalStaff] = useState(staff);
  const [localLabs, setLocalLabs] = useState(labs);
  const [localPhases, setLocalPhases] = useState(phases);
  
  const [activeTab, setActiveTab] = useState<'brand' | 'staff' | 'labs' | 'archive'>('brand');
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      if (password === 'dododo1274') {
        setIsAuthenticated(true);
      } else {
        alert(lang === 'ko' ? '비밀번호가 일치하지 않습니다.' : 'Invalid password.');
        setPassword('');
      }
      setIsProcessing(false);
    }, 1000);
  };

  const handleSave = () => {
    setConfig(localConfig);
    setStaff(localStaff);
    setLabs(localLabs);
    setPhases(localPhases);
    alert(lang === 'ko' ? '영구적으로 저장되었습니다.' : 'Changes saved permanently.');
  };

  // --- Helpers for Complex Updates ---
  const updatePhase = (phaseId: string, field: string, val: string) => {
    setLocalPhases(prev => prev.map(p => p.id === phaseId ? { ...p, [field]: val } : p));
  };

  const updatePhaseLab = (phaseId: string, labId: string, field: string, val: string) => {
    setLocalPhases(prev => prev.map(p => {
      if (p.id !== phaseId) return p;
      return {
        ...p,
        labs: p.labs.map(l => l.id === labId ? { ...l, [field]: val } : l)
      };
    }));
  };

  const updatePhaseFile = (phaseId: string, labId: string, fileId: string, field: string, val: string) => {
    setLocalPhases(prev => prev.map(p => {
      if (p.id !== phaseId) return p;
      return {
        ...p,
        labs: p.labs.map(l => {
          if (l.id !== labId) return l;
          return {
            ...l,
            files: l.files.map(f => f.id === fileId ? { ...f, [field]: val } : f)
          };
        })
      };
    }));
  };

  const addPhaseFile = (phaseId: string, labId: string) => {
    const newFile = { id: `file-${Date.now()}`, title_ko: '새 파일', title_en: 'New File', url: '#', images: [] };
    setLocalPhases(prev => prev.map(p => {
      if (p.id !== phaseId) return p;
      return {
        ...p,
        labs: p.labs.map(l => l.id === labId ? { ...l, files: [...l.files, newFile] } : l)
      };
    }));
  };

  const removePhaseFile = (phaseId: string, labId: string, fileId: string) => {
    setLocalPhases(prev => prev.map(p => {
      if (p.id !== phaseId) return p;
      return {
        ...p,
        labs: p.labs.map(l => l.id === labId ? { ...l, files: l.files.filter(f => f.id !== fileId) } : l)
      };
    }));
  };

  const updatePhaseFileImages = (phaseId: string, labId: string, fileId: string, images: string[]) => {
    setLocalPhases(prev => prev.map(p => {
      if (p.id !== phaseId) return p;
      return {
        ...p,
        labs: p.labs.map(l => {
          if (l.id !== labId) return l;
          return {
            ...l,
            files: l.files.map(f => f.id === fileId ? { ...f, images } : f)
          };
        })
      };
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-mono">
        <div className="crt-overlay opacity-20 pointer-events-none" />
        <div className="max-w-[500px] w-full bg-black border border-[#00ff41]/20 p-12 shadow-[0_0_80px_rgba(0,255,65,0.05)] relative z-10">
          <div className="text-center space-y-8 mb-12">
            <div className="w-20 h-20 bg-blue-700/5 rounded-full flex items-center justify-center mx-auto border border-blue-700/20 text-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
              <ShieldAlert size={36} />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-black uppercase tracking-widest text-white">ADMIN GATEWAY</h1>
              <div className="h-px w-12 bg-blue-700 mx-auto opacity-40" />
              <p className="text-[#00ff41]/60 text-sm leading-relaxed max-w-[280px] mx-auto font-light">
                여기는 관리인 구역입니다<br />로그인을 통해 시스템을 관리하십시오.
              </p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">Master Authorization Key</label>
              <input 
                type="password" 
                autoFocus
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-white/10 focus:border-blue-700/50 p-5 outline-none transition-all text-white font-mono text-center tracking-[1em] text-xl"
                placeholder="••••••••"
              />
            </div>
            <button 
              type="submit" 
              disabled={isProcessing}
              className="w-full py-6 bg-blue-700 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
            >
              {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'EXECUTE_LOGIN_SEQUENCE'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24 bg-white min-h-screen">
      <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b pb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-black">Institute CMS v9.0</h1>
          <p className="text-gray-400 font-mono text-sm uppercase flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500"/> Master_Control_Dashboard
          </p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => window.location.reload()} className="px-6 py-4 border border-gray-200 text-gray-400 font-bold uppercase tracking-widest hover:bg-gray-50 transition-all text-xs">Reset</button>
           <button onClick={handleSave} className="px-8 py-4 bg-blue-700 text-white font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black transition-all shadow-lg text-xs">
             <Save size={18} /> SAVE ALL CHANGES
           </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-12 bg-gray-50 p-1 border border-gray-100 rounded">
        <TabBtn active={activeTab === 'brand'} label="Main & Branding" icon={<Layout size={16}/>} onClick={() => setActiveTab('brand')} />
        <TabBtn active={activeTab === 'staff'} label="Personnel" icon={<Users size={16}/>} onClick={() => setActiveTab('staff')} />
        <TabBtn active={activeTab === 'labs'} label="Facilities" icon={<FlaskRound size={16}/>} onClick={() => setActiveTab('labs')} />
        <TabBtn active={activeTab === 'archive'} label="Archive CMS" icon={<Database size={16}/>} onClick={() => setActiveTab('archive')} />
      </div>

      <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm rounded-sm min-h-[600px]">
        {/* TAB: BRANDING */}
        {activeTab === 'brand' && (
          <div className="space-y-16 animate-in fade-in duration-500">
             <section className="space-y-8">
               <h3 className="text-xl font-black uppercase tracking-tighter border-b pb-4 flex items-center gap-2"><ImageIcon size={20}/> Hero Section</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AdminInput label="Intro Title (KO)" value={localConfig.introTitle_ko} onChange={v => setLocalConfig({...localConfig, introTitle_ko: v})} />
                  <AdminInput label="Intro Title (EN)" value={localConfig.introTitle_en} onChange={v => setLocalConfig({...localConfig, introTitle_en: v})} />
                  <AdminInput label="Intro Description (KO)" value={localConfig.introDesc_ko} onChange={v => setLocalConfig({...localConfig, introDesc_ko: v})} textarea />
                  <AdminInput label="Intro Description (EN)" value={localConfig.introDesc_en} onChange={v => setLocalConfig({...localConfig, introDesc_en: v})} textarea />
                  <AdminInput label="Main Hero Image URL" value={localConfig.introImage} onChange={v => setLocalConfig({...localConfig, introImage: v})} />
               </div>
             </section>

             <section className="space-y-8 border-t pt-12">
               <h3 className="text-xl font-black uppercase tracking-tighter border-b pb-4 flex items-center gap-2"><BarChart3 size={20}/> Stats & Identity</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <AdminInput label="Stat 1 Value" value={localConfig.homeStat1Value} onChange={v => setLocalConfig({...localConfig, homeStat1Value: v})} />
                  <AdminInput label="Stat 1 Label" value={localConfig.homeStat1Label} onChange={v => setLocalConfig({...localConfig, homeStat1Label: v})} />
                  <AdminInput label="Stat 2 Value" value={localConfig.homeStat2Value} onChange={v => setLocalConfig({...localConfig, homeStat2Value: v})} />
                  <AdminInput label="Stat 2 Label" value={localConfig.homeStat2Label} onChange={v => setLocalConfig({...localConfig, homeStat2Label: v})} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AdminInput label="Identity Title (KO)" value={localConfig.homeIdentityTitle_ko} onChange={v => setLocalConfig({...localConfig, homeIdentityTitle_ko: v})} />
                  <AdminInput label="Identity Title (EN)" value={localConfig.homeIdentityTitle_en} onChange={v => setLocalConfig({...localConfig, homeIdentityTitle_en: v})} />
                  <AdminInput label="Identity Image URL" value={localConfig.homeIdentityImg} onChange={v => setLocalConfig({...localConfig, homeIdentityImg: v})} />
                  <AdminInput label="Founded Date" value={localConfig.homeIdentityFounded} onChange={v => setLocalConfig({...localConfig, homeIdentityFounded: v})} />
               </div>
             </section>

             <section className="space-y-8 border-t pt-12">
               <h3 className="text-xl font-black uppercase tracking-tighter border-b pb-4 flex items-center gap-2"><Info size={20}/> About Page Details</h3>
               <div className="space-y-12">
                  <div className="p-6 bg-gray-50 border border-gray-100">
                    <h4 className="font-bold text-xs uppercase mb-4 text-blue-700">Section 1: Introduction</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AdminInput label="Intro (KO)" value={localConfig.aboutIntro_ko} onChange={v => setLocalConfig({...localConfig, aboutIntro_ko: v})} textarea />
                      <AdminInput label="Intro (EN)" value={localConfig.aboutIntro_en} onChange={v => setLocalConfig({...localConfig, aboutIntro_en: v})} textarea />
                      <AdminInput label="Intro Image" value={localConfig.aboutIntroImg} onChange={v => setLocalConfig({...localConfig, aboutIntroImg: v})} />
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 border border-gray-100">
                    <h4 className="font-bold text-xs uppercase mb-4 text-blue-700">Section 2: Purpose</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AdminInput label="Purpose (KO)" value={localConfig.aboutPurpose_ko} onChange={v => setLocalConfig({...localConfig, aboutPurpose_ko: v})} textarea />
                      <AdminInput label="Purpose (EN)" value={localConfig.aboutPurpose_en} onChange={v => setLocalConfig({...localConfig, aboutPurpose_en: v})} textarea />
                      <AdminInput label="Purpose Image" value={localConfig.aboutPurposeImg} onChange={v => setLocalConfig({...localConfig, aboutPurposeImg: v})} />
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 border border-gray-100">
                    <h4 className="font-bold text-xs uppercase mb-4 text-blue-700">Section 3: Vision</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AdminInput label="Vision (KO)" value={localConfig.aboutVision_ko} onChange={v => setLocalConfig({...localConfig, aboutVision_ko: v})} textarea />
                      <AdminInput label="Vision (EN)" value={localConfig.aboutVision_en} onChange={v => setLocalConfig({...localConfig, aboutVision_en: v})} textarea />
                      <AdminInput label="Vision Image" value={localConfig.aboutVisionImg} onChange={v => setLocalConfig({...localConfig, aboutVisionImg: v})} />
                    </div>
                  </div>
               </div>
             </section>
          </div>
        )}

        {/* TAB: STAFF */}
        {activeTab === 'staff' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {localStaff.map((s) => (
              <div key={s.id} className="p-8 border border-gray-100 bg-gray-50/30 rounded-lg space-y-8">
                <div className="flex items-center gap-6 border-b pb-6">
                  <img src={s.image} className="w-20 h-20 object-cover border-2 border-white shadow-sm" alt="staff" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-2xl font-black uppercase">{s.name_ko} / {s.name_en}</h4>
                      <span className="text-[10px] font-mono text-gray-400">UUID: {s.id}</span>
                    </div>
                    <AdminInput label="Image URL" value={s.image} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, image: v} : st))} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AdminInput label="Name (KO)" value={s.name_ko} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, name_ko: v} : st))} />
                  <AdminInput label="Name (EN)" value={s.name_en} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, name_en: v} : st))} />
                  <AdminInput label="Area (KO)" value={s.area_ko} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, area_ko: v} : st))} />
                  <AdminInput label="Area (EN)" value={s.area_en} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, area_en: v} : st))} />
                  <AdminInput label="Tagline (KO)" value={s.tagline_ko} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, tagline_ko: v} : st))} />
                  <AdminInput label="Tagline (EN)" value={s.tagline_en} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, tagline_en: v} : st))} />
                  <AdminInput label="Auth Level (KO)" value={s.authLevel_ko} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, authLevel_ko: v} : st))} />
                  <AdminInput label="Auth Level (EN)" value={s.authLevel_en} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, authLevel_en: v} : st))} />
                  <AdminInput label="Bio (KO)" value={s.bio_ko} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, bio_ko: v} : st))} textarea />
                  <AdminInput label="Bio (EN)" value={s.bio_en} onChange={v => setLocalStaff(localStaff.map(st => st.id === s.id ? {...st, bio_en: v} : st))} textarea />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: LABS */}
        {activeTab === 'labs' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {localLabs.map((lab) => (
              <div key={lab.id} className="p-8 border border-gray-100 bg-gray-50/30 rounded-lg space-y-8">
                <h4 className="text-2xl font-black uppercase text-blue-700 border-b pb-4">{lab.name_ko} / {lab.name_en}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <AdminInput label="Lab Name (KO)" value={lab.name_ko} onChange={v => setLocalLabs(localLabs.map(l => l.id === lab.id ? {...l, name_ko: v} : l))} />
                   <AdminInput label="Lab Name (EN)" value={lab.name_en} onChange={v => setLocalLabs(localLabs.map(l => l.id === lab.id ? {...l, name_en: v} : l))} />
                   <AdminInput label="English Label" value={lab.englishName} onChange={v => setLocalLabs(localLabs.map(l => l.id === lab.id ? {...l, englishName: v} : l))} />
                   <AdminInput label="Director ID" value={lab.staffId} onChange={v => setLocalLabs(localLabs.map(l => l.id === lab.id ? {...l, staffId: v} : l))} />
                   <AdminInput label="Director Name" value={lab.staffName} onChange={v => setLocalLabs(localLabs.map(l => l.id === lab.id ? {...l, staffName: v} : l))} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <AdminInput label="Intro (KO)" value={lab.description_ko} onChange={v => setLocalLabs(localLabs.map(l => l.id === lab.id ? {...l, description_ko: v} : l))} textarea />
                   <AdminInput label="Intro (EN)" value={lab.description_en} onChange={v => setLocalLabs(localLabs.map(l => l.id === lab.id ? {...l, description_en: v} : l))} textarea />
                   <AdminInput label="Process Detail (KO)" value={lab.details_ko} onChange={v => setLocalLabs(localLabs.map(l => l.id === lab.id ? {...l, details_ko: v} : l))} textarea />
                   <AdminInput label="Process Detail (EN)" value={lab.details_en} onChange={v => setLocalLabs(localLabs.map(l => l.id === lab.id ? {...l, details_en: v} : l))} textarea />
                </div>
                <div className="space-y-4">
                  <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Facility Images (Max 3)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lab.images.map((img, i) => (
                      <div key={i} className="space-y-2">
                        <AdminInput label={`Image ${i+1}`} value={img} onChange={v => {
                          const newImgs = [...lab.images];
                          newImgs[i] = v;
                          setLocalLabs(localLabs.map(l => l.id === lab.id ? {...l, images: newImgs} : l));
                        }} />
                        <img src={img} className="h-20 w-full object-cover border" alt="preview" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB: ARCHIVE (PHASE & FILE CMS) */}
        {activeTab === 'archive' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-10">
               <h3 className="text-xl font-black uppercase tracking-tighter">Archive Intelligence CMS</h3>
               <span className="text-[10px] font-mono text-blue-500 bg-blue-50 px-3 py-1 border border-blue-100">MASTER_STORAGE_VER_3.0</span>
            </div>

            {localPhases.map((phase) => (
              <div key={phase.id} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50/30">
                <button 
                  onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <Database className="text-blue-700" size={20} />
                    <div className="text-left">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block">Sector_Phase</span>
                      <h4 className="text-lg font-black uppercase tracking-tight">{phase.range} : {phase.title_en}</h4>
                    </div>
                  </div>
                  {expandedPhase === phase.id ? <ChevronUp /> : <ChevronDown />}
                </button>

                <AnimatePresence>
                  {expandedPhase === phase.id && (
                    <motion.div 
                      initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 border border-gray-100 rounded">
                           <AdminInput label="Range Display" value={phase.range} onChange={v => updatePhase(phase.id, 'range', v)} />
                           <AdminInput label="Phase Title (KO)" value={phase.title_ko} onChange={v => updatePhase(phase.id, 'title_ko', v)} />
                           <AdminInput label="Phase Title (EN)" value={phase.title_en} onChange={v => updatePhase(phase.id, 'title_en', v)} />
                           <AdminInput label="Description (KO)" value={phase.desc_ko} onChange={v => updatePhase(phase.id, 'desc_ko', v)} textarea />
                           <AdminInput label="Description (EN)" value={phase.desc_en} onChange={v => updatePhase(phase.id, 'desc_en', v)} textarea />
                        </div>

                        <div className="space-y-12">
                           <h5 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 border-l-4 border-blue-700 pl-4">Laboratory Specifics</h5>
                           {phase.labs.map((lab) => (
                             <div key={lab.id} className="bg-white p-8 border border-gray-100 rounded shadow-sm space-y-8">
                                <h6 className="text-lg font-black text-blue-700 uppercase flex items-center gap-2 border-b pb-4">
                                  <FlaskRound size={18}/> {lab.name_ko} / {lab.name_en}
                                </h6>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   <AdminInput label="Lab Name (KO)" value={lab.name_ko} onChange={v => updatePhaseLab(phase.id, lab.id, 'name_ko', v)} />
                                   <AdminInput label="Lab Name (EN)" value={lab.name_en} onChange={v => updatePhaseLab(phase.id, lab.id, 'name_en', v)} />
                                   <AdminInput label="Director (KO)" value={lab.director_ko} onChange={v => updatePhaseLab(phase.id, lab.id, 'director_ko', v)} />
                                   <AdminInput label="Director (EN)" value={lab.director_en} onChange={v => updatePhaseLab(phase.id, lab.id, 'director_en', v)} />
                                   <AdminInput label="Short Intro (KO)" value={lab.intro_ko} onChange={v => updatePhaseLab(phase.id, lab.id, 'intro_ko', v)} textarea />
                                   <AdminInput label="Short Intro (EN)" value={lab.intro_en} onChange={v => updatePhaseLab(phase.id, lab.id, 'intro_en', v)} textarea />
                                   <AdminInput label="Long Detail (KO)" value={lab.detail_ko} onChange={v => updatePhaseLab(phase.id, lab.id, 'detail_ko', v)} textarea />
                                   <AdminInput label="Long Detail (EN)" value={lab.detail_en} onChange={v => updatePhaseLab(phase.id, lab.id, 'detail_en', v)} textarea />
                                </div>

                                <div className="pt-8 space-y-6">
                                   <div className="flex justify-between items-center">
                                      <h6 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2"><FileText size={14}/> Evidence Files</h6>
                                      <button onClick={() => addPhaseFile(phase.id, lab.id)} className="text-[9px] font-black border-2 border-blue-700 text-blue-700 px-3 py-1 flex items-center gap-2 hover:bg-blue-700 hover:text-white transition-all">
                                        <Plus size={10}/> ADD_NEW_FILE
                                      </button>
                                   </div>
                                   
                                   <div className="grid grid-cols-1 gap-6">
                                      {lab.files.map((file) => (
                                        <div key={file.id} className="p-6 bg-gray-50 border border-gray-200 rounded relative group/file">
                                           <button 
                                              onClick={() => removePhaseFile(phase.id, lab.id, file.id)}
                                              className="absolute top-4 right-4 text-red-400 opacity-0 group-hover/file:opacity-100 hover:text-red-600 transition-all"
                                           >
                                              <Trash2 size={16}/>
                                           </button>
                                           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                              <AdminInput label="File Title (KO)" value={file.title_ko} onChange={v => updatePhaseFile(phase.id, lab.id, file.id, 'title_ko', v)} />
                                              <AdminInput label="File Title (EN)" value={file.title_en} onChange={v => updatePhaseFile(phase.id, lab.id, file.id, 'title_en', v)} />
                                              <AdminInput label="Download URL" value={file.url} onChange={v => updatePhaseFile(phase.id, lab.id, file.id, 'url', v)} />
                                           </div>
                                           
                                           <div className="space-y-4">
                                              <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={10}/> Attached Images (Zoomable)</span>
                                                <button 
                                                  onClick={() => updatePhaseFileImages(phase.id, lab.id, file.id, [...file.images, ''])}
                                                  className="text-[9px] font-bold text-gray-400 hover:text-black flex items-center gap-1"
                                                >
                                                  <Plus size={10}/> ADD_IMG
                                                </button>
                                              </div>
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                 {file.images.map((img, i) => (
                                                   <div key={i} className="flex gap-2 items-end">
                                                      <AdminInput label={`Image #${i+1}`} value={img} onChange={v => {
                                                        const n = [...file.images]; n[i] = v; updatePhaseFileImages(phase.id, lab.id, file.id, n);
                                                      }} />
                                                      <button onClick={() => {
                                                        const n = file.images.filter((_, idx) => idx !== i); updatePhaseFileImages(phase.id, lab.id, file.id, n);
                                                      }} className="p-3 text-red-300 hover:text-red-500"><Trash2 size={14}/></button>
                                                   </div>
                                                 ))}
                                              </div>
                                           </div>
                                        </div>
                                      ))}
                                   </div>
                                </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TabBtn = ({ active, label, icon, onClick }: any) => (
  <button onClick={onClick} className={`px-4 py-3 font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 rounded-t-sm ${active ? 'bg-white shadow-sm text-blue-700 border-b-2 border-blue-700' : 'text-gray-400 hover:text-black'}`}>
    {icon} {label}
  </button>
);

const AdminInput = ({ label, value, onChange, textarea }: any) => (
  <div className="space-y-2 group w-full">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-blue-700 transition-colors">{label}</label>
    {textarea ? (
      <textarea 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full p-4 border border-gray-200 text-sm h-32 outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700/10 font-sans leading-relaxed transition-all" 
      />
    ) : (
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full p-4 border border-gray-200 text-sm outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700/10 font-sans transition-all" 
      />
    )}
  </div>
);

export default Admin;
