export interface User {
  _id?: string;
  userName: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  emailId?: string;
  password?: string;
  userStatus?: string;
  userType?: UserType;
  gender?: Gender;
  addrline1?: string;
  addrline2?: string;
  city?: string;
  state?: string;
  country?: string;
  mobileNumber?: string;
  createdAt?: Date;
  isActive?: boolean;
  updatedAt?: Date;
  zip?: string;
  address?: any;
}
