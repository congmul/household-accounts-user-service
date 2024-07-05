export interface IUser {
  email: string;
  fullname: string;
  joinThrough: string;
  firstName?: string;
  lastName?: string;
  accessToken?: string;
  password?: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
