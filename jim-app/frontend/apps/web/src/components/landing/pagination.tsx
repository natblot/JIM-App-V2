import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** URL de base pour la navigation (ex: "/") */
  basePath?: string;
  /** Params a conserver dans l'URL */
  preserveParams?: Record<string, string>;
}

// Pagination server-side — liens <a> pour le SEO
export function Pagination({
  currentPage,
  totalPages,
  basePath = '/',
  preserveParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(page: number): string {
    const params = new URLSearchParams(preserveParams);
    if (page > 1) params.set('page', page.toString());
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  // Pages a afficher (max 5 autour de la page courante)
  const pages: number[] = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      {/* Previous */}
      {currentPage > 1 ? (
        <a
          href={buildHref(currentPage - 1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
          aria-label="Page precedente"
        >
          <ChevronLeft size={18} />
        </a>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-xl text-neutral-300 cursor-not-allowed">
          <ChevronLeft size={18} />
        </span>
      )}

      {/* Premiere page si hors range */}
      {start > 1 && (
        <>
          <a
            href={buildHref(1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            1
          </a>
          {start > 2 && <span className="text-neutral-400 px-1">...</span>}
        </>
      )}

      {/* Pages */}
      {pages.map((page) => (
        <a
          key={page}
          href={buildHref(page)}
          className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-brand text-white'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </a>
      ))}

      {/* Derniere page si hors range */}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-neutral-400 px-1">...</span>}
          <a
            href={buildHref(totalPages)}
            className="flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            {totalPages}
          </a>
        </>
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <a
          href={buildHref(currentPage + 1)}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-neutral-600 hover:bg-neutral-100 transition-colors"
          aria-label="Page suivante"
        >
          <ChevronRight size={18} />
        </a>
      ) : (
        <span className="flex items-center justify-center w-10 h-10 rounded-xl text-neutral-300 cursor-not-allowed">
          <ChevronRight size={18} />
        </span>
      )}
    </nav>
  );
}
