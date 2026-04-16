// Page annonce SSR — connectee a Supabase, SEO + Schema.org
export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, MapPin, Calendar, Zap, Briefcase, ExternalLink, User, Star } from 'lucide-react';
import { fetchAnnonceById, fetchAnnonceCoords } from '../../../../lib/supabase-server';
import { MiniMap } from '../../../../components/annonce/mini-map';
import { buildAnnonceMetadata, buildJobPostingSchema } from '../../../../lib/seo';
import { StoreButtons } from '../../../../components/landing/store-buttons';
import { PostulerButton } from '../../../../components/annonce/postuler-button';
import { SimilarAnnonces } from '../../../../components/annonce/similar-annonces';
import { MobileCtaBar } from '../../../../components/annonce/mobile-cta-bar';

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const annonce = await fetchAnnonceById(id);
  if (!annonce) return { title: 'Annonce introuvable' };
  return buildAnnonceMetadata(annonce);
}

export default async function AnnoncePage({ params }: Props) {
  const { id } = await params;
  const [annonce, coords] = await Promise.all([
    fetchAnnonceById(id),
    fetchAnnonceCoords(id),
  ]);

  if (!annonce || annonce.statut === 'expiree') {
    return (
      <main className="flex-grow max-w-[800px] mx-auto px-6 md:px-10 pt-32 pb-16 text-center">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Annonce introuvable</h1>
        <p className="text-neutral-500 mb-8">Cette annonce n&apos;existe plus ou a ete pourvue.</p>
        <Link href="/" className="text-brand hover:underline font-medium">
          ← Retour aux annonces
        </Link>
      </main>
    );
  }

  const isNative = annonce.source === 'native';
  const dateDebut = new Date(annonce.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const dateFin = new Date(annonce.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const retro = annonce.retrocession ?? 80;
  const structuredData = buildJobPostingSchema(annonce);

  // Image reelle ou placeholder deterministe
  const placeholderImages = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDPwQ0o8sboi92l_4VYkwtudYJZByNncZPdp5NYxAzPykAJa7NM9LE8Cpp9nB-r2iZEWDNCuCAMBxx6FDpCpRAD3GlqaW95R1vIYcs7fDHIG8mNXmDNfShFPpIP23DNHQcyS6EFITZGtyKKJTxfjNokBr41QgUz_ICdzg228avWU3VjmEBs18jnJapEYZM6VocutCJtB1CkujzkPaKYvAmVSHQSpWq_9xssf7Kv-tgqltCSsx61p-MKqWcWd28jBy-hmn-zkbH9K3pX',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD9zsFMpxojX3zIwuu2tP6w_I2wI-7gYv5fGvW3lhU2xllnTLIBs7xVum9M_BC-ziJ0Rf3twvufeaeoVpHZOGH3GEtrXb7V3qJWb0Ja2Bfc8lbwDSP92UeHV0Z7PPdlTpTB00lBIFPtxhXvfYLU0EancMBYRiqx3fMu9M5NYy4y065Tr-wzs9V5nJvwZjHiy3bDNXdsXho27dPcDm7PWulNQWMexFoBvPFYjOSwNOWAQG0SSW2rwxzsGeNVvz4J-fvoif2n-Nf7SsY8',
  ];
  const imgIdx = id.charCodeAt(0) % placeholderImages.length;
  const heroImage = annonce.photo_urls?.[0] ?? placeholderImages[imgIdx];

  return (
    <main className="max-w-[1200px] mx-auto w-full px-6 md:px-10 pt-32 pb-28 lg:pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      {/* Navigation — cible 44px cliquable (Fitts) */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-6 transition-colors min-h-[44px] -ml-2 px-2 rounded-lg hover:bg-white/50"
      >
        <ArrowLeft size={16} /> Retour aux annonces
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Colonne gauche */}
        <div>
          {/* Image principale */}
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6">
            <Image
              src={heroImage as string}
              alt={`Cabinet ${annonce.ville ?? ''}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute top-4 left-4 bg-neutral-900/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
              <CheckCircle size={14} className="text-green-400" /> Verifie RPPS
            </div>
            {annonce.is_urgent && (
              <div className="absolute top-4 right-4 bg-red-500/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5">
                <Zap size={14} /> Urgent
              </div>
            )}
          </div>

          {/* Titre + badges */}
          <div className="mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-neutral-900 mb-2 tracking-tight">
              Remplacement kine {annonce.ville && `a ${annonce.ville}`}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
              <span className="flex items-center gap-1"><MapPin size={14} /> {annonce.ville ?? 'France'}{annonce.code_postal ? ` (${annonce.code_postal})` : ''}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {dateDebut} → {dateFin}</span>
              {annonce.type_annonce && (
                <>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1"><Briefcase size={14} /> {annonce.type_annonce}</span>
                </>
              )}
              <span>&bull;</span>
              <span className="text-neutral-400">Publie le {new Date(annonce.created_at).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {/* Description */}
          {annonce.description && (
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6 shadow-sm">
              <h2 className="font-semibold text-neutral-900 mb-3">Description</h2>
              <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{annonce.description}</p>
            </div>
          )}

          {/* Details */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
            <h2 className="font-semibold text-neutral-900 mb-4">Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <Detail label="Retrocession" value={`${retro}%`} />
              {annonce.type_cabinet && <Detail label="Type de cabinet" value={annonce.type_cabinet} />}
              <Detail label="Statut" value={annonce.statut === 'active' ? 'Active' : annonce.statut} />
              {annonce.specialites && annonce.specialites.length > 0 && (
                <div className="col-span-2">
                  <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">Specialites</p>
                  <div className="flex gap-2 flex-wrap">
                    {annonce.specialites.map((s) => (
                      <span key={s} className="text-xs px-2 py-1 rounded-lg bg-brand-light text-brand font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mini-carte localisation */}
          {coords && annonce.ville && (
            <div className="mt-6">
              <h2 className="font-semibold text-neutral-900 mb-3">Localisation</h2>
              <MiniMap lat={coords.lat} lng={coords.lng} ville={annonce.ville} />
            </div>
          )}

          {/* Profil titulaire */}
          {annonce.titulaire && (
            <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm mt-6">
              <h2 className="font-semibold text-neutral-900 mb-4">Publie par</h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center">
                  <User size={24} className="text-brand" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">{annonce.titulaire.first_name ?? 'Titulaire'}</p>
                  <div className="flex items-center gap-3 text-sm text-neutral-500">
                    {annonce.titulaire.rpps_verified && (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={12} /> RPPS verifie
                      </span>
                    )}
                    {annonce.titulaire.score_fiabilite !== null && annonce.titulaire.score_fiabilite > 0 && (
                      <span className="flex items-center gap-1">
                        <Star size={12} className="text-amber-500 fill-amber-500" />
                        {annonce.titulaire.score_fiabilite.toFixed(1)}
                      </span>
                    )}
                    <span>
                      Membre depuis {new Date(annonce.titulaire.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Annonces similaires */}
          <SimilarAnnonces annonceId={annonce.id} />
        </div>

        {/* Colonne droite — sticky aside : decision uniquement (prix + CTA + trust) */}
        <aside className="hidden lg:block lg:self-start lg:sticky lg:top-28">
          <div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-3xl font-bold text-neutral-900 mb-1">
                {retro}%
              </p>
              <p className="text-sm text-neutral-500">de retrocession</p>
            </div>

            {isNative ? (
              <PostulerButton annonceId={annonce.id} />
            ) : (
              <>
                <p className="text-sm text-neutral-600 mb-4">
                  Cette annonce provient d&apos;une source partenaire.
                </p>
                {annonce.source_url && (
                  <a
                    href={annonce.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors"
                  >
                    Voir sur la source <ExternalLink size={14} />
                  </a>
                )}
              </>
            )}

            <div className="border-t border-neutral-100 mt-6 pt-4">
              <p className="text-xs text-neutral-400">
                Annonce publiee le {new Date(annonce.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Promo app mobile — section dediee, sortie de la card de decision (evite de diluer le CTA primaire) */}
      <section className="mt-12 bg-white/60 rounded-2xl border border-neutral-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-semibold text-neutral-900 text-lg">Gerez vos remplacements en mobilite</h2>
          <p className="text-sm text-neutral-500 mt-1">
            L&apos;app JIM est disponible sur iOS et Android.
          </p>
        </div>
        <StoreButtons size="sm" />
      </section>

      {/* Barre CTA flottante — mobile/tablette uniquement (le sticky aside prend le relais en >= lg) */}
      <MobileCtaBar
        annonceId={annonce.id}
        retro={retro}
        isNative={isNative}
        sourceUrl={annonce.source_url ?? null}
      />
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-medium text-neutral-900 capitalize">{value}</p>
    </div>
  );
}
