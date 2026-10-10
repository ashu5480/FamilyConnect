// FamilyConnect premium design tokens.
// Palette: midnight navy (depth) + royal blue (connection) +
// soft off-white (clarity) + restrained warm amber (emotion).
// All text/background pairs target WCAG AA (>= 4.5:1 for body text).

export const brand = {
  navy900: '#0B1026',
  navy800: '#141B3D',
  navy700: '#1E2754',
  royal600: '#2B5CFF',
  royal500: '#3D6BFF',
  royal100: '#E4E9FF',
  paper: '#F7F8FC',
  card: '#FFFFFF',
  amber500: '#F59E0B',
  amber100: '#FEF3C7',
  success: '#0E9F6E',
  successBg: '#DEF7EC',
  error: '#E02424',
  errorBg: '#FCE8E8',
  ink: '#111831',
  inkSecondary: '#4B587C',
  inkTertiary: '#8A94AD',
  line: '#E3E8F2',
  lineSoft: '#EFF2F9',
} as const;

export const colors = {
  primary: brand.royal600,
  primaryLight: brand.royal100,
  primaryDark: brand.navy800,
  secondary: brand.navy700,
  success: brand.success,
  warning: brand.amber500,
  error: brand.error,
  info: brand.royal500,
  background: brand.paper,
  surface: brand.card,
  text: {
    primary: brand.ink,
    secondary: brand.inkSecondary,
    tertiary: brand.inkTertiary,
    inverse: '#FFFFFF',
  },
  border: brand.line,
  borderLight: brand.lineSoft,
};

export const darkColors = {
  background: brand.navy900,
  surface: brand.navy800,
  text: {
    primary: '#F4F6FF',
    secondary: '#B9C2DA',
    tertiary: '#7E89A8',
    inverse: brand.navy900,
  },
  border: '#2A3358',
  borderLight: '#1E2754',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  gutter: 20,
  section: 28,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const typography = {
  display: { fontSize: 40, fontWeight: '800' as const, letterSpacing: -1.2, lineHeight: 44 },
  h1: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.8, lineHeight: 36 },
  h2: { fontSize: 24, fontWeight: '800' as const, letterSpacing: -0.5, lineHeight: 30 },
  h3: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26 },
  h4: { fontSize: 17, fontWeight: '700' as const, lineHeight: 22 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.6, lineHeight: 16 },
  label: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
  eyebrow: { fontSize: 12, fontWeight: '800' as const, letterSpacing: 1.4, lineHeight: 16 },
};

export const shadows = {
  sm: {
    shadowColor: '#0B1026',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    shadowOpacity: 0.06,
    elevation: 1,
  },
  md: {
    shadowColor: '#0B1026',
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  lg: {
    shadowColor: '#0B1026',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 28,
    shadowOpacity: 0.16,
    elevation: 6,
  },
};

export const animation = {
  duration: {
    micro: 140,
    fast: 200,
    normal: 320,
    slow: 520,
  },
  stagger: {
    fast: 50,
    normal: 70,
    slow: 110,
  },
  spring: {
    damping: 18,
    stiffness: 260,
    mass: 0.9,
  },
  pressScale: 0.965,
};

export const breakpoints = {
  phone: 0,
  tablet: 640,
  desktop: 1024,
  maxContentWidth: 560,
};

export const a11y = {
  minTouchTarget: 44,
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