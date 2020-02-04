 export interface Units {
  emailId: string;
  organisation: string;
  code: string;
  unit: 
    {
      name: string;
      address: string;
      pinCode: number;
      head: {
        name: string;
        emailId: string;
        mobileNumber: number;
      };
    };
}
