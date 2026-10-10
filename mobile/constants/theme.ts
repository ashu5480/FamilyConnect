export const colors = {
  primary: '#E91E63',
  primaryLight: '#FCE7F3',
  primaryDark: '#AD1457',
  secondary: '#7C4DFF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  background: '#FFF5F8',
  surface: '#FFFFFF',
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    inverse: '#FFFFFF',
  },
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 36, fontWeight: '800' as const, letterSpacing: -1 },
  h2: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.5 },
  h3: { fontSize: 22, fontWeight: '700' as const },
  h4: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const },
  bodySmall: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '600' as const },
  label: { fontSize: 14, fontWeight: '600' as const },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.06,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.08,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    shadowOpacity: 0.12,
    elevation: 4,
  },
};

export const animation = {
  duration: {
    fast: 200,
    normal: 400,
    slow: 600,
  },
  stagger: {
    fast: 50,
    normal: 100,
    slow: 150,
  },
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
};

export const eventTypes = [
  'Wedding',
  'Engagement',
  'Birthday',
  'Anniversary',
  'Pooja',
  'Housewarming',
  'Baby Shower',
  'Family Reunion',
  'Other',
] as const;

export const taskStatuses = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'] as const;
export const taskPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const;
export const rsvpStatuses = ['YES', 'NO', 'MAYBE', 'PENDING'] as const;
export const expenseCategories = [
  'Venue',
  'Food',
  'Decoration',
  'Photography',
  'Transport',
  'Clothing',
  'Gifts',
  'Other',
] as const;
export const familyRoles = ['ADMIN', 'ORGANIZER', 'MEMBER', 'GUEST'] as const;
export const eventMemberRoles = ['ORGANIZER', 'CO_HOST', 'MEMBER', 'GUEST'] as const;
export const mediaTypes = ['IMAGE', 'VIDEO'] as const;
export const designTypes = ['INVITATION', 'EVENT_COVER'] as const;
export const notificationTypes = [
  'TASK_ASSIGNED',
  'TASK_DUE',
  'TASK_COMPLETED',
  'MESSAGE',
  'MENTION',
  'NEW_RSVP',
  'NEW_PHOTO',
  'EVENT_REMINDER',
  'SCHEDULE_REMINDER',
  'BACKGROUND_REMOVAL_COMPLETED',
  'INVITATION_CREATED',
  'SYSTEM',
] as const;
export const channels = [
  'General',
  'Bride Side',
  'Groom Side',
  'Decoration',
  'Food',
  'Photography',
  'Travel',
  'Guest Management',
] as const;
export const albums = [
  'Haldi',
  'Mehndi',
  'Sangeet',
  'Wedding',
  'Reception',
  'Family',
  'Bride',
  'Groom',
  'Kids',
  'Other',
] as const;