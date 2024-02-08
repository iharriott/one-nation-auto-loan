export class CommonConstants {
  public static listOfUI: any = {
    employment: 'employment',
    mortgage: 'mortgage',
    note: 'note',
    applicant: 'applicant',
    applicantview: 'applicantview',
    vehicle: 'vehicle',
  };

  public static maritalStatus: any[] = [
    { value: 'M', viewValue: 'Married' },
    { value: 'S', viewValue: 'Single' },
    { value: 'C', viewValue: 'Common Law' },
  ];

  public static gender: any[] = [
    { value: 'M', viewValue: 'Male' },
    { value: 'F', viewValue: 'Female' },
    { value: 'O', viewValue: 'Other' },
  ];

  public static status: any[] = [
    { value: 'I', viewValue: 'Information Received' },
    { value: 'A', viewValue: 'Approved' },
    { value: 'D', viewValue: 'Declined' },
    { value: 'N', viewValue: 'New' },
  ];

  public static dealStatus: any[] = [
    { value: 'M', viewValue: 'Verified Manual' },
    { value: 'P', viewValue: 'Pending Verification' },
    { value: 'V', viewValue: 'Verified' },
    { value: 'C', viewValue: 'Completed' },
    { value: 'N', viewValue: 'New' },
  ];

  public static applicantStatus: any[] = [
    { value: 'A', viewValue: 'active' },
    { value: 'I', viewValue: 'inactive' },
  ];

  public static dealer: any[] = [
    { id: 1, item: 'Colin' },
    { id: 3, item: 'Ian' },
    { id: 4, item: 'Simon' },
    { id: 5, item: 'Dave' },
    { id: 6, item: 'Jenna' },
    { id: 7, item: 'Mark' },
  ];

  public static applicant: any[] = [
    { viewValue: 'Primary' },
    { viewValue: 'Co-Applicant' },
  ];

  public static roles: any[] = [
    { viewValue: 'Admin' },
    { viewValue: 'User' },
    { viewValue: 'Staff' },
  ];

  public static organizations: any[] = [
    { viewValue: 'ORGN:MAYFIELDTOYOTA:DBZPAQK' },
  ];

  public static empStatus: any[] = [
    { viewValue: 'Empstatus1' },
    { viewValue: 'Empstatus2' },
  ];

  public static empType: any[] = [
    { viewValue: 'Emptype1' },
    { viewValue: 'Emptype2' },
  ];

  public static mortgageType: any[] = [{ viewValue: 'Own with Mortgage' }];

  public static mortgageStatus: any[] = [
    { viewValue: 'Mortgage Status 1' },
    { viewValue: 'Mortgage Status 2' },
  ];

  public static mortgageHolder: any[] = [
    { viewValue: 'RBC' },
    { viewValue: 'TD' },
    { viewValue: 'ATB' },
  ];

  public static organization = 'ORGN:MAYFIELDTOYOTA:DBZPAQK';

  public static vehicleType: any[] = [
    { viewValue: 'New' },
    { viewValue: 'Used' },
  ];

  public static vehicleMake: any[] = [
    { viewValue: 'All' },
    { viewValue: 'Audi' },
    { viewValue: 'BMW' },
    { viewValue: 'Cadillac' },
    { viewValue: 'Ford' },
    { viewValue: 'Chystler' },
    { viewValue: 'Dodge' },
  ];

  public static vehicleModel: any[] = [
    { viewValue: 'All' },
    { viewValue: 'A3' },
    { viewValue: 'A6' },
    { viewValue: 'Q7' },
    { viewValue: '2 Series' },
    { viewValue: '3 Series' },
    { viewValue: 'M5' },
    { viewValue: 'X5' },
  ];

  public static vehicleBodyStyle: any[] = [
    { viewValue: 'Sedan' },
    { viewValue: 'SUV' },
    { viewValue: 'Coupe' },
    { viewValue: 'Convertible' },
    { viewValue: 'Hatchback' },
    { viewValue: 'Wagon' },
  ];

  public static vehicleStatus: any[] = [
    { viewValue: 'Requested' },
    { viewValue: 'Located' },
    { viewValue: 'Confirmed' },
  ];
}
