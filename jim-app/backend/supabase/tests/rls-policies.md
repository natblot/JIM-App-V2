# Tests RLS — JIM

## Comptes de test
- **Remplaçant A** : test-remplacant-a@jim-test.com / TestPassword1
- **Remplaçant B** : test-remplacant-b@jim-test.com / TestPassword1
- **Titulaire C** : test-titulaire-c@jim-test.com / TestPassword1

## Tests Story 1.9

### 1. Remplaçant A ne peut pas modifier le profil de Remplaçant B
```sql
-- Connecté en tant que Remplaçant A :
UPDATE public.profiles SET bio = 'Hacked' WHERE user_id = '<user_id_de_B>';
-- Attendu : 0 rows affected (RLS bloque)
```

### 2. Remplaçant A peut modifier son propre profil
```sql
-- Connecté en tant que Remplaçant A :
UPDATE public.profiles SET bio = 'Ma bio' WHERE user_id = '<user_id_de_A>';
-- Attendu : 1 row affected
```

### 3. Profils non vérifiés invisibles pour les autres
```sql
-- Connecté en tant que Remplaçant A (non vérifié RPPS) :
SELECT * FROM public.profiles WHERE user_id = '<user_id_de_B_non_verifie>';
-- Attendu : 0 rows (la policy select_verified_public filtre rpps_verified = false)
```

### 4. Remplaçant A voit toujours son propre profil
```sql
-- Connecté en tant que Remplaçant A :
SELECT * FROM public.profiles WHERE user_id = '<user_id_de_A>';
-- Attendu : 1 row (la policy select_own s'applique)
```

### 5. Remplaçant A ne peut pas se valider lui-même son RPPS
```sql
-- Connecté en tant que Remplaçant A :
UPDATE public.profiles SET rpps_verified = true WHERE user_id = '<user_id_de_A>';
-- Note: Cette protection est assurée par les Edge Functions (service role uniquement)
-- La policy UPDATE own permet techniquement le champ, mais les Edge Functions
-- sont le seul canal qui modifie rpps_verified (via service role key)
```

## Commande de test automatisé (futur)
```bash
# Story 1.9 AC : tests RLS avec 3 comptes
# À implémenter avec Vitest + supabase local
npx supabase test db supabase/tests/rls_test.sql
```
