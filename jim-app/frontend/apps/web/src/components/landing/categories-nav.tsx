'use client';

// Navigation categories — pills horizontales sans icones
import { useRouter, useSearchParams } from 'next/navigation';

interface Category {
  label: string;
  /** Parametre URL a ajouter. null = "Toutes" (supprime le filtre) */
  param: { key: string; value: string } | null;
}

const CATEGORIES: Category[] = [
  { label: 'Toutes', param: null },
  { label: 'Remplacement', param: { key: 'type', value: 'remplacement' } },
  { label: 'Assistanat', param: { key: 'type', value: 'assistanat' } },
  { label: 'Collaboration', param: { key: 'type', value: 'collaboration' } },
  { label: 'Cession', param: { key: 'type', value: 'cession' } },
  { label: 'Urgentes', param: { key: 'is_urgent', value: 'true' } },
];

export function CategoriesNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeType = searchParams.get('type');
  const activeUrgent = searchParams.get('is_urgent');

  function handleClick(cat: Category) {
    const params = new URLSearchParams(searchParams.toString());
    // Supprimer les filtres de categorie existants
    params.delete('type');
    params.delete('is_urgent');
    params.delete('page'); // Revenir a la page 1

    // Ajouter le nouveau filtre
    if (cat.param) {
      params.set(cat.param.key, cat.param.value);
    }

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : '/');
  }

  function isActive(cat: Category): boolean {
    if (!cat.param) return !activeType && !activeUrgent;
    if (cat.param.key === 'type') return activeType === cat.param.value;
    if (cat.param.key === 'is_urgent') return activeUrgent === 'true';
    return false;
  }

  return (
    <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
      {CATEGORIES.map((cat) => {
        const active = isActive(cat);
        return (
          <button
            key={cat.label}
            onClick={() => handleClick(cat)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
              active
                ? 'bg-white text-brand shadow-sm'
                : 'bg-white/60 backdrop-blur text-slate-500 hover:bg-white/80 hover:text-slate-700'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
