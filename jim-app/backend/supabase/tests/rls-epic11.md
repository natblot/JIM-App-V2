# Tests RLS — Epic 11 : Reputation, Parrainage & Extensions

## Table `avis`

### SELECT
- [x] Tout utilisateur authentifie peut voir les avis (lecture publique)
- [x] Les avis < 7j ont auteur_id masque cote applicatif (pas cote RLS)

### INSERT
- [x] Seul l'auteur (auth.uid()) peut inserer
- [x] Le contrat doit etre confirme
- [x] L'auteur doit etre partie du contrat (titulaire ou remplacant)
- [x] Le destinataire est l'autre partie du contrat
- [x] Auto-notation impossible (CHECK auteur != destinataire)
- [x] Double notation meme contrat/auteur impossible (UNIQUE)

### UPDATE / DELETE
- [x] Aucune policy UPDATE ni DELETE → immutable

## Table `parrainages`

### SELECT
- [x] Parrain voit ses parrainages
- [x] Filleul voit son parrainage
- [x] User C ne voit PAS les parrainages de A/B

### INSERT / UPDATE
- [x] service_role uniquement (Edge Functions)

## Table `propositions_directes`

### SELECT
- [x] Les deux parties voient la proposition
- [x] User C ne voit PAS les propositions de A/B

### INSERT
- [x] Seul le titulaire (auth.uid()) peut creer
- [x] Le remplacant doit etre dans les favoris du titulaire
- [x] titulaire != remplacant (CHECK)

### UPDATE
- [x] Seul le remplacant peut repondre (accepter/decliner)
- [x] Seulement si status = envoyee
- [x] Le titulaire ne peut PAS modifier une proposition envoyee

## Securite specifique

- [x] Le score de fiabilite est recalcule cote serveur (trigger)
- [x] Le code parrainage est unique et genere cote serveur
- [x] Le badge Ambassadeur est active cote serveur
- [x] Le switch de role est interdit pendant un remplacement en cours
- [x] L'annonce creee par proposition directe n'est PAS publique
