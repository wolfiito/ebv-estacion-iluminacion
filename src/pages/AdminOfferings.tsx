import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, RotateCw, AlertTriangle, Lock, X, CheckCircle } from 'lucide-react';
import { useOfferings } from '../hooks/useOfferings';
import { addOffering, deleteOffering } from '../lib/offeringsService';

const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.4 } },
};

const ADMIN_PASSWORD = '35t4c1OnIlum1n4cion'; 

export default function AdminOfferings() {
  const navigate = useNavigate();
  const { offerings, loading, error } = useOfferings();
  
  const [newAmount, setNewAmount] = useState('');
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated) return;

    const timer = setTimeout(() => {
      //eslint-disable-next-line no-alert
      const pass = window.prompt(`ACCESO RESTRINGIDO\n\nRegistro de ofrendas.\nIntroduce la clave:`);

      if (pass === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
      } else {
        //eslint-disable-next-line no-alert
        window.alert(`Clave incorrecta. Regresando al panel visual.`);
        navigate('/admin');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <Lock className="h-20 w-20 text-neon-yellow animate-pulse mb-6" />
            <h2 className="font-orbitron text-3xl font-bold text-white tracking-wider">ÁREA PROTEGIDA</h2>
            <p className="text-gray-400 mt-2">Esperando autenticación...</p>
        </div>
    );
  }

  const handleAddOffering = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    setIsSubmitting(true);
    setNotification(null);
    try {
      await addOffering(newName, amount);
      setNewAmount('');
      setNewName('');
      setNotification({ message: 'Ofrenda registrada con éxito', type: 'success' });
      setTimeout(() => setNotification(null), 3000);
    } catch (err: any) {
      console.error(err);
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    //eslint-disable-next-line no-alert
    if (!window.confirm("¿Estás seguro de que deseas eliminar este registro?")) return;
    try {
      await deleteOffering(id);
    } catch (err: any) {
      console.error(err);
      //eslint-disable-next-line no-alert
      alert(err.message || "Error al eliminar la ofrenda.");
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  const formatDate = (date: Date) => date.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });

  return (
      <motion.div variants={pageVariants} initial="hidden" animate="visible" className="space-y-10 relative z-10">
         {loading && (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center gap-4">
            <RotateCw className="h-12 w-12 text-neon-cyan animate-spin" />
            <p className="text-neon-cyan font-semibold text-lg tracking-widest font-orbitron">ILUMINANDO OFRENDAS...</p>
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
                <motion.section className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
                    <h2 className="text-2xl font-orbitron font-bold text-white mb-6">REGISTRAR NUEVA OFRENDA</h2>
                    <form onSubmit={handleAddOffering} className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <input
                            type="text"
                            placeholder="Nombre (Opcional)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full md:w-64 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all shadow-inner"
                        />
                         <div className="relative w-full md:w-48">
                             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                             <input
                                 type="number"
                                 placeholder="Monto"
                                 step="0.01"
                                 min="0.01"
                                 required
                                 value={newAmount}
                                 onChange={(e) => setNewAmount(e.target.value)}
                                 className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-8 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all shadow-inner font-bold"
                             />
                         </div>
                         <motion.button
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.98 }}
                             disabled={isSubmitting || !newAmount}
                             type="submit"
                             className="w-full md:w-auto bg-neon-cyan text-black font-orbitron font-bold py-3 px-8 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                         >
                             {isSubmitting ? <RotateCw className="h-5 w-5 animate-spin"/> : <Plus className="h-5 w-5"/>}
                             AGREGAR
                         </motion.button>
                         <AnimatePresence>
                             {notification && (
                                 <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-sm font-bold text-green-400 bg-green-500/10 px-4 py-3 rounded-xl border border-green-500/20">
                                     <CheckCircle className="h-5 w-5" />
                                     {notification.message}
                                 </motion.div>
                             )}
                         </AnimatePresence>
                    </form>
                </motion.section>

                <motion.section variants={{ visible: { y: 0, opacity: 1, transition: { type: 'spring' } } }} className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                            <thead className="border-b border-white/10 text-gray-400 font-semibold tracking-wider">
                                <tr>
                                    <th className="px-5 py-5 w-[25%]">FECHA</th>
                                    <th className="px-5 py-5 w-[40%]">NOMBRE / CONCEPTO</th>
                                    <th className="px-5 py-5 w-[25%]">MONTO</th>
                                    <th className="px-5 py-5 w-[10%] text-center"></th>
                                </tr>
                            </thead>
                            <tbody>
                            <AnimatePresence>
                                {offerings.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-20 text-gray-500 font-semibold text-lg">
                                            No hay ofrendas registradas.
                                        </td>
                                    </tr>
                                ) : (
                                offerings.map((offering) => (
                                    <motion.tr 
                                        key={offering.id} 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                                    >
                                        <td className="px-5 py-5 text-gray-300">{formatDate(offering.createdAt)}</td>
                                        <td className="px-5 py-5 font-bold text-white text-base">{offering.name}</td>
                                        <td className="px-5 py-5 text-neon-cyan font-bold text-lg">{formatCurrency(offering.amount)}</td>
                                        <td className="px-2 py-5 text-center">
                                            <button
                                                onClick={() => handleDelete(offering.id!)}
                                                className="text-gray-500 hover:text-red-400 p-2 rounded-full transition-colors"
                                                title="Eliminar ofrenda"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
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
