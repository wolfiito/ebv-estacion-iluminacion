import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, UserPlus, Sparkles, Building2, Copy, CheckCircle, Info, Wallet, MessageCircle } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import Confetti from 'react-confetti';
import { type RegistrationFormData } from '../lib/validation';

export default function Success() {
  const location = useLocation();
  const navigate = useNavigate();

  // Estados para manejar el confeti responsivo y su duración
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });
  const confettiRef = useRef<HTMLDivElement>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Mismos datos bancarios
  const bankDetails = {
    bankName: "Banorte",
    clabe: "072180010861095244",
    beneficiary: "Yazary Olvera",
    concept: "Nombre de su hijo o hija"
  };


  const handleCopy = (text: string, fieldId: string) => {
    const cleanText = text.replace(/ /g, '');
    navigator.clipboard.writeText(cleanText).then(() => {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    });
  };

  // Recuperamos datos (solo para el nombre en el PDF opcionalmente, o seguridad)
  const data = location.state?.registrationData as RegistrationFormData | undefined;

  // Práctica de seguridad y manejo de dimensiones de ventana
  useEffect(() => {
    if (!data) {
      setTimeout(() => navigate('/'), 0);
      return;
    }

    // Actualizar dimensiones si cambia el tamaño de pantalla
    const detectSize = () => {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', detectSize);

    // Senior Practice: Detener el confeti después de 6 segundos para ahorrar CPU/Batería
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 6000);

    return () => {
      window.removeEventListener('resize', detectSize);
      clearTimeout(timer);
    };
  }, [data, navigate]);

  if (!data) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  // ACTUALIZA ESTA LÍNEA AÑADIENDO ": Variants"
  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative bg-[#0a0a2a] overflow-hidden" ref={confettiRef}>

      {/* --- CAPA DE ANIMACIONES CHIDAS --- */}

      {/* 1. Confetti (Solo se muestra los primeros segundos) */}
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={showConfetti}
          numberOfPieces={300}
          gravity={0.15}
          // Colores temáticos: Cyan, Morado, Amarillo, Blanco
          colors={['#00f3ff', '#bc13fe', '#f8ff00', '#ffffff']}
          className="z-50" // Por encima de todo al principio
        />
      )}

      {/* 2. Spotlights Potenciados (Más intensos y rápidos para celebración) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ rotate: [-20, 10, -20], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[10%] md:left-[20%] w-[200px] md:w-[400px] h-[70vh] bg-gradient-to-b from-neon-cyan/70 via-neon-cyan/20 to-transparent blur-[50px] origin-top mix-blend-screen"
        />
        <motion.div
          animate={{ rotate: [20, -10, 20], scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[-10%] right-[10%] md:right-[20%] w-[200px] md:w-[400px] h-[70vh] bg-gradient-to-b from-neon-purple/60 via-neon-purple/20 to-transparent blur-[50px] origin-top mix-blend-screen"
        />
        <motion.div
          animate={{ y: [-20, 20, -20], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[50%] -translate-x-1/2 w-[300px] md:w-[600px] h-[40vh] bg-gradient-to-t from-neon-yellow/40 to-transparent blur-[60px] rounded-full mix-blend-screen"
        />
      </div>

      {/* TARJETA CENTRAL (Glassmorphism potenciado) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl bg-white/10 border border-white/20 p-8 md:p-12 rounded-3xl backdrop-blur-2xl shadow-[0_0_80px_rgba(0,243,255,0.2)] relative z-10 text-center"
      >
        {/* CHECKMARK DE ÉXITO */}
        <motion.div
          variants={itemVariants}
          className="mb-8 flex justify-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-green-500/20 p-3 rounded-full border border-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
          >
            <CheckCircle className="h-10 w-10 (y md:h-16 md:w-16 text-green-400" />
          </motion.div>
        </motion.div>

        {/* Título de Éxito */}
        <motion.h1
          variants={itemVariants}
          className="font-orbitron text-xl md:text-4xl font-bold text-white mb-10 tracking-widest leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] uppercase"
        >
          Registro Exitoso
        </motion.h1>

        {/* Sección de Pago */}
        <motion.div variants={itemVariants} className="bg-black/40 border border-white/10 rounded-2xl p-4 mb-8 text-left space-y-5 shadow-inner w-full">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="h-7 w-7 text-neon-yellow flex-shrink-0" />
            <p className="font-bold text-lg text-white">DATOS PARA EL PAGO</p>
          </div>

          <p className="text-gray-200 text-sm">
            Realiza el pago con la siguiente información:
          </p>

          {/* Transferencia */}
          <div className="space-y-4 p-4 border border-neon-cyan/20 rounded-xl bg-[#05051a]">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-neon-cyan" />
              <p className="font-bold text-neon-cyan">Transferencia Bancaria</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="BANCO" value={bankDetails.bankName} />
              <DetailItem label="BENEFICIARIO" value={bankDetails.beneficiary} />
            </div>
            <div className="space-y-3">
              <CopyableItem label="CLABE" value={bankDetails.clabe} isCopied={copiedField === 'clabe'} onCopy={() => handleCopy(bankDetails.clabe, 'clabe')} />
            </div>
            <div className="mt-2 text-sm text-gray-300">
              Concepto: <span className="text-neon-cyan font-mono select-all font-bold">{bankDetails.concept}</span>
            </div>
          </div>

          {/* Efectivo
          <div className="space-y-2 p-4 border border-neon-yellow/20 rounded-xl bg-[#05051a]">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-neon-yellow" />
              <p className="font-bold text-neon-yellow">Pago en Efectivo</p>
            </div>
            <p className="text-sm text-gray-300">
              Puedes realizar tu pago en efectivo directamente con <span className="font-bold text-white">Yazary</span>.
            </p>
          </div> */}

          <div className="bg-neon-purple/20 border border-neon-purple/40 p-5 rounded-2xl flex flex-col gap-4 mt-4 shadow-[0_0_20px_rgba(188,19,254,0.15)]">
            <div className="flex items-start gap-3">
              <Info className="h-6 w-6 text-neon-purple flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-200 leading-relaxed">
                <span className="font-bold text-white">¡IMPORTANTE!</span>
              </p>
            </div>
            <motion.a
              href="https://wa.me/+525584999950?text=*Hola te escribo en relación al pago de EBV...*"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(37, 211, 102, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#25D366]/20 border border-[#25D366]/50 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors hover:bg-[#25D366]/30 group"
            >
              <MessageCircle className="h-6 w-6 text-[#25D366] group-hover:animate-pulse" />
              <span>ENVIAR COMPROBANTE</span>
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-black/40 border border-white/10 rounded-2xl p-6 mb-10 text-left space-y-3 shadow-inner"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-neon-yellow flex-shrink-0 animate-pulse" />
            <p className="font-bold text-lg text-white">¡ÚLTIMO PASO!</p>
          </div>
          <p className="text-gray-200">Descarga tu hoja de inscripción en el botón amarillo. Debes llevarla impresa el día del evento para entrar a la <span className="text-neon-purple font-bold">Estación Iluminación</span>.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">

          <motion.a
            href="/hoja_inscripcion_ebv.pdf"
            download="Mi_Inscripcion_EBV.pdf"
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(248, 255, 0, 0.6)" }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-neon-yellow text-black font-orbitron font-bold text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <Download className="h-6 w-6" />
            <span>DESCARGAR HOJA</span>
          </motion.a>

          {/* Botón Registrar otro (Sin cambios) */}
          <button
            onClick={() => navigate('/')}
            className="flex-1"
          >
            <motion.div
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-full bg-white/10 border border-white/20 text-white font-orbitron font-bold text-lg py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all"
            >
              <UserPlus className="h-6 w-6" />
              <span>INSCRIBIR OTRO</span>
            </motion.div>
          </button>
        </motion.div>
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
      <p className="text-sm md:text-base text-white font-semibold">{value}</p>
    </div>
  );
}

interface CopyableItemProps { label: string; value: string; isCopied: boolean; onCopy: () => void; }
function CopyableItem({ label, value, isCopied, onCopy }: CopyableItemProps) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-bold tracking-widest mb-1">{label}</p>
      <div className="flex items-center justify-between gap-3 bg-black/40 p-2 pl-4 rounded-xl border border-white/5 shadow-inner">
        <p className="text-sm md:text-lg font-mono text-white font-bold">{value}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCopy}
          className={`p-2 rounded-lg transition-colors flex-shrink-0 ${isCopied ? 'bg-green-500/20 text-green-400' : 'bg-neon-yellow/10 text-neon-yellow hover:bg-neon-yellow/20'}`}
        >
          {isCopied ? <CheckCircle className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
        </motion.button>
      </div>
    </div>
  );
}