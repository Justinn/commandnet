export type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

export const SessionStatus = {
  Loading: 'loading',
  Authenticated: 'authenticated',
  Unauthenticated: 'unauthenticated',
} as const; 