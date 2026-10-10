export interface Family {
  id: string;
  name: string;
  avatar: string;
  color: string;
  membersCount: number;
  location: string;
  sharedCalendar: boolean;
  cover?: string | null;
  relationship: string[];
}

export interface Member {
  id: string;
  familyId: string;
  name: string;
  role?: string;
  image?: string;
  color: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'game' | 'meal' | 'outdoor' | 'celebration';
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'blocked';
  note?: string;
}
