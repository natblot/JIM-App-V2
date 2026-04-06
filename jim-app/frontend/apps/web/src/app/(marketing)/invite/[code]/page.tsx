// Route parrainage — verifie le code et redirige vers le store
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Gift } from 'lucide-react';
import { createServerSupabase } from '../../../../lib/supabase-server';
import { StoreButtons } from '../../../../components/landing/store-buttons';

interface Props { params: Promise<{ code: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: `Invitation JIM — ${code}`,
    description: 'Rejoignez JIM, la plateforme de remplacement pour kinesitherapeutes. Un confrere vous invite !',
  };
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  const supabase = createServerSupabase();

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, parrainage_code')
    .eq('parrainage_code', code)
    .single();

  const isValid = Boolean(profile);

  return (
    <main className="flex-grow max-w-[1440px] mx-auto w-full px-6 md:px-10 py-16">
      <div className="max-w-[500px] mx-auto text-center">
        {isValid ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-6">
              <Gift size={28} className="text-brand" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-3">
              {profile?.first_name} vous invite sur JIM
            </h1>
            <p className="text-neutral-500 mb-2">
              Rejoignez la plateforme de remplacement kine.
            </p>
            <p className="text-neutral-500 mb-8">
              Utilisez le code <span className="font-semibold text-neutral-900 bg-brand-light px-2 py-0.5 rounded">{code}</span> a l&apos;inscription.
            </p>
            <StoreButtons size="lg" className="justify-center" />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">Code d&apos;invitation invalide</h1>
            <p className="text-neutral-500 mb-8">Ce code n&apos;existe pas ou a expire.</p>
            <Link href="/" className="text-brand hover:underline font-medium">
              ← Retour a l&apos;accueil
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
