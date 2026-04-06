// Hook detection mots-cles sensibles — Epic 10, Story 10.4
// Charge les mots-cles depuis config_mots_sensibles + detection cote client
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';
import { detectSensitiveKeywords, filterFalsePositives } from '../utils/sensitive-keyword-detector';
import { useDebounce } from './useDebounce';

type Supabase = SupabaseClient<Database>;

interface MotSensible {
  id: string;
  mot: string;
  categorie: string;
}

// Charger les mots-cles depuis la base (cache long)
export function useSensitiveKeywordsList(supabase: Supabase) {
  return useQuery({
    queryKey: ['config-mots-sensibles'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('config_mots_sensibles')
        .select('mot')
        .eq('actif', true);
      if (error) throw new Error(error.message);
      return (data as MotSensible[]).map((m) => m.mot);
    },
    staleTime: 24 * 60 * 60 * 1000, // 24h — les mots-cles changent rarement
  });
}

// Hook combine : detection en temps reel sur un texte avec debounce 500ms
export function useSensitiveKeywordDetection(supabase: Supabase, text: string) {
  const { data: keywords } = useSensitiveKeywordsList(supabase);
  const debouncedText = useDebounce(text, 500);
  const [matches, setMatches] = useState<string[]>([]);

  useEffect(() => {
    if (keywords && debouncedText && debouncedText.trim().length > 0) {
      const rawMatches = detectSensitiveKeywords(debouncedText, keywords);
      setMatches(filterFalsePositives(rawMatches));
    } else {
      setMatches([]);
    }
  }, [debouncedText, keywords]);

  return {
    matches,
    hasWarning: matches.length > 0,
  };
}
