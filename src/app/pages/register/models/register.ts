export interface Register {
  userName: string;
  password: string;
  name: string;
  mobileNumber: number;
  user: {
    category: string;
    subcategory: string;
  };
  emailId: string;
  designation: string;
  department: string;
  skill: string;
  training: string;
  experience: string;
  dateOfNomination: Date;
  gender: Gender;
  organisation: {
    name: string;
    unit: string;
  };
}

