// Page Messagerie desktop — Epic 6
// Protegee par AuthGuard via (app)/layout.tsx
import type { Metadata } from 'next';
import { MessagesView } from '../../../components/messaging/messages-view';
import { AppPage } from '../../../components/app-shell/app-page';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Messages',
};

export default function MessagesPage() {
  return (
    <AppPage>
      <main className="w-full max-w-[1400px] mx-auto px-4 lg:px-6 pt-4 pb-8">
        <MessagesView />
      </main>
    </AppPage>
  );
}
