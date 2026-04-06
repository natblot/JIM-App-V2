import { Smartphone } from 'lucide-react';

interface StoreButtonsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Boutons App Store + Google Play — brand style
export function StoreButtons({ size = 'md', className = '' }: StoreButtonsProps) {
  const padding =
    size === 'lg' ? 'px-6 py-3 text-sm' : size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm';

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <a
        href="https://apps.apple.com/app/jim"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 ${padding} font-semibold bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors`}
      >
        <Smartphone size={16} />
        App Store
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.jimapp.mobile"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 ${padding} font-semibold bg-brand text-white rounded-xl hover:bg-brand-dark transition-colors`}
      >
        <Smartphone size={16} />
        Google Play
      </a>
    </div>
  );
}
