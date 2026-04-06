// Hook export RGPD — Epic 10, Story 10.1
import { useMutation } from '@tanstack/react-query';
import type { SupabaseClient } from '../adapters/supabase';
import type { Database } from '../types/database';

type Supabase = SupabaseClient<Database>;

export interface ExportDataResult {
  status: string;
  download_url: string;
  expires_in_hours: number;
}

export function useExportData(supabase: Supabase) {
  return useMutation({
    mutationFn: async (): Promise<ExportDataResult> => {
      const { data, error } = await supabase.functions.invoke('export-data', { body: {} });
      if (error) throw new Error(error.message);
      return data as ExportDataResult;
    },
  });
}
