

export interface ChildRegistration {
    id?: string;
    childName: string;
    age: number;
    gender: 'niño' | 'niña';
    parentName: string;
    invitedBy?: string;
    paidAmount: number;
    createdAt: Date;
  }

export interface RegistrationStats {
    totalChildren: number;
    totalCollected: number;
    totalNeeded: number;
    totalBoys: number;
    totalGirls: number;
  }

export interface DashboardParams {
  ageRanges: {
    min: number;
    max: number;
  }[];
}