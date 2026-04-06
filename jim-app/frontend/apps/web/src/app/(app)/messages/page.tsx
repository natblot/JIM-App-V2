// Page Messagerie desktop — Epic 6
// Protegee par AuthGuard via (app)/layout.tsx
import type { Metadata } from 'next';
import { MessagesView } from '../../../components/messaging/messages-view';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Messages',
};

export default function MessagesPage() {
  return (
    <main className="flex-grow w-full h-screen">
      <MessagesView />
    </main>
  );
}
