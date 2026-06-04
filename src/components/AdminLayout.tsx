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
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-4">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="p-3 bg-neon-purple/20 border border-neon-purple/40 rounded-2xl">
            <LayoutDashboard className="h-9 w-9 text-neon-purple drop-shadow-[0_0_10px_rgba(188,19,254,0.6)]" />
          </motion.div>
          <div>
            <h1 className="font-orbitron text-4xl font-bold text-white tracking-wider">PANEL DE CONTROL</h1>
            <p className="text-gray-400">Administración EBV <span className="text-neon-cyan font-bold">Estación Iluminación</span></p>
          </div>
        </div>
        
        <div className="bg-green-500/10 border border-green-500 rounded-xl px-4 py-2 text-green-300 text-xs font-bold tracking-wider flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            EN LÍNEA
        </div>
      </header>

      {/* PESTAÑAS (NAVIGATION) */}
      <nav className="flex items-center gap-2 border border-white/10 rounded-2xl p-1.5 bg-black/40 mb-10 shadow-inner max-w-lg relative z-10">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `flex-1 flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-center font-bold transition-all ${
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