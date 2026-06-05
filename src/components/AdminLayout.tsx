import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckCircle, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLayout() {
  const navLinks = [
    { to: "/admin", icon: LayoutDashboard, label: "Métricas Visuales", end: true },
    { to: "/admin/children", icon: Users, label: "Gestión de Niños" },
    { to: "/admin/offerings", icon: Heart, label: "Ofrendas" },
  ];

  return (
    <main className="min-h-screen w-full p-6 md:p-10 relative bg-[#05051a] overflow-hidden">
      {/* EFECTOS DE FONDO ADM */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-neon-purple/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-neon-cyan/10 rounded-full blur-[100px] -z-10" />

      {/* CABECERA DASHBOARD GENERAL */}
      <header className="flex flex-col items-center justify-center gap-4 mb-10 pb-6 border-b border-white/10 relative z-10">
        <div className="relative flex flex-col items-center justify-center min-h-[160px] w-full">
          {/* Fondo estático de ráfaga */}
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            src="https://vbs.lifeway.com/wp-content/uploads/2025/03/Layered-full-and-partial-burst-new.png"
            className="absolute z-0 w-[200px] object-cover opacity-90"
            style={{ pointerEvents: 'none' }}
            alt="Fondo Estación"
          />
          
          {/* Ráfaga 2 Animada */}
          <motion.img 
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: 1, scale: [1, 1.05, 1], rotate: [0, -2, 0, 2, 0] }}
             transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
             src="https://vbs.lifeway.com/wp-content/uploads/2025/03/Layered-full-and-partial-burst-3.png"
             className="absolute z-0 w-[160px] mix-blend-screen opacity-70"
             style={{ pointerEvents: 'none' }}
             alt="Resplandor"
          />

          {/* Logo Principal 3D */}
          <motion.div
             initial={{ opacity: 0, y: -20, rotateX: 30 }}
             animate={{ opacity: 1, y: 0, rotateX: [-5, 5, -5] }}
             transition={{ 
               y: { type: "spring", stiffness: 100, delay: 0.1 }, 
               rotateX: { duration: 3, repeat: Infinity, ease: "easeInOut" } 
             }}
             className="relative z-10 w-[180px] mt-2"
          >
             <motion.img 
               animate={{ y: [-3, 3, -3] }}
               transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
               src="https://vbs.lifeway.com/wp-content/uploads/2025/08/EstacionIluminacion-Layered-full-and-partial-burst-4.png"
               className="w-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]"
               alt="Estación Iluminación"
             />
          </motion.div>
          
          <h1 className="font-orbitron text-2xl font-bold text-white tracking-widest mt-4 relative z-10 drop-shadow-md">CONTROL</h1>
        </div>
      </header>

      {/* PESTAÑAS (NAVIGATION) */}
      <nav className="flex flex-wrap sm:flex-nowrap items-center gap-2 border border-white/10 rounded-2xl p-1.5 bg-black/40 mb-10 shadow-inner w-full max-w-3xl relative z-10 overflow-x-auto">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `flex-1 min-w-[150px] flex items-center justify-center gap-2 px-3 md:px-6 py-3.5 rounded-xl text-center font-bold transition-all whitespace-nowrap ${
              isActive 
              ? 'bg-neon-purple text-white shadow-[0_0_15px_rgba(188,19,254,0.5)]' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Renderizado de sub-rutas */}
      <div className="relative z-10">
        <Outlet />
      </div>
    </main>
  );
}