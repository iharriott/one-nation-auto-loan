export interface Vehicle {
  pk: string;
  sk: string;
  gsI1PK: string;
  gsI1SK: string;
  documentType: string;
  vehicles: VehicleDetail[];
}

export interface VehicleDetail {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: string;
  make: string;
  model: string;
  locatedStatus: string;
  year: string;
  price: number;
  mileage: number;
  bodyStyle: string;
  note: string;
  imageUrl: string;
}
