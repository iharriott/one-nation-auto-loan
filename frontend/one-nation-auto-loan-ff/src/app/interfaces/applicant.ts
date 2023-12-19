export interface Applicant {
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
  dealStatus: string;
  referralCode: string;
  tempDealerId: string[];
  sales: number;
  finance: number;
  gross: number;
  display: string;
  createdBy: string;
  pinStatus: string;
  accessedDate: Date;
  assignedDate: Date;
  completedDate: Date;
  createdDate: Date;
  updatedBy: string;
  updatedDate: Date;
  address: Address[];
}

export interface Address {
  street: string;
  city: string;
  province: string;
  country: string;
  postalCode: string;
  residenceYears: number;
  residenceMonths: number;
}

export interface TempDealer {
  id: number;
  item: string;
}
