'use client';

import Link from 'next/link';
import { Plus, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFamilyConnect } from '@/hooks/useFamilyConnect';
import { Connection } from '@/lib/types';

export default function ConnectionsPage() {
  const { connections } = useFamilyConnect();

  return (
    <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Connections</h1>
          <p className="text-ink-500 mt-1">Family &amp; member connections.</p>
        </div>
        <Button asChild>
          <Link href="#add">
            <Plus className="h-4 w-4" />
            Invite
          </Link>
        </Button>
      </div>

      {connections.length === 0 ? (
        <div className="mt-6 text-center text-ink-500">No connections yet. Invite family members to connect.</div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {connections.map((c: Connection) => (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={c.from} size="lg" />
                  <div className="min-w-0">
                    <p className="font-medium text-ink-900 truncate">{c.from}</p>
                    <p className="text-xs text-ink-500">→ {c.to}</p>
                  </div>
                  <Badge
                    variant={c.status === 'accepted' ? 'default' : c.status === 'pending' ? 'pending' : 'suspended'}
                  >
                    {c.status}
                  </Badge>
                </div>
                {c.note && <p className="mt-2 text-sm text-ink-500">{c.note}</p>}
                <div className="mt-3">
                  <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                    <Link href="#message">
                      <ArrowRight className="h-4 w-4" />
                      Message
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
