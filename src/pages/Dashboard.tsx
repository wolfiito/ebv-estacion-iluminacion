import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { RotateCw, AlertTriangle, Filter, Baby, Venus, Target, TrendingUp, Building2, Copy, CheckCircle, Info, QrCode, X } from 'lucide-react';
import { useRegistrations } from '../hooks/useRegistrations';
import { EBV_COST_PER_CHILD } from '../lib/constants';

const containerVariants: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };
const itemVariants: Variants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } } };
const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }
};

export default function Dashboard() {
  const { stats, ageRanges, loading, error } = useRegistrations();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showBankModal, setShowBankModal] = useState(false);

  const percentageCollected = stats.totalNeeded > 0 ? Math.round((stats.totalCollected / stats.totalNeeded) * 100) : 0;
  const percentageMissing = 100 - percentageCollected;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const bankDetails = {
    bankName: "BANCO DEMO, S.A.",
    accountNumber: "1234 5678 9012",
    clabe: "0123 4567 8901 2345 67",
    beneficiary: "Iglesia Bíblica EBV Iluminación",
    concept: "EBV OFRENDA"
  };

  const qrUrl = useMemo(() => {
    // window.location.origin te dará "http://localhost:5173" en desarrollo 
    // y "https://tu-dominio.com" cuando lo subas a producción.
    return `${window.location.origin}/ofrenda`;
  }, []);

  const handleCopy = (text: string, fieldId: string) => {
    const cleanText = text.replace(/ /g, '');
    navigator.clipboard.writeText(cleanText).then(() => {
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2500);
    });
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
      
      {loading && (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4">
          <RotateCw className="h-12 w-12 text-neon-cyan animate-spin" />
          <p className="text-neon-cyan font-semibold text-lg tracking-widest font-orbitron">ILUMINANDO MÉTRICAS...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/60 border border-red-500 rounded-2xl p-6 text-center text-red-200 flex flex-col items-center gap-4 shadow-lg mx-auto max-w-xl">
          <AlertTriangle className="h-16 w-16 text-red-400" />
          <h2 className="text-2xl font-bold">¡Oops! Algo salió mal</h2>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={Baby} label="NIÑOS INSCRITOS" value={stats.totalChildren} color="text-neon-cyan" borderColor="border-neon-cyan/20" bgColor="bg-neon-cyan/5" note={`${formatCurrency(EBV_COST_PER_CHILD)} / niño`} pulse/>
            <StatCard icon={Target} label="META TOTAL NECESARIA" value={formatCurrency(stats.totalNeeded)} color="text-white" borderColor="border-white/20" bgColor="bg-white/5" />
            <StatCard icon={TrendingUp} label="MONTO RECAUDADO" value={formatCurrency(stats.totalCollected)} color="text-green-400" borderColor="border-green-400/20" bgColor="bg-green-400/5" />
          </section>

          <motion.section variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
             <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-10 items-center">
                <div className="text-center relative order-1">
                    <motion.p animate={{ textShadow: ["0 0 10px #fff", "0 0 30px #4ade80", "0 0 10px #fff"] }} transition={{ duration: 2, repeat: Infinity }} className="font-orbitron text-9xl md:text-[10rem] font-bold text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                        {percentageCollected}<span className="text-5xl md:text-8xl text-gray-500">%</span>
                    </motion.p>
                    <p className="text-4xl font-bold text-green-400 tracking-wider -mt-6">RECAUDADO</p>
                    <p className="text-xl text-gray-300 mt-3 max-w-sm mx-auto">Ya cubrimos <span className="text-green-400 font-bold">{formatCurrency(stats.totalCollected)}</span> de <span className="text-white font-bold">{formatCurrency(stats.totalNeeded)}</span></p>
                </div>

                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowBankModal(true)}
                    className="order-3 lg:order-2 bg-white p-4 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] cursor-pointer mx-auto lg:mx-0 relative group"
                >
                    <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}`} 
                        alt="QR Bancario" 
                        className="rounded-xl w-[150px] h-[150px]"
                    />
                    <div className="absolute inset-0 bg-neon-yellow/90 rounded-3xl flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <QrCode className="h-10 w-10 text-black"/>
                        <p className="text-black font-bold text-center text-sm px-4">CLIC PARA <br/> DATOS BANCARIOS</p>
                    </div>
                </motion.div>

                <div className="space-y-8 order-2 lg:order-3">
                    <div className="bg-black/30 border border-white/10 rounded-2xl p-6 flex gap-2 justify-around text-center shadow-inner relative overflow-hidden">
                        <div><Baby className="h-8 w-8 text-neon-cyan mx-auto drop-shadow-md" /><p className="text-4xl font-bold text-white mt-1">{stats.totalBoys}</p><p className="text-sm text-gray-400 font-semibold tracking-wider">NIÑOS</p></div>
                        <div className="border-l border-white/10 h-16 self-center"/>
                        <div><Venus className="h-8 w-8 text-neon-purple mx-auto drop-shadow-md" /><p className="text-4xl font-bold text-white mt-1">{stats.totalGirls}</p><p className="text-sm text-gray-400 font-semibold tracking-wider">NIÑAS</p></div>
                    </div>
                    <div className="bg-red-950/40 border border-red-500 rounded-2xl p-6 text-center shadow-lg relative overflow-hidden">
                        <motion.p animate={{ scale: [1, 1.05, 1], color: ['#ef4444', '#fca5a5', '#ef4444'] }} transition={{ duration: 2, repeat: Infinity }} className="font-orbitron text-7xl font-bold">{percentageMissing}%</motion.p>
                        <p className="text-xl text-red-200 font-semibold mt-1 tracking-widest">FALTA PARA CUBRIR GASTOS</p>
                        <p className="text-2xl font-bold text-white mt-3">{formatCurrency(stats.totalNeeded - stats.totalCollected)} FALTANTE</p>
                    </div>
                </div>
            </div>
            
            <div className="mt-10 pt-10 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center text-sm"><p className="text-gray-400 font-bold">PROGRESO RECAUDADO EBV</p><p className="font-orbitron text-2xl text-white font-bold">{percentageCollected}%</p></div>
                <div className="w-full h-5 bg-white/5 border border-white/10 rounded-full shadow-inner overflow-hidden relative">
                    <motion.div initial={{ width: '0%' }} animate={{ width: `${percentageCollected}%` }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-green-500 via-green-400 to-green-500 shadow-[0_0_15px_rgba(34,197,94,0.7)] relative"/>
                </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Filter className="h-7 w-7 text-neon-cyan" />
              <h2 className="font-orbitron text-2xl font-bold text-white tracking-wider">PARÁMETROS DE EXPORTACIÓN (EXCEL)</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"> 
              {ageRanges.map((range, index) => (
                <div key={index} className="bg-black/30 border border-white/10 rounded-xl p-6 text-center shadow-inner relative overflow-hidden">
                  <div className="absolute top-[-20px] left-[-10px] font-orbitron text-8xl text-white/5 -z-10">{index + 1}</div>
                  <p className="text-2xl font-bold text-white mb-2">{range.name}</p>
                  <p className="text-4xl font-bold text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]">{range.min} a {range.max}</p>
                  <p className="text-sm text-gray-400 font-semibold mt-1 tracking-widest">AÑOS</p>
                </div>
              ))}
            </div>
          </motion.section>
        </>
      )}

      {/* VENTANA MODAL DATOS BANCARIOS */}
      <AnimatePresence>
        {showBankModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowBankModal(false)}>
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-[#0a0a2a] border border-neon-yellow/30 rounded-3xl p-8 max-w-2xl w-full shadow-[0_0_60px_rgba(248,255,0,0.15)] relative overflow-hidden space-y-6" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setShowBankModal(false)} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors"><X className="h-7 w-7"/></button>
                <div className="absolute top-[-20px] right-[-20px] -z-10 opacity-10"><Building2 className="h-40 w-40 text-neon-yellow"/></div>
                
                <div className="flex items-center gap-4">
                  <Building2 className="h-10 w-10 text-neon-yellow drop-shadow-[0_0_10px_rgba(248,255,0,0.6)]" />
                  <div>
                    <h2 className="font-orbitron text-2xl font-bold text-white tracking-wider">DATOS DE OFRENDA / DONACIÓN</h2>
                    <p className="text-neon-yellow font-semibold mt-1">Cubriendo el costo de los niños</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-neon-yellow/10">
                    <DetailItem label="BANCO" value={bankDetails.bankName} />
                    <DetailItem label="BENEFICIARIO" value={bankDetails.beneficiary} />
                    <CopyableItem label="CLABE INTERBANCARIA" value={bankDetails.clabe} isCopied={copiedField === 'clabe'} onCopy={() => handleCopy(bankDetails.clabe, 'clabe')} />
                    <CopyableItem label="NÚMERO DE CUENTA" value={bankDetails.accountNumber} isCopied={copiedField === 'acc'} onCopy={() => handleCopy(bankDetails.accountNumber, 'acc')} />
                </div>
                
                <div className="mt-6 bg-black/40 border border-white/10 rounded-2xl p-5 text-center shadow-inner">
                    <Info className="h-7 w-7 text-neon-cyan mx-auto mb-2 drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]" />
                    <p className="text-sm text-gray-300">Usa este concepto al transferir:</p>
                    <p className="font-mono text-lg text-neon-cyan select-all mt-1">{bankDetails.concept}</p>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface StatCardProps { icon: React.ElementType; label: string; value: number | string; color: string; borderColor: string; bgColor: string; pulse?: boolean; note?: string; }
function StatCard({ icon: Icon, label, value, color, borderColor, bgColor, pulse, note }: StatCardProps) {
  return (
    <motion.div variants={itemVariants} className={`${bgColor} border ${borderColor} rounded-2xl p-6 flex items-center gap-5 shadow-xl backdrop-blur-sm relative overflow-hidden`}>
      <div className={`p-3 ${bgColor} border ${borderColor} rounded-2xl`}><Icon className={`h-8 w-8 ${color} ${pulse ? 'animate-pulse' : ''} drop-shadow-md`} /></div>
      <div><p className={`text-5xl font-bold text-white drop-shadow-sm`}>{value}</p><p className={`text-sm ${color} font-semibold tracking-wider`}>{label}</p>{note && <p className="text-xs text-gray-500 mt-1">{note}</p>}</div>
    </motion.div>
  );
}
interface DetailItemProps { label: string; value: string; }
function DetailItem({ label, value }: DetailItemProps) { return ( <div><p className="text-xs text-gray-400 font-bold tracking-widest">{label}</p><p className="text-xl text-white font-semibold">{value}</p></div> ); }
interface CopyableItemProps { label: string; value: string; isCopied: boolean; onCopy: () => void; }
function CopyableItem({ label, value, isCopied, onCopy }: CopyableItemProps) { return ( <div><p className="text-xs text-gray-400 font-bold tracking-widest">{label}</p><div className="flex items-center gap-3"><p className="text-2xl font-mono text-white font-bold bg-black/40 px-3 py-1 rounded-lg border border-white/5 shadow-inner">{value}</p><motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onCopy} className={`p-2 rounded-lg transition-colors ${isCopied ? 'bg-green-500/20 text-green-400' : 'bg-neon-yellow/10 text-neon-yellow hover:bg-neon-yellow/20'}`}>{isCopied ? <CheckCircle className="h-6 w-6" /> : <Copy className="h-6 w-6" />}</motion.button></div></div> ); }