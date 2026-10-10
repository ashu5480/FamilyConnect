'use client';

import { useCallback, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { getFamilies, getMembers, getEvents, getConnections } from '@/lib/data';
import { Family, Member, EventItem, Connection } from '@/lib/types';

export function useFamilyConnect() {
  const [families, setFamilies] = useState<Family[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFamilies = useCallback(async () => {
    try {
      setError(null);
      const list = await getFamilies();
      setFamilies(list);
      return list;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load families');
      return [];
    }
  }, []);

  const loadMembers = useCallback(async (familyId: string) => {
    try {
      setError(null);
      const list = await getMembers(familyId);
      setMembers(list);
      return list;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members');
      return [];
    }
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      setError(null);
      const list = await getEvents();
      setEvents(list);
      return list;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
      return [];
    }
  }, []);

  const loadConnections = useCallback(async () => {
    try {
      setError(null);
      const list = await getConnections();
      setConnections(list);
      return list;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connections');
      return [];
    }
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [fams, evts, conns] = await Promise.all([
          getFamilies(),
          getEvents(),
          getConnections(),
        ]);
        if (!active) return;
        setFamilies(fams);
        setEvents(evts);
        setConnections(conns);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return { families, members, events, connections, loading, error, loadFamilies, loadMembers, loadEvents, loadConnections };
}
