// Construit les payloads push FCM — AUCUNE donnée personnelle (NFR18)
export interface PushPayload {
  title: string;
  body: string;
  data: {
    type: string;
    deep_link: string;
  };
  priority: 'normal' | 'high';
}

// Définition centralisée des payloads par type d'événement
// Les variables entre {} sont substituées par le dispatcher (pas de données perso)
export function buildPushPayload(
  eventType: string,
  context: Record<string, string> = {},
): PushPayload {
  switch (eventType) {
    case 'ANNONCE_CREEE':
      return {
        title: `Nouvelle annonce à ${context.distance ?? '?'} km`,
        body: `${context.ville ?? 'France'}, ${context.dates ?? ''}`,
        data: { type: eventType, deep_link: `annonces/${context.annonce_id ?? ''}` },
        priority: 'normal',
      };
    case 'ANNONCE_URGENTE':
      return {
        title: `⚡ Annonce urgente à ${context.distance ?? '?'} km`,
        body: `${context.ville ?? 'France'}, ${context.dates ?? ''}`,
        data: { type: eventType, deep_link: `annonces/${context.annonce_id ?? ''}` },
        priority: 'high',
      };
    case 'CANDIDATURE_RECUE':
      return {
        title: 'Candidature reçue',
        body: 'Un remplaçant a postulé à votre annonce',
        data: { type: eventType, deep_link: 'mes-annonces' },
        priority: 'normal',
      };
    case 'CANDIDATURE_ACCEPTEE':
      return {
        title: 'Candidature acceptée !',
        body: 'Votre candidature a été retenue',
        data: { type: eventType, deep_link: `conversations/${context.conversation_id ?? ''}` },
        priority: 'high',
      };
    case 'CANDIDATURE_REFUSEE':
      return {
        title: 'Candidature',
        body: 'Le titulaire a choisi un autre profil cette fois',
        data: { type: eventType, deep_link: 'recherche' },
        priority: 'normal',
      };
    case 'MESSAGE_RECU':
      return {
        title: 'Nouveau message',
        body: 'Vous avez reçu un message',
        data: { type: eventType, deep_link: `conversations/${context.conversation_id ?? ''}` },
        priority: 'normal',
      };
    case 'NOTIFICATION_GROUPED':
      return {
        title: 'Nouvelles notifications',
        body: `${context.count ?? 'Plusieurs'} notifications — ouvrez JIM`,
        data: { type: eventType, deep_link: '/' },
        priority: 'normal',
      };
    default:
      return {
        title: 'JIM',
        body: 'Vous avez une nouvelle notification',
        data: { type: eventType, deep_link: '/' },
        priority: 'normal',
      };
  }
}

// Vérifie qu'un payload ne contient pas de données personnelles
export function containsPersonalData(payload: PushPayload): boolean {
  const sensitivePatterns = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/,  // email
    /\b0[67]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\b/,              // téléphone FR
    /\b\d{11}\b/,                                               // RPPS
  ];
  const fullText = `${payload.title} ${payload.body}`;
  return sensitivePatterns.some(p => p.test(fullText));
}
