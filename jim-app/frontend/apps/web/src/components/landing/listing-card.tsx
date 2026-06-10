'use client';

import Link from 'next/link';
import { useRef, useState, useCallback } from 'react';
import { MapPin } from 'lucide-react';

export interface ListingData {
  id: string;
  image?: string;
  ville: string;
  rating?: number;
  reviewCount?: number;
  description: string;
  retrocessionPct: number;
  specialites?: string[] | undefined;
  isUrgent?: boolean | undefined;
  isRppsVerified?: boolean | undefined;
  source?: string | undefined;
  dateDebut?: string | undefined;
  dateFin?: string | undefined;
}

// Formate une date ISO "YYYY-MM-DD" en "15 juin" / "1ᵉʳ juil."
function fmtDate(iso: string | undefined): string {
  if (!iso) return '–';
  const d = new Date(iso + 'T00:00:00');
  const day = d.getDate();
  const month = d.toLocaleDateString('fr-FR', { month: 'short' });
  const suffix = day === 1 ? 'ᵉʳ' : '';
  return `${day}${suffix} ${month}`;
}

// Hash simple pour alterner les skylines
function seedFromId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = ((h << 5) - h + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function SkylineSvg({ seed }: { seed: number }) {
  const warm = seed % 2 === 0;
  const id = `sky${seed % 16}`;
  return (
    <svg viewBox="0 0 360 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={warm ? '#ffd9c2' : '#ffe7c2'} />
          <stop offset=".6" stopColor={warm ? '#ffc5b3' : '#f6c98e'} />
          <stop offset="1" stopColor={warm ? '#e8bb9a' : '#d99c5b'} />
        </linearGradient>
      </defs>
      <rect width="360" height="200" fill={`url(#${id})`} />
      <circle cx="280" cy="62" r="28" fill="#fff" opacity=".45" />
      <path d="M0,150 Q90,110 180,140 T360,125 L360,200 L0,200 Z" fill="#3a1f08" opacity=".12" />
      <g fill="#3a1f08" opacity=".32">
        <rect x="40" y="130" width="24" height="50" />
        <rect x="64" y="115" width="18" height="65" />
        <rect x="82" y="125" width="20" height="55" />
        <rect x="112" y="100" width="28" height="80" />
        <polygon points="126,70 130,100 140,100 140,85" />
        <rect x="150" y="130" width="16" height="50" />
        <rect x="168" y="120" width="22" height="60" />
        <rect x="200" y="140" width="18" height="40" />
        <rect x="222" y="110" width="26" height="70" />
        <rect x="255" y="130" width="20" height="50" />
        <rect x="290" y="120" width="24" height="60" />
        <rect x="320" y="135" width="18" height="45" />
      </g>
      <rect x="0" y="180" width="360" height="20" fill="#3a1f08" opacity=".2" />
    </svg>
  );
}

function MapView({ isActive }: { isActive: boolean }) {
  return (
    <div className={`absolute inset-0 bg-[#efe6dc] transition-opacity duration-[450ms] ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-hidden>
      {/* Routes */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        {[
          { x1: 0, y1: 35, x2: 100, y2: 35, w: 5, o: .28, cls: isActive ? 'road-anim-main' : '' },
          { x1: 0, y1: 65, x2: 100, y2: 65, w: 5, o: .28, cls: isActive ? 'road-anim-main' : '' },
          { x1: 30, y1: 0, x2: 30, y2: 100, w: 3, o: .22, cls: isActive ? 'road-anim-mid' : '' },
          { x1: 70, y1: 0, x2: 70, y2: 100, w: 3, o: .22, cls: isActive ? 'road-anim-mid' : '' },
          { x1: 0, y1: 20, x2: 100, y2: 20, w: 1.5, o: .10, cls: isActive ? 'road-anim-sec' : '' },
          { x1: 0, y1: 50, x2: 100, y2: 50, w: 1.5, o: .10, cls: isActive ? 'road-anim-sec' : '' },
          { x1: 0, y1: 80, x2: 100, y2: 80, w: 1.5, o: .10, cls: isActive ? 'road-anim-sec' : '' },
          { x1: 15, y1: 0, x2: 15, y2: 100, w: 1.5, o: .10, cls: isActive ? 'road-anim-sec' : '' },
          { x1: 50, y1: 0, x2: 50, y2: 100, w: 1.5, o: .10, cls: isActive ? 'road-anim-sec' : '' },
          { x1: 85, y1: 0, x2: 85, y2: 100, w: 1.5, o: .10, cls: isActive ? 'road-anim-sec' : '' },
        ].map((r, i) => (
          <line
            key={i}
            x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2}
            stroke="#3a1f08"
            strokeOpacity={r.o}
            strokeWidth={r.w}
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset={isActive ? undefined : '1'}
            pathLength="1"
            className={r.cls}
          />
        ))}
      </svg>
      {/* Bâtiments */}
      {[
        { top: '40%', left: '10%', w: '15%', h: '18%' },
        { top: '15%', left: '35%', w: '12%', h: '14%' },
        { top: '70%', left: '74%', w: '18%', h: '18%' },
        { top: '20%', right: '10%', w: '10%', h: '22%' },
        { top: '55%', left: '5%', w: '8%', h: '11%' },
        { top: '8%', left: '75%', w: '14%', h: '9%' },
      ].map((b, i) => (
        <div
          key={i}
          className="absolute rounded-sm"
          style={{
            ...b,
            width: b.w, height: b.h,
            background: 'rgba(58,31,8,0.22)',
            border: '1px solid rgba(58,31,8,0.12)',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'scale(1)' : 'scale(0.7)',
            transition: `opacity 0.35s ease ${0.32 + i * 0.08}s, transform 0.35s cubic-bezier(0.34,1.56,0.34,1) ${0.32 + i * 0.08}s`,
          }}
        />
      ))}
      {/* Pin corail */}
      <svg
        className="absolute top-1/2 left-1/2"
        width="30" height="30" viewBox="0 0 24 24" fill="none"
        style={{
          transform: `translate(-50%,-60%) scale(${isActive ? 1 : 0})`,
          transition: 'transform 0.5s cubic-bezier(0.34,1.7,0.34,1) 0.55s',
          filter: 'drop-shadow(0 4px 10px rgba(255,124,92,.55))',
        }}
      >
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ff7c5c" />
        <circle cx="12" cy="9" r="2.6" fill="#fff" />
      </svg>
    </div>
  );
}

// Card annonce — variante horizontale avec skyline + map toggle + 3D tilt
export function ListingCard({ listing }: { listing: ListingData }) {
  const [isMap, setIsMap] = useState(false);
  const [saved, setSaved] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const txRef = useRef(0);
  const tyRef = useRef(0);
  const cxRef = useRef(0);
  const cyRef = useRef(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const tiltLoop = useCallback(() => {
    if (!cardRef.current) return;
    cxRef.current = lerp(cxRef.current, txRef.current, 0.15);
    cyRef.current = lerp(cyRef.current, tyRef.current, 0.15);
    cardRef.current.style.transform = `rotateX(${cyRef.current}deg) rotateY(${cxRef.current}deg) translateZ(0)`;
    if (Math.abs(cxRef.current - txRef.current) > 0.02 || Math.abs(cyRef.current - tyRef.current) > 0.02) {
      rafRef.current = requestAnimationFrame(tiltLoop);
    } else {
      rafRef.current = null;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    txRef.current = ((e.clientX - r.left) / r.width - 0.5) * 8;
    tyRef.current = -((e.clientY - r.top) / r.height - 0.5) * 6;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tiltLoop);
  }, [tiltLoop]);

  const handleMouseLeave = useCallback(() => {
    txRef.current = 0;
    tyRef.current = 0;
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tiltLoop);
  }, [tiltLoop]);

  const seed = seedFromId(listing.id);
  const isVerified = listing.isRppsVerified ?? listing.source === 'native';

  return (
    <div
      ref={wrapRef}
      className="annonce-card relative"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        className="flex flex-col sm:flex-row bg-jim-surface rounded-[20px] overflow-hidden border border-[rgba(58,31,8,0.08)] min-h-[200px]"
        style={{
          boxShadow: '0 1px 2px rgba(58,31,8,.04), 0 4px 12px rgba(58,31,8,.05)',
          transition: 'box-shadow 0.35s cubic-bezier(0.2,0.8,0.2,1)',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Zone photo */}
        <div
          className={`relative flex-shrink-0 cursor-pointer overflow-hidden transition-[width] duration-[550ms] ease-[cubic-bezier(.34,1.2,.34,1)] ${isMap ? 'w-full sm:w-[340px]' : 'w-full sm:w-[240px]'} h-[150px] sm:h-auto sm:self-stretch`}
          onClick={() => setIsMap((m) => !m)}
          role="button"
          tabIndex={-1}
          aria-label={isMap ? 'Voir le visuel' : 'Voir sur la carte'}
        >
          {/* Skyline SVG */}
          <div className={`absolute inset-0 transition-opacity duration-[450ms] ${isMap ? 'opacity-0' : 'opacity-100'}`}>
            <SkylineSvg seed={seed} />
          </div>
          {/* Vue carte */}
          <MapView isActive={isMap} />

          {/* Top overlay — candidats + bouton sauvegarder */}
          <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between z-10">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/96 text-jim-text text-[11px] font-bold shadow-[0_1px_3px_rgba(58,31,8,.10)]">
              <span className="w-1.5 h-1.5 rounded-full bg-jim-primary flex-shrink-0" />
              2 candidats
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSaved((s) => !s); }}
              aria-label={saved ? 'Retirer des favoris' : 'Sauvegarder'}
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white hover:text-jim-primary hover:scale-110 transition-all"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(58,31,8,.35))' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill={saved ? '#ff7c5c' : 'none'} stroke={saved ? '#ff7c5c' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Corps de la carte */}
        <div className="flex-1 flex flex-col justify-between p-3.5 min-w-0">
          {/* En-tête */}
          <div className="mb-3">
            <h4 className="text-[16px] font-extrabold text-jim-text m-0 tracking-[-0.02em] leading-[1.2]">
              {listing.ville}
            </h4>
            <p className="flex items-center gap-1 mt-1 text-[11px] text-jim-text-body font-medium">
              <MapPin size={11} className="text-jim-primary flex-shrink-0" />
              {listing.description}
            </p>
            {listing.specialites && listing.specialites.length > 0 && (
              <p className="flex items-center gap-1.5 mt-0.5 text-[11px] text-jim-muted font-medium">
                <strong className="text-jim-text-body font-semibold">Libéral</strong>
                <span className="opacity-50">·</span>
                <span>{listing.specialites[0]}</span>
              </p>
            )}
          </div>

          {/* Bloc dates + rétrocession */}
          <div className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2 bg-jim-surface-alt rounded-xl p-2.5 mb-3">
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-bold text-jim-muted uppercase tracking-[0.12em] mb-[3px]">du</span>
              <span className="text-[13px] font-extrabold text-jim-text tracking-[-0.01em]">{fmtDate(listing.dateDebut)}</span>
            </div>
            <span className="text-[12px] font-bold text-jim-primary">→</span>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-bold text-jim-muted uppercase tracking-[0.12em] mb-[3px]">au</span>
              <span className="text-[13px] font-extrabold text-jim-text tracking-[-0.01em]">{fmtDate(listing.dateFin)}</span>
            </div>
            <div className="flex flex-col items-end pl-2.5 border-l border-jim-beige-mid leading-none">
              <span className="text-[16px] font-extrabold text-jim-primary tracking-[-0.02em]">{listing.retrocessionPct}%</span>
              <span className="text-[9px] font-bold text-jim-muted uppercase tracking-[0.12em] mt-[3px]">rétro</span>
            </div>
          </div>

          {/* Pied de carte */}
          <div className="flex items-center justify-between gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-jim-success tracking-[0.02em]">
                <span className="w-3.5 h-3.5 rounded-full bg-jim-success-bg text-jim-success flex items-center justify-center flex-shrink-0">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Vérifié
              </span>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsMap((m) => !m); }}
                aria-label="Voir sur la carte"
                className={`inline-flex items-center gap-1.5 h-[30px] px-3 rounded-[9px] border text-[12px] font-bold tracking-[-0.005em] cursor-pointer transition-all ${
                  isMap
                    ? 'bg-jim-text text-white border-jim-text'
                    : 'bg-white text-jim-text border-jim-beige-mid hover:bg-jim-surface-alt hover:text-jim-primary hover:border-jim-primary/30'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: isMap ? '#ff7c5c' : '#34c97d', boxShadow: isMap ? '0 0 0 3px rgba(255,124,92,.25)' : '0 0 0 3px rgba(52,201,125,.2)' }}
                />
                Carte
              </button>
              <Link
                href={`/annonce/${listing.id}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 h-[30px] px-3 rounded-[9px] bg-jim-primary text-white text-[12px] font-bold tracking-[-0.005em] hover:bg-jim-accent transition-colors"
              >
                Postuler
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
