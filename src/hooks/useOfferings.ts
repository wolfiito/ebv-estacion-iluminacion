import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp, FirestoreError } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { EBV_COST_PER_CHILD } from '../lib/constants';
import type { Offering, OfferingStats } from '../types';

const COLLECTION_NAME = "offerings";

export const useOfferings = () => {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const coll = collection(db, COLLECTION_NAME);
    const q = query(coll, orderBy('createdAt', 'desc'));

    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          const createdAt = docData.createdAt instanceof Timestamp 
            ? docData.createdAt.toDate() 
            : new Date(); 

          return {
            id: doc.id,
            name: docData.name,
            amount: docData.amount,
            createdAt,
          } as Offering; 
        });
        
        setOfferings(data);
        setLoading(false);
      },
      (err: FirestoreError) => {
        console.error("Error cargando ofrendas:", err);
        setError("No se pudieron cargar los datos de las ofrendas.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const stats: OfferingStats = useMemo(() => {
    const totalCollected = offerings.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const equivalentChildren = Math.floor(totalCollected / EBV_COST_PER_CHILD);

    return {
      totalOfferingsCollected: totalCollected,
      equivalentChildren
    };
  }, [offerings]);

  return { offerings, stats, loading, error };
};
