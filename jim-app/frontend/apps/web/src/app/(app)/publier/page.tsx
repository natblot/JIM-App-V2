import { PublierForm } from '../../../components/dashboard/publier-form';
import { AppPage } from '../../../components/app-shell/app-page';

// Route protegee par AuthGuard dans (app)/layout.tsx + middleware.ts
export const metadata = { title: 'Publier une annonce | JIM' };

export default function PublierPage() {
  return (
    <AppPage>
      <PublierForm />
    </AppPage>
  );
}
