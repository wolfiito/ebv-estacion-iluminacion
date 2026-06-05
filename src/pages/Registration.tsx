import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Users, Sparkles, AlertTriangle } from 'lucide-react';
import { registrationSchema, type RegistrationFormData } from '../lib/validation';
import { createRegistration } from '../lib/registrationsService';

export default function Registration() {
  const navigate = useNavigate();

  const [dbError, setDbError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema) as any,
  });

  const selectedGender = watch('gender');

  const onSubmit = async (data: RegistrationFormData) => {
    setDbError(null);

    try {
      await createRegistration(data);

      navigate('/success', { state: { registrationData: data } });

    } catch (error: any) {
      setDbError(error.message || "Ocurrió un error inesperado.");
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden flex flex-col items-center justify-center p-4 md:p-8 relative bg-[#0a0a2a]">

      {/* CAPA DE EFECTOS VISUALES (z-0) - Se mantiene igual */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ rotate: [-15, 5, -15] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[10%] md:left-[25%] w-[150px] md:w-[300px] h-[80vh] bg-gradient-to-b from-neon-cyan/80 via-neon-cyan/20 to-transparent blur-[40px] origin-top mix-blend-screen"
        />
        <motion.div
          animate={{ rotate: [15, -5, 15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] right-[10%] md:right-[25%] w-[150px] md:w-[300px] h-[80vh] bg-gradient-to-b from-neon-yellow/70 via-neon-yellow/20 to-transparent blur-[40px] origin-top mix-blend-screen"
        />
        <motion.div
          animate={{ rotate: [-5, 10, -5] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-5%] left-[50%] -translate-x-1/2 w-[200px] md:w-[400px] h-[90vh] bg-gradient-to-b from-neon-purple/60 via-neon-purple/20 to-transparent blur-[50px] origin-top mix-blend-screen"
        />

        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.9, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute rounded-full bg-white blur-[1px]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 3}px`,
              height: `${Math.random() * 6 + 3}px`,
              boxShadow: '0 0 15px 3px rgba(255,255,255,0.9)'
            }}
          />
        ))}
      </div>

      {/* CONTENEDOR DEL FORMULARIO (z-10) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl bg-white/10 border border-white/20 p-6 md:p-10 rounded-3xl backdrop-blur-md shadow-[0_0_50px_rgba(0,243,255,0.15)] relative z-10"
      >
        <div className="text-center mb-8 relative flex flex-col items-center justify-center min-h-[300px] overflow-visible">
          {/* Fondo estático de ráfaga */}
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            src="https://vbs.lifeway.com/wp-content/uploads/2025/03/Layered-full-and-partial-burst-new.png"
            className="absolute z-0 w-[120%] max-w-none md:w-[150%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-90"
            style={{ pointerEvents: 'none' }}
            alt="Fondo Estación"
          />

          {/* Ráfaga 2 Animada (Pequeña rotación) */}
          <motion.img
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: [1, 1.05, 1], rotate: [0, -2, 0, 2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            src="https://vbs.lifeway.com/wp-content/uploads/2025/03/Layered-full-and-partial-burst-3.png"
            className="absolute z-0 w-[90%] md:w-[110%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen opacity-70"
            style={{ pointerEvents: 'none' }}
            alt="Resplandor"
          />

          {/* Logo Principal 3D */}
          <motion.div
            initial={{ opacity: 0, y: -30, rotateX: 30 }}
            animate={{ opacity: 1, y: 0, rotateX: [-5, 5, -5] }}
            transition={{
              y: { type: "spring", stiffness: 100, delay: 0.1 },
              rotateX: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative z-10 w-[90%] max-w-[320px] md:max-w-[400px] mt-4"
          >
            <motion.img
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              src="https://vbs.lifeway.com/wp-content/uploads/2025/08/EstacionIluminacion-Layered-full-and-partial-burst-4.png"
              className="w-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]"
              alt="Estación Iluminación"
            />
          </motion.div>

          {/* Letras Animadas */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.02, delayChildren: 0.3 }
              }
            }}
            className="text-white font-bold text-sm md:text-lg tracking-wider uppercase mt-8 relative z-10 px-2 text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >

          </motion.div>
        </div>

        {/* NUEVO: Mensaje de error general de la Base de Datos */}
        {dbError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-900/60 border border-red-500 rounded-xl text-red-200 text-sm flex items-start gap-3 shadow-lg"
          >
            <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">¡Oops! Algo salió mal</p>
              <p>{dbError}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-5">
          {/* Nombre del Niño - Se mantiene igual */}
          <div>
            <label className="block text-sm text-white font-semibold mb-1 drop-shadow-md">Nombre del niño *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-neon-cyan" />
              </div>
              <input
                {...register('childName')}
                type="text"
                placeholder="Ej. Alejandro Flores"
                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 transition-all shadow-inner"
              />
            </div>
            {errors.childName && <p className="text-neon-yellow font-semibold text-xs mt-1 drop-shadow-md">{errors.childName.message}</p>}
          </div>

          {/* Edad y Género - Se mantiene igual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm text-white font-semibold mb-1 drop-shadow-md">Edad *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-neon-cyan" />
                </div>
                <input
                  {...register('age')}
                  type="number"
                  placeholder="3 - 16"
                  className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 transition-all shadow-inner"
                />
              </div>
              {errors.age && <p className="text-neon-yellow font-semibold text-xs mt-1 drop-shadow-md">{errors.age.message}</p>}
            </div>

            <div>
              <label className="block text-sm text-white font-semibold mb-1 drop-shadow-md">Género *</label>
              <div className="flex gap-2 h-[48px]">
                <button
                  type="button"
                  onClick={() => setValue('gender', 'niño', { shouldValidate: true })}
                  className={`flex-1 rounded-xl border-2 font-bold transition-all ${selectedGender === 'niño'
                    ? 'bg-neon-cyan/40 border-neon-cyan text-white shadow-[0_0_15px_rgba(0,243,255,0.6)]'
                    : 'bg-black/40 border-white/20 text-gray-300 hover:border-white/40'
                    }`}
                >
                  Niño
                </button>
                <button
                  type="button"
                  onClick={() => setValue('gender', 'niña', { shouldValidate: true })}
                  className={`flex-1 rounded-xl border-2 font-bold transition-all ${selectedGender === 'niña'
                    ? 'bg-neon-purple/40 border-neon-purple text-white shadow-[0_0_15px_rgba(188,19,254,0.6)]'
                    : 'bg-black/40 border-white/20 text-gray-300 hover:border-white/40'
                    }`}
                >
                  Niña
                </button>
              </div>
              {errors.gender && <p className="text-neon-yellow font-semibold text-xs mt-1 drop-shadow-md">{errors.gender.message}</p>}
            </div>
          </div>

          {/* Padre o Tutor - Se mantiene igual */}
          <div>
            <label className="block text-sm text-white font-semibold mb-1 drop-shadow-md">Nombre del padre o tutor *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Users className="h-5 w-5 text-neon-cyan" />
              </div>
              <input
                {...register('parentName')}
                type="text"
                placeholder="Ej. Juan Pérez"
                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/50 transition-all shadow-inner"
              />
            </div>
            {errors.parentName && <p className="text-neon-yellow font-semibold text-xs mt-1 drop-shadow-md">{errors.parentName.message}</p>}
          </div>

          {/* Quién te invitó (Opcional) - Se mantiene igual */}
          <div>
            <label className="block text-sm text-white font-semibold mb-1 drop-shadow-md">¿Quién te invitó? (Opcional)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Sparkles className="h-5 w-5 text-neon-cyan" />
              </div>
              <input
                {...register('invitedBy')}
                type="text"
                placeholder="Nombre de quien te invitó"
                className="w-full bg-black/40 border border-white/20 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-neon-yellow focus:ring-2 focus:ring-neon-yellow/50 transition-all shadow-inner"
              />
            </div>
            {errors.invitedBy && <p className="text-neon-yellow font-semibold text-xs mt-1 drop-shadow-md">{errors.invitedBy.message}</p>}
          </div>

          {/* Botón de Enviar - Cambiamos texto de carga */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(248, 255, 0, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full mt-8 bg-gradient-to-r from-neon-yellow via-neon-cyan to-neon-purple text-black font-orbitron font-bold text-lg py-4 px-4 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="animate-pulse">GUARDANDO REGISTRO...</span>
            ) : (
              <>
                <span>REGISTRAR</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </main>
  );
}