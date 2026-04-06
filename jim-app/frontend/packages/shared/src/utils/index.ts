export { formatFreshness } from './format-freshness';
// Détection phishing — Epic 6
export { detectPhishing } from './phishing-detector';
export type { PhishingLink, PhishingResult } from './phishing-detector';
// Payloads push FCM — Epic 7
export { buildPushPayload, containsPersonalData } from './notification-payload';
export type { PushPayload } from './notification-payload';
// Génération PDF contrats — Epic 8
export { generateContratHtml } from './contrat-pdf';
// Détection runtime — Expo Go vs Dev Build
export { isExpoGo, isDevBuild, getRuntimeLabel } from './runtime';
