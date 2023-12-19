import { Address, TempDealer } from './applicant';

export interface PinnedApplicant {
  pk: string;
  sk: string;
  gsI1PK: string;
  gsI1SK: string;
  documentType: string;
  applicantType: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  sin: string;
  dob: Date;
  maritalStatus: string;
  gender: string;
  creditScore: number;
  status: string;
  pinStatus: string;
  accessedDate: Date;
  dealStatus: string;
  referralCode: string;
  tempDealerId: string[];
  sales: number;
  finance: number;
  gross: number;
  display: string;
  createdBy: string;
  assignedDate: Date;
  completedDate: Date;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;
  address: Address[];
}
