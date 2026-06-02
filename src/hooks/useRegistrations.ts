// src/hooks/useRegistrations.ts
import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp, FirestoreError } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EBV_COST_PER_CHILD } from '../lib/constants'; // Asegúrate de tener este archivo creado
import type { ChildRegistration, RegistrationStats } from '../types'; // Importación solo de tipos

const COLLECTION_NAME = "registrations";

export const useRegistrations = () => {
  const [registrations, setRegistrations] = useState<ChildRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [ageRanges] = useState([
    { min: 3, max: 5, name: 'Preescolares' },
    { min: 6, max: 9, name: 'Escolares' },
    { min: 10, max: 12, name: 'Preadolescentes' },
    { min: 13, max: 16, name: 'Jóvenes' },
  ]);

  useEffect(() => {
    const regsCollection = collection(db, COLLECTION_NAME);
    // Ordenamos por fecha de creación (los más recientes primero) para la tabla
    const q = query(regsCollection, orderBy('createdAt', 'desc'));

    setLoading(true);
    setError(null);

    // Escuchamos cambios en tiempo real (onSnapshot)
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        // Mapeamos los documentos a nuestro tipo 'ChildRegistration' de forma segura
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          
          // Senior Practice: Convertimos Firestore Timestamp a Date de JS de forma segura y tipada
          // Manejamos el caso donde createdAt podría ser nulo localmente antes de la confirmación del servidor
          const createdAt = docData.createdAt instanceof Timestamp 
            ? docData.createdAt.toDate() 
            : new Date(); // Fallback seguro (aproximado) si es nulo temporalmente

          return {
            id: doc.id,
            // Copiamos el resto de propiedades asegurándonos de que coincidan con la interfaz
            childName: docData.childName,
            age: docData.age,
            gender: docData.gender,
            parentName: docData.parentName,
            invitedBy: docData.invitedBy,
            paidAmount: docData.paidAmount,
            createdAt,
          } as ChildRegistration; // Cast final seguro tras validación manual de campos críticos
        });
        
        setRegistrations(data);
        setLoading(false);
      },
      (err: FirestoreError) => {
        // Manejo específico de errores de Firestore (ej. permisos, red)
        console.error("Error en tiempo real cargando registros:", err);
        setError("No se pudieron cargar los datos del Dashboard. Verifica tus permisos o conexión.");
        setLoading(false);
      }
    );

    // Senior Practice: Función de limpieza crucial para evitar leaks de memoria y lecturas innecesarias
    // Se ejecuta automáticamente cuando el componente que usa el hook se desmonta.
    return () => unsubscribe();
  }, []);

  // CALCULOS "PRO" MEMOIZADOS (useMemo)
  // recalculamos solo si cambia el arreglo 'registrations', evitando re-renders costosos.
  const stats: RegistrationStats = useMemo(() => {
    const totalChildren = registrations.length;
    // Meta total basada en el costo constante y el número actual de niños
    const totalNeeded = totalChildren * EBV_COST_PER_CHILD;
    
    // Usamos 'reduce' para calcular todos los totales (monetarios y de género) en una sola pasada
    const { collected, boys, girls } = registrations.reduce((acc, child) => {
      // Sumamos montos numéricos reales
      acc.collected += (child.paidAmount || 0); // Fallback a 0 por seguridad
      if (child.gender === 'niño') acc.boys++; else acc.girls++;
      return acc;
    }, { collected: 0, boys: 0, girls: 0 });

    return {
      totalChildren,
      totalCollected: collected,
      totalNeeded,
      totalBoys: boys,
      totalGirls: girls,
    };
  }, [registrations]); // Dependencia única: registrations

  return { registrations, stats, ageRanges, loading, error };
};