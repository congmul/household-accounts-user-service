export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
