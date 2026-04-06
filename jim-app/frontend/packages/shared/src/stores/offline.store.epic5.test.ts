// Tests queue actions offline — Epic 5
import { describe, it, expect, beforeEach } from 'vitest';
import { useOfflineStore } from './offline.store';

beforeEach(() => {
  useOfflineStore.setState({
    cachedAnnonces: [],
    isOnline: true,
    pendingActions: [],
  });
});

describe('OfflineStore — pendingActions queue', () => {
  it('enqueueAction ajoute une action à la queue', () => {
    useOfflineStore.getState().enqueueAction({
      type: 'CREATE_CANDIDATURE',
      payload: { annonce_id: 'uuid-1' },
      idempotencyKey: 'candidature:uuid-1:user-1',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    expect(useOfflineStore.getState().pendingActions).toHaveLength(1);
    expect(useOfflineStore.getState().pendingActions[0]!.idempotencyKey).toBe('candidature:uuid-1:user-1');
  });

  it('enqueueAction déduplique par idempotencyKey', () => {
    const action = {
      type: 'CREATE_CANDIDATURE' as const,
      payload: { annonce_id: 'uuid-1' },
      idempotencyKey: 'candidature:uuid-1:user-1',
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    useOfflineStore.getState().enqueueAction(action);
    useOfflineStore.getState().enqueueAction(action); // double envoi
    expect(useOfflineStore.getState().pendingActions).toHaveLength(1); // déduplication
  });

  it('dequeueAction supprime une action par idempotencyKey', () => {
    useOfflineStore.getState().enqueueAction({
      type: 'CREATE_CANDIDATURE',
      payload: {},
      idempotencyKey: 'candidature:uuid-2:user-1',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    useOfflineStore.getState().dequeueAction('candidature:uuid-2:user-1');
    expect(useOfflineStore.getState().pendingActions).toHaveLength(0);
  });

  it('clearPendingActions vide la queue', () => {
    useOfflineStore.getState().enqueueAction({
      type: 'CREATE_CANDIDATURE',
      payload: {},
      idempotencyKey: 'key-1',
      status: 'pending',
      createdAt: new Date().toISOString(),
    });
    useOfflineStore.getState().clearPendingActions();
    expect(useOfflineStore.getState().pendingActions).toHaveLength(0);
  });
});
