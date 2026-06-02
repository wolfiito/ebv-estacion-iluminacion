// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './pages/Registration';
import Success from './pages/Success';
import AdminLayout from './components/AdminLayout'; // NUEVO Layout
import Dashboard from './pages/Dashboard'; // Actualizado para métricas
import AdminChildrenList from './pages/AdminChildrenList'; // NUEVA página
import Donate from './pages/Donate';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/success" element={<Success />} />
        <Route path="/ofrenda" element={<Donate />} />
        {/* NUEVA ESTRUCTURA DE RUTAS ADMIN */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Métricas Visuales (Ruta por defecto de /admin) */}
          <Route index element={<Dashboard />} />
          {/* Lista y Gestión monetaria */}
          <Route path="children" element={<AdminChildrenList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}