# Audit Sécurité — Epic 4 Recherche & Découverte

**Date :** 2026-03-26
**Auditeur :** security-auditor (autonome)
**Périmètre :** SECURITY DEFINER, rate limiting, géolocation, deep links, cache offline, données personnelles

---

## Résumé des findings

| # | Point d'audit | Statut | Action |
|---|---------------|--------|--------|
| 1 | SECURITY DEFINER — `search_annonces_geo` : filtres statut + colonnes | CONFORME | — |
| 2 | SECURITY DEFINER — `search_annonces_bbox` : filtres statut + colonnes minimales | CONFORME | — |
| 3 | SECURITY DEFINER — `annonces_similaires` : exclusion annonce source + filtre statut | CONFORME | — |
| 4 | SECURITY DEFINER — `retrocession_moyenne_zone` : filtre statut | CONFORME | — |
| 5 | GRANT EXECUTE : toutes les fonctions limitées à `authenticated` (pas `anon`) | CONFORME | — |
| 6 | Données personnelles absentes des résultats de recherche | CONFORME | — |
| 7 | Rate limiting — table `search_rate_limits` avec RLS activé | CONFORME | — |
| 8 | Rate limiting — `check_search_rate_limit` : fenêtre glissante par heure, limite 100 | CONFORME | — |
| 9 | Rate limiting — `cleanup_search_rate_limits` : grant restreint à `service_role` | CONFORME | — |
| 10 | Cache MMKV offline — pas de données d'auth dans `OfflineStore` | CONFORME | — |
| 11 | Cache MMKV offline — limite 1000 annonces (FIFO) respectée | CONFORME | — |
| 12 | `useUIStore` en mémoire — `userLocation` non persisté dans MMKV | CONFORME | — |
| 13 | Deep link `annonce/[id]` — UUID utilisé directement sans validation explicite | ATTENTION | Voir détail |
| 14 | Géolocation — usage de `requestForegroundPermissionsAsync` non vérifié | ATTENTION | Voir détail |
| 15 | `useAnnonceDetail` — `select('*')` sur la table `annonces` | ATTENTION | Voir détail |
| 16 | Rate limiting — application côté DB uniquement (pas d'Edge Function) | RÉSIDUEL | Post-MVP |

---

## Détail des findings

### CONFORME — Fonctions SECURITY DEFINER : filtres statut

**Migration :** `022_search_annonces_geo.sql`

Les quatre fonctions filtrent toutes explicitement sur `statut IN ('active', 'en_cours', 'non_confirmee', 'source_externe')`, ce qui exclut les statuts `'pourvue'` et `'expiree'`. Aucune annonce clôturée ou expirée ne peut être retournée.

- `search_annonces_geo` : filtre ligne 79.
- `search_annonces_bbox` : filtre ligne 132.
- `annonces_similaires` : filtre ligne 227 (exclut aussi `'non_confirmee'` dans les similaires — comportement intentionnel et plus strict).
- `retrocession_moyenne_zone` : filtre ligne 161 + contrainte `created_at >= NOW() - INTERVAL '6 months'`.

### CONFORME — Fonctions SECURITY DEFINER : colonnes retournées

Aucune fonction ne fait `SELECT *`. Les colonnes retournées sont explicitement listées :

- `search_annonces_geo` retourne 17 colonnes publiques : aucune donnée personnelle (email, téléphone, nom du titulaire, adresse exacte). `profile_id` est un UUID opaque sans information personnelle.
- `search_annonces_bbox` retourne 9 colonnes strictement nécessaires au rendu carte.
- `annonces_similaires` retourne 10 colonnes publiques sans `profile_id` ni `code_postal`.
- `retrocession_moyenne_zone` retourne une seule valeur agrégée (`NUMERIC`).

### CONFORME — annonces_similaires : exclusion de l'annonce source

La fonction exclut explicitement l'annonce source via `a.id != p_annonce_id` (ligne 226). Elle ne retourne que des annonces similaires actives et futures (`date_debut >= CURRENT_DATE`). L'accès aux coordonnées de l'annonce source est une lecture interne à la fonction SECURITY DEFINER ; la localisation n'est pas retournée directement au client.

### CONFORME — GRANT EXECUTE limité à authenticated

Les quatre fonctions de recherche sont accordées uniquement à `authenticated` :

```sql
GRANT EXECUTE ON FUNCTION search_annonces_geo TO authenticated;
GRANT EXECUTE ON FUNCTION search_annonces_bbox TO authenticated;
GRANT EXECUTE ON FUNCTION retrocession_moyenne_zone TO authenticated;
GRANT EXECUTE ON FUNCTION annonces_similaires TO authenticated;
```

Le rôle `anon` ne peut pas appeler ces fonctions. Cohérent avec les RLS existantes sur la table `annonces`.

### CONFORME — Données personnelles absentes des résultats de recherche

Les hooks `useSearchAnnonces` et `useAnnoncesSimilaires` ne reçoivent que les données retournées par les fonctions RPC, qui ne contiennent ni email, ni téléphone, ni nom, ni prénom du titulaire. Le `profile_id` (UUID) est présent dans `search_annonces_geo` mais c'est un identifiant opaque sans valeur pour un attaquant. Conforme à la règle JIM : le profil complet est accessible uniquement sur le détail après acceptance.

### CONFORME — Rate limiting : RLS et structure

**Migration :** `023_search_rate_limiting.sql`

- `ALTER TABLE search_rate_limits ENABLE ROW LEVEL SECURITY` : activé.
- Policy `search_rate_limits_own` : `USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid())` — chaque utilisateur ne voit que ses propres lignes.
- Clé primaire composite `(user_id, window_start)` : une ligne par heure, pas de fuites inter-utilisateurs.

### CONFORME — Rate limiting : fenêtre glissante et limite 100

La fonction `check_search_rate_limit` utilise `date_trunc('hour', NOW())` comme fenêtre. L'UPSERT atomique (`ON CONFLICT DO UPDATE SET request_count = request_count + 1`) évite les race conditions. Le retour `v_count <= 100` bloque à partir de 101 requêtes dans l'heure. Le SECURITY DEFINER permet l'incrémentation sans que l'utilisateur puisse manipuler la table directement.

### CONFORME — Rate limiting : nettoyage restreint au service_role

```sql
GRANT EXECUTE ON FUNCTION cleanup_search_rate_limits TO service_role;
```

Les utilisateurs `authenticated` ne peuvent pas appeler la fonction de nettoyage. La fenêtre de rétention de 48h est raisonnable.

### CONFORME — OfflineStore : pas de tokens ni données d'auth

**Fichier :** `packages/shared/src/stores/offline.store.ts`

Le store `useOfflineStore` ne contient que :
- `isOnline` (booléen réseau)
- `cachedAnnonces` (tableau d'`AnnonceRow`)

Aucun token JWT, session, refresh token, ou donnée personnelle n'est stocké dans ce store. Le store est en mémoire (Zustand sans middleware `persist`). Conforme.

### CONFORME — OfflineStore : limite 1000 annonces (FIFO)

```typescript
const MAX_CACHE = 1000;
// ...
return { cachedAnnonces: merged.slice(0, MAX_CACHE) };
```

La déduplification par `id` et la troncature FIFO sont correctement implémentées. Les nouvelles annonces sont prioritaires (insérées en tête).

### CONFORME — userLocation en mémoire, non persisté

**Fichier :** `packages/shared/src/stores/ui.store.ts`

`useUIStore` est un store Zustand sans middleware `persist`. `userLocation` est stocké en mémoire uniquement et disparaît à chaque fermeture de l'app. Conforme : la position exacte de l'utilisateur n'est pas écrite sur disque (MMKV ou AsyncStorage).

Note : le commentaire de l'en-tête mentionne "Store UI persisté" mais le code ne contient aucun middleware `persist`. Il s'agit d'une imprécision dans le commentaire, pas d'un problème de sécurité.

---

### ATTENTION — Deep link annonce/[id] : validation UUID non explicite

**Fichier :** `apps/mobile/app/(app)/annonce/[id].tsx`

```typescript
const { id } = useLocalSearchParams<{ id: string }>();
// ...
const { data: annonce, isLoading } = useAnnonce(supabase, id ?? '');
```

L'`id` extrait de l'URL est passé directement au hook `useAnnonce` sans validation UUID préalable côté JavaScript. La protection repose entièrement sur PostgreSQL qui valide le type UUID (toute valeur malformée provoque une erreur Supabase propre, sans injection).

**Niveau de risque :** Faible. PostgreSQL valide le type UUID avant exécution, l'injection SQL est impossible via `.eq('id', id)` (requête paramétrée). En revanche, un UUID syntaxiquement valide mais inexistant retourne simplement `null` (Supabase `.single()` retourne une erreur `PGRST116`).

**Recommandation post-MVP :** Ajouter une validation regex UUID côté hook (`/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i`) avant la requête pour une meilleure UX d'erreur (message explicite vs erreur Supabase brute). Aucun vecteur d'injection identifié.

---

### ATTENTION — Géolocation : implémentation expo-location non vérifiée dans le code source

**Recherche :** Aucun appel à `expo-location` ou `requestForegroundPermissionsAsync` n'a été trouvé dans `apps/mobile/` ou `packages/shared/src/`.

**Analyse :** Le store `useUIStore` expose `setUserLocation()` et `userLocation`, mais le composant ou hook qui appelle effectivement `expo-location` pour alimenter ce store n'a pas été créé lors de cette Epic. L'écran `index.tsx` n'appelle pas de géolocation. Les hooks `useSearchAnnonces` et `useMapAnnonces` reçoivent les coordonnées en paramètre mais ne les récupèrent pas eux-mêmes.

**Implication :** La fonctionnalité de géolocation automatique n'est pas encore implémentée côté frontend. Quand elle le sera, il faudra s'assurer que :
- `requestForegroundPermissionsAsync()` est utilisé (jamais Background sans justification claire)
- La position n'est pas loggée dans les analytics avec données personnelles
- La position alimente `useUIStore.setUserLocation()` (en mémoire) uniquement

**Niveau de risque :** Nul pour l'instant (fonctionnalité absente). Risque potentiel si la future implémentation utilise Background location ou persiste la position.

---

### ATTENTION — useAnnonceDetail : select('*') sur la table annonces

**Fichier :** `packages/shared/src/hooks/useAnnonceDetail.ts`

```typescript
const { data, error } = await supabase
  .from('annonces')
  .select('*')
  .eq('id', id)
  .single();
```

La requête `select('*')` retourne toutes les colonnes de la table `annonces`, y compris des champs internes comme `freshness_reminder_j7_at`, `freshness_reminder_j3_at`, `freshness_reminder_count`, `merged_with_native_id`, `source_id`. Ces champs ne sont pas sensibles au sens RGPD (pas de données personnelles) mais exposent de la métadonnée interne inutile côté client.

**Protection en place :** La RLS `annonces_select_public` filtre les annonces non-publiques. Le titulaire voit ses propres annonces via `annonces_select_own`. Les données personnelles du titulaire (email, tel) ne sont pas dans la table `annonces`.

**Niveau de risque :** Faible. Pas de données personnelles exposées. Légère sur-exposition de métadonnées internes (timestamps de relances fraîcheur).

**Recommandation post-MVP :** Remplacer `select('*')` par une sélection explicite des colonnes nécessaires à l'affichage du détail.

---

## Points d'attention résiduels post-MVP

### 1. Rate limiting : couche DB uniquement (NFR16)

L'implémentation actuelle de `check_search_rate_limit` est une couche de protection DB. Elle nécessite que le client l'appelle explicitement — rien n'empêche un client modifié de ne pas appeler `check_search_rate_limit` avant `search_annonces_geo`.

**Solution recommandée post-MVP :** Implémenter le rate limiting dans une Edge Function Supabase qui encapsule les appels RPC et applique la limite avant de les exécuter. Le client ne peut pas bypassser une Edge Function.

### 2. Validation UUID côté client (deep links)

Ajouter une validation regex UUID dans les hooks utilisant un `id` paramètre d'URL pour une gestion d'erreur explicite et cohérente.

### 3. Implémentation de la géolocation expo-location

Lors de l'implémentation du hook de géolocation (prévu pour une prochaine story), vérifier :
- Usage exclusif de `requestForegroundPermissionsAsync()`
- Pas de persistance de la position (ni MMKV, ni AsyncStorage)
- Pas d'envoi de la position brute dans les analytics

### 4. select('*') dans useAnnonceDetail

Limiter la sélection aux colonnes nécessaires au rendu du détail pour réduire la surface d'exposition des métadonnées internes.

### 5. Commentaire trompeur dans ui.store.ts

Le commentaire `// Store UI persisté` est inexact (le store n'est pas persisté). À corriger pour éviter toute confusion lors d'une future implémentation de persistance qui inclurait accidentellement `userLocation`.
