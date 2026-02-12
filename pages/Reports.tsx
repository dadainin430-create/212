
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight, Loader2, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../App';

// Define GreenText as a separate component with optional children to fix TS property missing errors.
const GreenText = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <span className={`text-[#00ff41] ${className}`}>{children}</span>
);

// Define RedText as a separate component with optional children to fix TS property missing errors.
const RedText = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <span className={`text-[#ff0000] ${className}`}>{children}</span>
);

const Reports: React.FC = () => {
  const { setAuthorized, lang } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<'initial' | 'auth' | 'granted'>('initial');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const CORRECT_PWD = '0430'; 

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      if (password === CORRECT_PWD) {
        setStep('granted');
      } else {
        alert(lang === 'ko' ? '잘못된 보안 코드입니다.' : 'Invalid security code.');
        setIsProcessing(false);
        setPassword('');
        setShowHint(true);
      }
    }, 1500);
  };

  const handleFinalConfirm = () => {
    setAuthorized(true);
    navigate('/archive');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative font-mono selection:bg-[#00ff41] selection:text-black">
      {/* CRT Effects */}
      <div className="crt-overlay opacity-40 pointer-events-none" />
      <div className="scanline opacity-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'initial' && (
          <motion.div 
            key="initial" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="text-left max-w-3xl relative z-10 p-8 border border-[#00ff41]/20 bg-black/50 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-4 mb-8 border-b border-[#00ff41]/20 pb-4">
               <RedText><AlertTriangle size={32} /></RedText>
               <h1 className="text-4xl font-black tracking-tighter uppercase">
                 <RedText>{lang === 'ko' ? '접근 제한' : 'ACCESS RESTRICTED'}</RedText>
               </h1>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex flex-col space-y-1">
                <GreenText className="text-xl font-bold">
                  {lang === 'ko' ? '외부인 열람 불가' : 'SECURITY CODE REQUIRED'}
                </GreenText>
                <GreenText className="text-sm opacity-60">
                  {lang === 'ko' ? '보안코드 필요' : 'UNAUTHORIZED ACCESS PROHIBITED'}
                </GreenText>
              </div>

              <div className="text-sm leading-relaxed space-y-6">
                <p>
                  <GreenText>
                    {lang === 'ko' 
                      ? '본 페이지는 디저토피아 연구소 내부 연구 인원만 열람 가능한 분기별 실험 기록을 포함하고 있습니다. 외부인의 무단 접근은 허용되지 않으며, 모든 접속 시도는 자동 기록됩니다.'
                      : 'This page contains quarterly experimental records accessible only to authorized internal members of Dessertopia Lab. Unauthorized access by external individuals is strictly prohibited. All access attempts are automatically logged.'
                    }
                  </GreenText>
                </p>
                
                <p>
                  <GreenText>
                    {lang === 'ko' ? (
                      <>
                        현재 사용자는 임시 내부 <RedText className="font-bold underline">인턴</RedText> 접근 권한으로 분류되었습니다. 계속하려면 인증 코드를 입력하십시오.
                      </>
                    ) : (
                      <>
                        The current user is classified under temporary internal <RedText className="font-bold underline">intern</RedText> access. To proceed, please enter the authentication code.
                      </>
                    )}
                  </GreenText>
                </p>

                <p className="text-xs opacity-70 italic">
                  <RedText>
                    {lang === 'ko'
                      ? '디저토피아 연구소는 무단 접근으로 인해 발생하는 어떠한 결과에 대해서도 책임을 지지 않습니다.'
                      : 'Dessertopia Lab assumes no responsibility for any consequences resulting from unauthorized access.'
                    }
                  </RedText>
                </p>
              </div>
            </div>

            <button 
              onClick={() => setStep('auth')} 
              className="w-full py-5 bg-transparent hover:bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/40 font-bold tracking-widest uppercase transition-all flex items-center justify-center group"
            >
              [ ATTEMPT_AUTHORIZATION ] <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
            </button>
          </motion.div>
        )}

        {step === 'auth' && (
          <motion.div 
            key="auth" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="max-w-[480px] w-full p-1 bg-[#00ff41]/10 rounded-sm relative z-10"
          >
            <div className="bg-black p-10 border border-[#00ff41]/30 relative overflow-hidden">
               <button onClick={() => { setStep('initial'); setShowHint(false); }} className="absolute top-6 right-6 text-[#00ff41]/30 hover:text-[#00ff41] transition-colors">
                  <X size={20} />
               </button>
               
               <div className="flex items-center space-x-3 mb-10">
                  <GreenText className="text-sm font-bold">{">"}_</GreenText>
                  <GreenText className="text-[10px] font-black tracking-[0.2em] uppercase">SYSTEM_AUTH_V2.0</GreenText>
               </div>

               <h2 className="text-2xl font-black text-white mb-10 uppercase tracking-tight">
                 <GreenText>Identity Verification</GreenText>
               </h2>
               
               <form onSubmit={handleAuth} className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[9px] font-bold text-[#00ff41]/50 uppercase tracking-[0.3em]">Enter Security Pin</label>
                     <div className="relative">
                        <input
                          type="password"
                          value={password}
                          autoFocus
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-black border border-[#00ff41]/30 p-5 text-[#00ff41] font-mono text-2xl focus:border-[#00ff41] outline-none transition-all tracking-[0.8em] text-center"
                          placeholder="****"
                        />
                        <div className="absolute inset-0 pointer-events-none border border-[#00ff41]/5 animate-pulse" />
                     </div>
                     {showHint && (
                        <motion.div 
                           initial={{ opacity: 0 }} 
                           animate={{ opacity: 1 }}
                           className="text-center mt-2"
                        >
                           <GreenText className="text-[10px] font-bold opacity-70 tracking-widest uppercase">
                              {lang === 'ko' ? 'HINT : 설립일 4자리' : 'HINT: Date of Establishment (4 digits)'}
                           </GreenText>
                        </motion.div>
                     )}
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full py-5 bg-black border border-[#00ff41] text-[#00ff41] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#00ff41] hover:text-black transition-all flex items-center justify-center"
                  >
                    {isProcessing ? <Loader2 className="animate-spin" size={18} /> : 'EXECUTE_DECRYPTION'}
                  </button>
               </form>
               
               <div className="mt-8 pt-6 border-t border-[#00ff41]/10 flex justify-between items-center opacity-30 text-[8px] font-bold uppercase tracking-widest">
                  <GreenText>STATUS: KEY_PENDING</GreenText>
                  <GreenText>CRYPTO: RSA_4096</GreenText>
               </div>
            </div>
          </motion.div>
        )}

        {step === 'granted' && (
          <motion.div 
            key="granted" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full p-12 bg-black border border-[#00ff41] relative z-10 font-mono text-[#00ff41] shadow-[0_0_50px_rgba(0,255,65,0.05)]"
          >
             <div className="flex items-center space-x-4 mb-10">
                <CheckCircle2 size={32} className="text-[#00ff41]" />
                <h1 className="text-3xl font-black tracking-tighter uppercase">ACCESS GRANTED</h1>
             </div>
             
             <div className="space-y-6 mb-12 text-sm">
                <p className="font-bold border-b border-[#00ff41]/20 pb-4 text-xl">
                  DESSERTOPIA ARCHIVE SYSTEM<br />
                  <span className="text-[10px] opacity-50 uppercase tracking-[0.4em]">Internal Review Only</span>
                </p>
                <div className="leading-relaxed font-light opacity-90 space-y-2">
                  <p>접근 권한이 임시 승인되었습니다.</p>
                  <p>귀하는 <RedText className="underline font-bold">INTERN_LEVEL_B</RedText>로 시스템에 접속하였습니다.</p>
                  <p>모든 데이터 열람 활동은 중앙 서버에 실시간 아카이빙됩니다.</p>
                </div>
             </div>

             <button 
               onClick={handleFinalConfirm}
               className="w-full py-5 bg-[#00ff41] text-black font-black uppercase tracking-[0.3em] text-xs hover:bg-white transition-all flex items-center justify-center"
             >
               [ ENTER_SECURE_VAULT ]
             </button>

             <div className="absolute bottom-4 right-6 opacity-20 text-[8px]">
                SECURE_CONNECTION: ESTABLISHED
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Reports;
