// Formate une date en texte "Il y a Xh" pour les badges de fraîcheur
// Utilisé dans les badges "Vérifié il y a Xh" des annonces agrégées

export function formatFreshness(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Non vérifié';

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Non vérifié';

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays === 1) return 'Il y a 1 jour';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`;
}
