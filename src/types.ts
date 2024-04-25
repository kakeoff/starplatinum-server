export type UserInfo = {
  id: number;
  login: string;
  email: string;
  role: UserRole;
};

export type User = {
  id: number;
  login: string;
  email: string;
  fullName: string;
  phone: string;
  address: string;
  companyName: string;
  lastVisitDate: Date;
  role: number;
  avatarUrl: string;
  createdAt: Date;
};

export enum UserRole {
  admin = 1,
  user = 0,
}

export type ApplicationPublication = {
  id: number;
  name: string;
  date: string;
};
