import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Zap, MapPin } from 'lucide-react';

export interface ListingData {
  id: string;
  image?: string;
  ville: string;
  rating?: number;
  reviewCount?: number;
  description: string;
  prixJour: number;
  specialites?: string[] | undefined;
  isUrgent?: boolean | undefined;
  isRppsVerified?: boolean | undefined;
  source?: string | undefined;
  dateDebut?: string | undefined;
  dateFin?: string | undefined;
}

// Placeholder images pour les annonces sans photo
const PLACEHOLDER_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDPwQ0o8sboi92l_4VYkwtudYJZByNncZPdp5NYxAzPykAJa7NM9LE8Cpp9nB-r2iZEWDNCuCAMBxx6FDpCpRAD3GlqaW95R1vIYcs7fDHIG8mNXmDNfShFPpIP23DNHQcyS6EFITZGtyKKJTxfjNokBr41QgUz_ICdzg228avWU3VjmEBs18jnJapEYZM6VocutCJtB1CkujzkPaKYvAmVSHQSpWq_9xssf7Kv-tgqltCSsx61p-MKqWcWd28jBy-hmn-zkbH9K3pX',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuD9zsFMpxojX3zIwuu2tP6w_I2wI-7gYv5fGvW3lhU2xllnTLIBs7xVum9M_BC-ziJ0Rf3twvufeaeoVpHZOGH3GEtrXb7V3qJWb0Ja2Bfc8lbwDSP92UeHV0Z7PPdlTpTB00lBIFPtxhXvfYLU0EancMBYRiqx3fMu9M5NYy4y065Tr-wzs9V5nJvwZjHiy3bDNXdsXho27dPcDm7PWulNQWMexFoBvPFYjOSwNOWAQG0SSW2rwxzsGeNVvz4J-fvoif2n-Nf7SsY8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC_2yW9FgB0l-11oUVKPcbmmWv29ysvmeuvYy0cixNsWVMzyiW9hupa-Jsb-CfywkaUFlS08ZOz8gdD8MVZxR9i0h6DsgZP2ImLzdODj1x33eeTtXcUqNrcpmuZgqL-hUw9wHdFbYk8qc9upLam2ZW8PNfXrQJ4Ndg8bwN-lOtGdT7-2zeMpuy_aSsT8A9qOebnlGmaf2ekY8tCIkAEv_QPowdomgvD4uiiFlaLAWfn7_cj-BZKql3oNxYEKCLRulVN0UjVTfZD31Pa',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDsa0ntoHfIp0A7dlDIWk0l_9azWp4E8qDWIpcSAHSljOPOZgapU9dt_mfazXRwFVqGCCl51bCEN24jnC2Njq-TQqwRIo9Vlf_BiaDP233vAdHoAfIhV0XHykaKw2lho3mlPI1FTMIGuFFCZC9pXhCfT6DFHpIbHzsPkpVzngcuSYln89KkSfcHPB2oZMw-afcuLAB7NsdkCFOTg8ZHzKaFuil99PSWOPCiRqx1Tint4U8zXlWo5vhoFJulQnMSYHM3H5s_FwQBb5UG',
];

function getPlaceholderImage(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
  }
  return PLACEHOLDER_IMAGES[Math.abs(hash) % PLACEHOLDER_IMAGES.length] as string;
}

// Card annonce kanban — image compacte h-28, titre + prix, tags pills
export function ListingCard({ listing }: { listing: ListingData }) {
  const imageSrc = listing.image ?? getPlaceholderImage(listing.id);

  return (
    <Link href={`/annonce/${listing.id}`} className="annonce-card group cursor-pointer block w-full bg-white rounded-[24px] p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Image compacte */}
      <div className="relative h-28 w-full rounded-xl overflow-hidden mb-4">
        <Image
          src={imageSrc}
          alt={`Cabinet ${listing.ville}`}
          fill
          sizes="(max-width: 768px) 100vw, 380px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badge URGENT — top-left sur l'image */}
        {listing.isUrgent && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 uppercase tracking-wide">
            <Zap size={10} /> Urgent
          </div>
        )}
        {/* Badge RPPS — top-right sur l'image */}
        {listing.isRppsVerified && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-900 px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 shadow-sm">
            <CheckCircle size={10} className="text-green-500" /> RPPS
          </div>
        )}
        {/* Badge source — aggregated */}
        {listing.source && listing.source !== 'native' && (
          <div className="absolute bottom-2 left-2 bg-gray-800/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] font-medium">
            {listing.source === 'rempleo' ? 'Rempleo' : 'Agregee'}
          </div>
        )}
      </div>

      {/* Titre + prix sur la meme ligne */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <h3 className="font-bold text-sm text-gray-900 truncate">{listing.ville}</h3>
        <div className="text-sm flex-shrink-0">
          <span className="font-bold text-gray-900">{listing.prixJour}€</span>
          <span className="text-gray-500 text-xs">/jour</span>
        </div>
      </div>

      {/* Location avec MapPin */}
      <div className="flex items-center gap-1 mb-2">
        <MapPin size={12} className="text-gray-400 flex-shrink-0" />
        <p className="text-xs text-gray-500 line-clamp-1">{listing.description}</p>
      </div>

      {/* Tag pills */}
      {listing.specialites && listing.specialites.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {listing.specialites.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded-full bg-brand/10 text-brand font-semibold capitalize"
            >
              {s}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
