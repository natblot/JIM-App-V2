import { ListingCard, type ListingData } from './listing-card';
import type { AnnonceRow } from '../../lib/supabase-server';

// Donnees de demo — utilisees quand la DB est vide
const MOCK_LISTINGS: ListingData[] = [
  {
    id: 'mock-1',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPwQ0o8sboi92l_4VYkwtudYJZByNncZPdp5NYxAzPykAJa7NM9LE8Cpp9nB-r2iZEWDNCuCAMBxx6FDpCpRAD3GlqaW95R1vIYcs7fDHIG8mNXmDNfShFPpIP23DNHQcyS6EFITZGtyKKJTxfjNokBr41QgUz_ICdzg228avWU3VjmEBs18jnJapEYZM6VocutCJtB1CkujzkPaKYvAmVSHQSpWq_9xssf7Kv-tgqltCSsx61p-MKqWcWd28jBy-hmn-zkbH9K3pX',
    ville: 'Paris, France',
    rating: 4.9,
    reviewCount: 120,
    description: 'Cabinet de kinesitherapie au coeur du 11e arrondissement, equipe complet avec plateau technique moderne',
    prixJour: 280,
    specialites: ['Ortho', 'Neuro'],
    dateDebut: '2026-05-12',
    dateFin: '2026-05-30',
  },
  {
    id: 'mock-2',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9zsFMpxojX3zIwuu2tP6w_I2wI-7gYv5fGvW3lhU2xllnTLIBs7xVum9M_BC-ziJ0Rf3twvufeaeoVpHZOGH3GEtrXb7V3qJWb0Ja2Bfc8lbwDSP92UeHV0Z7PPdlTpTB00lBIFPtxhXvfYLU0EancMBYRiqx3fMu9M5NYy4y065Tr-wzs9V5nJvwZjHiy3bDNXdsXho27dPcDm7PWulNQWMexFoBvPFYjOSwNOWAQG0SSW2rwxzsGeNVvz4J-fvoif2n-Nf7SsY8',
    ville: 'Lyon, France',
    rating: 4.8,
    reviewCount: 95,
    description: 'Cabinet pluridisciplinaire Part-Dieu, patientele variee en reeducation fonctionnelle et sport',
    prixJour: 310,
    specialites: ['Respi'],
    isUrgent: true,
    dateDebut: '2026-05-05',
    dateFin: '2026-05-16',
  },
  {
    id: 'mock-3',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_2yW9FgB0l-11oUVKPcbmmWv29ysvmeuvYy0cixNsWVMzyiW9hupa-Jsb-CfywkaUFlS08ZOz8gdD8MVZxR9i0h6DsgZP2ImLzdODj1x33eeTtXcUqNrcpmuZgqL-hUw9wHdFbYk8qc9upLam2ZW8PNfXrQJ4Ndg8bwN-lOtGdT7-2zeMpuy_aSsT8A9qOebnlGmaf2ekY8tCIkAEv_QPowdomgvD4uiiFlaLAWfn7_cj-BZKql3oNxYEKCLRulVN0UjVTfZD31Pa',
    ville: 'Marseille, France',
    rating: 4.9,
    reviewCount: 110,
    description: 'Cabinet vue mer pres de la Corniche Kennedy, specialise en reeducation perineale et posturale',
    prixJour: 260,
    specialites: ['Sport', 'Ortho'],
    dateDebut: '2026-06-01',
    dateFin: '2026-06-30',
  },
  {
    id: 'mock-4',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsa0ntoHfIp0A7dlDIWk0l_9azWp4E8qDWIpcSAHSljOPOZgapU9dt_mfazXRwFVqGCCl51bCEN24jnC2Njq-TQqwRIo9Vlf_BiaDP233vAdHoAfIhV0XHykaKw2lho3mlPI1FTMIGuFFCZC9pXhCfT6DFHpIbHzsPkpVzngcuSYln89KkSfcHPB2oZMw-afcuLAB7NsdkCFOTg8ZHzKaFuil99PSWOPCiRqx1Tint4U8zXlWo5vhoFJulQnMSYHM3H5s_FwQBb5UG',
    ville: 'Bordeaux, France',
    rating: 4.9,
    reviewCount: 85,
    description: 'Cabinet des Chartrons, quartier dynamique, patientele fidele en kinesitherapie du sport et geriatrie',
    prixJour: 290,
    specialites: ['Geriatrie'],
    dateDebut: '2026-05-20',
    dateFin: '2026-06-07',
  },
  {
    id: 'mock-5',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_2yW9FgB0l-11oUVKPcbmmWv29ysvmeuvYy0cixNsWVMzyiW9hupa-Jsb-CfywkaUFlS08ZOz8gdD8MVZxR9i0h6DsgZP2ImLzdODj1x33eeTtXcUqNrcpmuZgqL-hUw9wHdFbYk8qc9upLam2ZW8PNfXrQJ4Ndg8bwN-lOtGdT7-2zeMpuy_aSsT8A9qOebnlGmaf2ekY8tCIkAEv_QPowdomgvD4uiiFlaLAWfn7_cj-BZKql3oNxYEKCLRulVN0UjVTfZD31Pa',
    ville: 'Toulouse, France',
    rating: 4.7,
    reviewCount: 63,
    description: 'Cabinet centre-ville proche metro Capitole, reeducation vestibulaire et neurologique',
    prixJour: 250,
    specialites: ['Neuro', 'Vestib'],
    dateDebut: '2026-06-10',
    dateFin: '2026-06-28',
  },
  {
    id: 'mock-6',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9zsFMpxojX3zIwuu2tP6w_I2wI-7gYv5fGvW3lhU2xllnTLIBs7xVum9M_BC-ziJ0Rf3twvufeaeoVpHZOGH3GEtrXb7V3qJWb0Ja2Bfc8lbwDSP92UeHV0Z7PPdlTpTB00lBIFPtxhXvfYLU0EancMBYRiqx3fMu9M5NYy4y065Tr-wzs9V5nJvwZjHiy3bDNXdsXho27dPcDm7PWulNQWMexFoBvPFYjOSwNOWAQG0SSW2rwxzsGeNVvz4J-fvoif2n-Nf7SsY8',
    ville: 'Nantes, France',
    rating: 4.8,
    reviewCount: 72,
    description: 'Cabinet ile de Nantes, patientele jeune et sportive, plateau technique recent',
    prixJour: 270,
    specialites: ['Sport'],
    isUrgent: true,
    dateDebut: '2026-05-08',
    dateFin: '2026-05-22',
  },
  {
    id: 'mock-7',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPwQ0o8sboi92l_4VYkwtudYJZByNncZPdp5NYxAzPykAJa7NM9LE8Cpp9nB-r2iZEWDNCuCAMBxx6FDpCpRAD3GlqaW95R1vIYcs7fDHIG8mNXmDNfShFPpIP23DNHQcyS6EFITZGtyKKJTxfjNokBr41QgUz_ICdzg228avWU3VjmEBs18jnJapEYZM6VocutCJtB1CkujzkPaKYvAmVSHQSpWq_9xssf7Kv-tgqltCSsx61p-MKqWcWd28jBy-hmn-zkbH9K3pX',
    ville: 'Strasbourg, France',
    rating: 4.6,
    reviewCount: 48,
    description: 'Cabinet Petite France, cadre exceptionnel, specialise en reeducation pediatrique et respiratoire',
    prixJour: 240,
    specialites: ['Pediatrie', 'Respi'],
    dateDebut: '2026-06-15',
    dateFin: '2026-07-15',
  },
];

// Transforme une annonce Supabase en ListingData
function annonceToListing(annonce: AnnonceRow): ListingData {
  // Estimation du prix/jour a partir de la retrocession
  const retro = annonce.retrocession ?? 80;
  const prixJour = Math.round(retro * 3.5); // ~estimation moyenne cabinet

  return {
    id: annonce.id,
    ville: annonce.ville ? `${annonce.ville}, France` : 'France',
    description: annonce.description ?? `Remplacement ${annonce.type_annonce ?? 'kinesitherapie'} — ${retro}% retrocession`,
    prixJour,
    specialites: annonce.specialites ?? [],
    isUrgent: annonce.is_urgent,
    dateDebut: annonce.date_debut,
    dateFin: annonce.date_fin,
  };
}

interface ListingsGridProps {
  annonces?: AnnonceRow[];
}

// Grille d'annonces responsive — affiche les donnees Supabase ou le fallback mock
export function ListingsGrid({ annonces }: ListingsGridProps) {
  const listings: ListingData[] =
    annonces && annonces.length > 0 ? annonces.map(annonceToListing) : MOCK_LISTINGS;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-5">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
