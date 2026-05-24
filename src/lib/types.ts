// Phase 3 Code Hardening: Strict TypeScript Interfaces for Firestore Models

export interface UserProfile {
  uid: string;
  email: string;
  firstName?: string;
  lastName?: string;
  clinicalTitle?: string;
  primarySpecialty?: string;
  stateOfLicensure?: string;
  npiNumber?: string;
  displayName: string;
  role: 'professional' | 'recruiter' | 'admin';
  role_type?: 'b2c_user' | 'b2b_agency' | 'b2b_facility' | 'founder';
  visibility: 'public' | 'private';
  metrics: {
    averageRating: number;
    totalReviews: number;
  };
  mfaEnabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Review {
  id: string;
  professionalId: string;
  reviewerId?: string; // Optional if anonymous
  rating: number;
  comment: string;
  geoVerified: boolean;
  status: 'published' | 'quarantined' | 'pending';
  createdAt: number;
}

export interface AuditLog {
  id: string;
  action: 'profile_view' | 'credential_download' | 'account_deletion';
  actorId: string; // The Recruiter or Admin who performed the action
  targetId: string; // The Professional whose data was accessed
  timestamp: number;
  ipAddress?: string; // Logged securely per HIPAA compliance
}

export interface Credential {
  id: string;
  userId: string;
  fileName: string;
  storageUri: string;
  type: string; // e.g. "BLS", "ACLS", "State License"
  status: 'Self-Reported' | 'Verified';
  expirationDate: number; // Unix timestamp
  uploadedAt: number;
}
