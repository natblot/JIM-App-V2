import { Suspense } from 'react';

// Layout auth — pages login/register, centrees, fond doux, pas de Header/Footer marketing
// Suspense requis car les pages auth utilisent useSearchParams (redirect param)
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9F5] px-4 py-12">
      <a href="/" className="text-brand text-4xl font-bold tracking-tight mb-8">
        jim
      </a>
      <Suspense>{children}</Suspense>
    </div>
  );
}
