import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Target, CheckCircle, RotateCw, FileSpreadsheet, AlertTriangle, Lock } from 'lucide-react';
import { useRegistrations } from '../hooks/useRegistrations';
import { downloadSegmentedExcel } from '../lib/excelService';
import { updateRegistrationPaidAmount } from '../lib/registrationsService';
import { EBV_COST_PER_CHILD } from '../lib/constants';

const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.4 } },
};

// CREDENCIALES ESTÁTICAS DEL EVENTO
const ADMIN_PASSWORD = '123'; // Cambia esto por tu contraseña real

export default function AdminChildrenList() {
  const navigate = useNavigate();
  const { registrations, ageRanges, loading, error } = useRegistrations();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ id: string, type: 'success' | 'error' } | null>(null);
  
  // ESTADO DE AUTENTICACIÓN LOCAL
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // LÓGICA DE BLOQUEO "FLASH"
  useEffect(() => {
    if (isAuthenticated) return;

    const timer = setTimeout(() => {
      //eslint-disable-next-line no-alert
      const pass = window.prompt(`🔐 ACCESO RESTRINGIDO\n\nEdición de pagos y lista de niños.\nIntroduce la clave:`);

      if (pass === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        //eslint-disable-next-line no-alert
        window.alert(`⚠️ Clave incorrecta. Regresando al panel visual.`);
        navigate('/admin'); // Lo regresa al dashboard público
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  // Si no está autenticado, mostramos la pantalla de bloqueo
  if (!isAuthenticated) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <Lock className="h-20 w-20 text-neon-yellow animate-pulse mb-6" />
            <h2 className="font-orbitron text-3xl font-bold text-white tracking-wider">ÁREA PROTEGIDA</h2>
            <p className="text-gray-400 mt-2">Esperando autenticación...</p>
        </div>
    );
  }

  const handleExportExcel = () => { downloadSegmentedExcel(registrations, ageRanges); };
  
  const handleUpdateAmount = async (id: string, currentAmount: number, inputValue: string) => {
    const newAmount = parseFloat(inputValue);
    if (isNaN(newAmount) || newAmount === currentAmount || newAmount < 0) return;
    setUpdatingId(id); setNotification(null);
    try {
      await updateRegistrationPaidAmount(id, newAmount);
      setNotification({ id, type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error(err); setNotification({ id, type: 'error' }); alert(err.message || "Error al actualizar.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRegistrations = registrations.filter(reg => 
    reg.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.parentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-10 relative z-10">
         {loading && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4">
            <RotateCw className="h-12 w-12 text-neon-cyan animate-spin" />
            <p className="text-neon-cyan font-semibold text-lg tracking-widest font-orbitron">ILUMINANDO LISTA...</p>
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
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input 
                            type="text"
                            placeholder="Buscar por niño o tutor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all shadow-inner"
                        />
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 flex items-center gap-3 shadow-inner backdrop-blur-sm text-gray-400 text-xs">
                            <Target className="h-5 w-5 text-neon-purple" />
                            <div>
                                <p className="font-bold text-neon-purple text-base">Costo EBV: {EBV_COST_PER_CHILD}</p>
                                <p>por niño</p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(248,255,0,0.5)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleExportExcel}
                            disabled={registrations.length === 0}
                            className="bg-neon-yellow text-black font-orbitron font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileSpreadsheet className="h-6 w-6" />
                            <span>EXPORTAR EXCEL</span>
                        </motion.button>
                    </div>
                </div>

                <motion.section variants={{ visible: { y: 0, opacity: 1, transition: { type: 'spring' } } }} className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse min-w-[850px]">
                            <thead className="border-b border-white/10 text-gray-400 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-5 py-5 w-[30%]">NIÑO (A)</th>
                                    <th className="px-5 py-5 w-[10%]">EDAD</th>
                                    <th className="px-5 py-5 w-[15%]">GÉNERO</th>
                                    <th className="px-5 py-5 w-[25%]">TUTOR (A)</th>
                                    <th className="px-5 py-5 w-[20%] text-center">MONTO PAGADO ({EBV_COST_PER_CHILD} Costo)</th>
                                </tr>
                            </thead>
                            <tbody>
                            <AnimatePresence>
                                {filteredRegistrations.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-20 text-gray-500 font-semibold text-lg">
                                            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                                            No se encontraron registros {searchTerm && `para "${searchTerm}"`}.
                                        </td>
                                    </tr>
                                ) : (
                                filteredRegistrations.map((reg) => (
                                    <motion.tr 
                                        key={reg.id} 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-5 py-5 font-bold text-white text-base">{reg.childName}</td>
                                        <td className="px-5 py-5 text-gray-300">{reg.age} años</td>
                                        <td className="px-5 py-5">
                                            <span className={`px-3 py-1 rounded-full font-bold text-xs capitalize ${reg.gender === 'niño' ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20' : 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'}`}>
                                                {reg.gender}
                                            </span>
                                        </td>
                                        <td className="px-5 py-5 text-gray-300">{reg.parentName}</td>
                                        
                                        <td className="px-5 py-5">
                                            <div className="flex items-center justify-center gap-3 relative">
                                                {updatingId === reg.id ? (
                                                    <RotateCw className="h-6 w-6 text-neon-yellow animate-spin" />
                                                ) : (
                                                    <div className="relative w-40 flex items-center">
                                                        <span className="absolute left-3 text-gray-500 font-bold">$</span>
                                                        <input
                                                            type="number"
                                                            defaultValue={reg.paidAmount}
                                                            step="1"
                                                            min="0"
                                                            placeholder="Monto"
                                                            className={`w-full bg-black/50 border rounded-lg py-2.5 pl-8 pr-4 text-white placeholder-gray-600 focus:outline-none transition-all shadow-inner font-bold text-lg ${
                                                                reg.paidAmount >= EBV_COST_PER_CHILD 
                                                                    ? 'border-green-500 focus:border-green-400 focus:ring-1 focus:ring-green-400 text-green-300' 
                                                                    : 'border-white/10 focus:border-neon-purple focus:ring-1 focus:ring-neon-purple'
                                                            }`}
                                                            onBlur={(e) => handleUpdateAmount(reg.id!, reg.paidAmount, e.target.value)}
                                                            onKeyPress={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    handleUpdateAmount(reg.id!, reg.paidAmount, e.currentTarget.value);
                                                                    e.currentTarget.blur();
                                                                }
                                                            }}
                                                        />
                                                        <AnimatePresence>
                                                            {notification?.id === reg.id && notification.type === 'success' && (
                                                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="absolute -left-8">
                                                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                                )}
                            </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </motion.section>
            </>
        )}
      </motion.div>
  );
}