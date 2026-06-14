// Page detail contrat — route protegee par AuthGuard via (app)/layout.tsx
// Design : mission-detail-v2 (template jim-design-system, dashboard mission V2)
import { MissionDetailV2 } from '../../../../components/contrat/mission-detail-v2';
import { AppPage } from '../../../../components/app-shell/app-page';

export const metadata = { title: 'Mission | JIM' };

export default async function ContratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <AppPage>
      <MissionDetailV2 contratId={id} />
    </AppPage>
  );
}
