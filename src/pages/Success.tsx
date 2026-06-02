import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, UserPlus, Sparkles } from 'lucide-react';
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
        {/* IMAGEN DE ESTACIÓN ILUMINACIÓN (PROTAGONISTA) */}
        <motion.div
          variants={itemVariants}
          className="mb-8 relative inline-block"
          // Animación de flotado suave y pulso de brillo
          animate={{ 
            y: [0, -10, 0],
            filter: [
              'drop-shadow(0 0 10px rgba(255,255,255,0.5))',
              'drop-shadow(0 0 30px rgba(0,243,255,0.8))',
              'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* OJO: Aquí cargamos la imagen desde la carpeta 'public' */}
          <img 
            src="/logo_estacion.png" // Ruta relativa a la carpeta public
            alt="Estación Iluminación"
            className="max-h-40 md:max-h-52 w-auto mx-auto object-contain"
            // Manejo de error si la imagen no existe en public/
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              console.error("No se encontró public/logo_estacion.png");
            }}
          />
        </motion.div>

        {/* Frase Inspiradora (Actualizada) */}
        <motion.h1 
          variants={itemVariants}
          className="font-orbitron text-4xl md:text-5xl font-bold text-white mb-4 tracking-wider leading-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        >
          ¡TU LUGAR ESTÁ <br/> BRILLANDO!
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-2xl text-neon-cyan font-semibold mb-10 max-w-md mx-auto drop-shadow-md"
        >
          Gracias por registrarte. <br/>¡La aventura de luz comienza pronto!
        </motion.p>

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
          
          {/* BOTÓN DESCARGAR PDF ESTÁTICO (Ruta a public/) */}
          <motion.a
            href="/hoja_inscripcion_ebv.pdf" // Ruta al archivo en la carpeta public
            download="Mi_Inscripcion_EBV.pdf" // Nombre con el que se descargará
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