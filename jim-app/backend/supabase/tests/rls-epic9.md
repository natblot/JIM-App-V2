# Tests RLS — Epic 9 : Paiement Securise Stripe Connect

## Comptes test

| Compte | Role | Description |
|--------|------|-------------|
| User A | titulaire | Titulaire avec Stripe verifie |
| User B | remplacant | Remplacant avec Stripe + RCP verifie |
| User C | titulaire | Autre titulaire (ne doit rien voir) |
| User D | remplacant | Autre remplacant (ne doit rien voir) |

## Tests table `paiements`

### SELECT

- [x] User A (titulaire) voit les paiements ou `titulaire_id = A`
- [x] User B (remplacant) voit les paiements ou `remplacant_id = B`
- [x] User C ne voit PAS les paiements de A/B
- [x] User D ne voit PAS les paiements de A/B
- [x] Utilisateur non authentifie → acces refuse

### INSERT

- [x] User A (titulaire) peut creer un paiement avec `titulaire_id = A`
- [x] User A ne peut PAS creer un paiement avec `titulaire_id = C` (autre titulaire)
- [x] User B (remplacant) ne peut PAS creer un paiement (seul le titulaire INSERT)
- [x] Contrainte `paiements_source_ne_destination` : `titulaire_id != remplacant_id`
- [x] Contrainte `paiements_unique_contrat` : un seul paiement par contrat

### UPDATE

- [x] User B peut contester un paiement `en_attente_validation` ou `remplacant_id = B`
- [x] User B ne peut PAS modifier le montant (seulement le statut → `conteste`)
- [x] User A peut modifier un paiement `brouillon` ou `conteste`
- [x] User A ne peut PAS modifier un paiement `en_cours` ou `confirme`
- [x] service_role peut UPDATE n'importe quel paiement (webhooks)

### DELETE

- [x] Aucun utilisateur ne peut DELETE un paiement (pas de policy DELETE)
- [x] Meme service_role ne peut pas DELETE (archivage permanent)

## Tests table `abonnements_pro`

### SELECT

- [x] User A voit son propre abonnement
- [x] User C ne voit PAS l'abonnement de User A
- [x] Utilisateur non authentifie → acces refuse

### INSERT / UPDATE

- [x] Les utilisateurs ne peuvent PAS INSERT directement (service_role uniquement)
- [x] Les utilisateurs ne peuvent PAS UPDATE directement (service_role uniquement)
- [x] service_role peut INSERT et UPDATE (Edge Functions)

## Tests colonnes `profiles` (Stripe)

- [x] User A peut lire son `stripe_onboarding_status` et `is_pro`
- [x] User A ne peut PAS modifier `is_pro` directement (via Edge Function uniquement)
- [x] User A ne peut PAS modifier `launch_period_active` (admin uniquement)

## Securite donnees financieres

- [x] Aucun IBAN, numero de carte ou detail bancaire dans la table `paiements`
- [x] Seuls les IDs Stripe (`stripe_payment_intent_id`, `stripe_transfer_id`) sont stockes
- [x] Les notifications ne contiennent PAS le montant dans le payload (NFR18)
- [x] Le recu PDF ne contient pas de donnees bancaires
