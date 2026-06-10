import { Smartphone } from 'lucide-react';

interface StoreButtonsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Boutons App Store + Google Play — dark JIM pour Apple, corail pour Google
export function StoreButtons({ size = 'md', className = '' }: StoreButtonsProps) {
  const padding =
    size === 'lg' ? 'px-6 py-3 text-sm' : size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm';

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      <a
        href="https://apps.apple.com/app/jim"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 ${padding} font-semibold bg-jim-text text-white rounded-xl hover:opacity-95 transition-opacity focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-text/30`}
      >
        <Smartphone size={16} />
        App Store
      </a>
      <a
        href="https://play.google.com/store/apps/details?id=com.jimapp.mobile"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 ${padding} font-semibold bg-jim-primary text-white rounded-xl hover:bg-jim-accent transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-jim-primary/40 shadow-[0_4px_14px_-6px_rgba(255,124,92,0.55)]`}
      >
        <Smartphone size={16} />
        Google Play
      </a>
    </div>
  );
}
