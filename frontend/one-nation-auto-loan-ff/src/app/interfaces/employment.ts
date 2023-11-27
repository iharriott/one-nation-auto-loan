import { EmploymentDetails } from './employmentDetails';

export interface Employment {
  pk: string;
  sk: string;
  gsI1PK: string;
  gsI1SK: string;
  documentType: string;
  occupation: string;
  otherIncome: number;
  otherIncomeType: string;
  frequency: number;
  status: string;
  employmentList: EmploymentDetails[];
}
