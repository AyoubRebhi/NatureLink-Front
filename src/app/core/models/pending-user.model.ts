export interface PendingUser {
    id: number;
    username: string;
    email: string;
    role: string;
    proofDocument: string;
    approvalToken?: string;
    expiryDate?: string;
  }