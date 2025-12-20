import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  credits: number;
  tier: 'free' | 'pro' | 'enterprise';
  tierExpiresAt?: Timestamp; // Timestamp
  createdAt?: Timestamp;
  lastLogin?: Timestamp;
}
