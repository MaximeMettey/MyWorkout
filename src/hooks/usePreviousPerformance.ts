import { useState, useEffect } from 'react';
import { database } from '../services/database';
import { PerformanceRecord } from '../models';

export const usePreviousPerformance = (exerciseId: string) => {
  const [previousPerformance, setPreviousPerformance] = useState<{
    reps: number;
    weight: number;
    date: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPreviousPerformance = async () => {
      try {
        // TODO: Implémenter la récupération depuis la base de données
        // Pour l'instant, retourner des données de test
        setLoading(false);
      } catch (error) {
        console.error('Error fetching previous performance:', error);
        setLoading(false);
      }
    };

    fetchPreviousPerformance();
  }, [exerciseId]);

  return { previousPerformance, loading };
};
