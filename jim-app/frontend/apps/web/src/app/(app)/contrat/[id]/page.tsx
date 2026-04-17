// Page detail contrat — route protegee par AuthGuard via (app)/layout.tsx
import { ContractDetail } from '../../../../components/contrat/contract-detail';

export const metadata = { title: 'Contrat | JIM' };

export default async function ContratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ContractDetail contratId={id} />;
}
