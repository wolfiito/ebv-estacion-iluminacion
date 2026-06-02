// src/pages/Donate.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Copy, CheckCircle, Info } from 'lucide-react';

export default function Donate() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Mismos datos bancarios
  const bankDetails = {
    bankName: "BANCO DEMO, S.A.",
    accountNumber: "1234 5678 9012",
    clabe: "0123 4567 8901 2345 67",
    beneficiary: "Iglesia Bíblica EBV Iluminación",
    concept: "EBV OFRENDA [Nombre]"
  };

  const handleCopy = (text: string, fieldId: string) => {
    const cleanText = text.replace(/ /g, '');
    navigator.clipboard.writeText(cleanText).then(() => {
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2500);
    });
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative bg-[#0a0a2a] overflow-hidden">
      
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ rotate: [-10, 10, -10], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-20%] left-[20%] w-[400px] h-[60vh] bg-gradient-to-b from-neon-yellow/30 to-transparent blur-[60px] origin-top mix-blend-screen"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-[#05051a] border border-neon-yellow/30 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-[0_0_60px_rgba(248,255,0,0.15)] relative z-10 space-y-6"
      >
        <div className="absolute top-[-20px] right-[-20px] -z-10 opacity-10">
            <Building2 className="h-40 w-40 text-neon-yellow"/>
        </div>
        
        <div className="flex flex-col items-center text-center gap-2 mb-6">
          <Building2 className="h-14 w-14 text-neon-yellow drop-shadow-[0_0_15px_rgba(248,255,0,0.6)]" />
          <h1 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wider mt-2">DATOS BANCARIOS</h1>
          <p className="text-neon-yellow font-semibold">Ofrenda para cubrir costo EBV</p>
        </div>

        <div className="space-y-5 pt-4 border-t border-neon-yellow/10">
            <DetailItem label="BANCO" value={bankDetails.bankName} />
            <DetailItem label="BENEFICIARIO" value={bankDetails.beneficiary} />
            <CopyableItem label="CLABE INTERBANCARIA" value={bankDetails.clabe} isCopied={copiedField === 'clabe'} onCopy={() => handleCopy(bankDetails.clabe, 'clabe')} />
            <CopyableItem label="NÚMERO DE CUENTA" value={bankDetails.accountNumber} isCopied={copiedField === 'acc'} onCopy={() => handleCopy(bankDetails.accountNumber, 'acc')} />
        </div>
        
        <div className="mt-8 bg-black/40 border border-white/10 rounded-2xl p-5 text-center shadow-inner">
            <Info className="h-7 w-7 text-neon-cyan mx-auto mb-2 drop-shadow-[0_0_5px_rgba(0,243,255,0.5)]" />
            <p className="text-sm text-gray-300">Usa este concepto al transferir:</p>
            <p className="font-mono text-lg md:text-xl text-neon-cyan select-all mt-1">{bankDetails.concept}</p>
        </div>
      </motion.div>
    </main>
  );
}

// Componentes auxiliares locales
interface DetailItemProps { label: string; value: string; }
function DetailItem({ label, value }: DetailItemProps) { 
    return ( 
        <div>
            <p className="text-xs text-gray-400 font-bold tracking-widest mb-1">{label}</p>
            <p className="text-xl text-white font-semibold">{value}</p>
        </div> 
    ); 
}

interface CopyableItemProps { label: string; value: string; isCopied: boolean; onCopy: () => void; }
function CopyableItem({ label, value, isCopied, onCopy }: CopyableItemProps) { 
    return ( 
        <div>
            <p className="text-xs text-gray-400 font-bold tracking-widest mb-1">{label}</p>
            <div className="flex items-center justify-between gap-3 bg-black/40 p-2 pl-4 rounded-xl border border-white/5 shadow-inner">
                <p className="text-xl md:text-2xl font-mono text-white font-bold">{value}</p>
                <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    onClick={onCopy} 
                    className={`p-3 rounded-lg transition-colors flex-shrink-0 ${isCopied ? 'bg-green-500/20 text-green-400' : 'bg-neon-yellow/10 text-neon-yellow hover:bg-neon-yellow/20'}`}
                >
                    {isCopied ? <CheckCircle className="h-6 w-6" /> : <Copy className="h-6 w-6" />}
                </motion.button>
            </div>
        </div> 
    ); 
}