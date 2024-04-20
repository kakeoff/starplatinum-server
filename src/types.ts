import { ApplicationStatus } from '@prisma/client';

export type UserInfo = {
  id: number;
  login: string;
  email: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  companyName: string | null;
  lastVisitDate: Date | null;
  role: UserRole;
  avatarUrl: string;
  createdAt: Date;
};

export enum UserRole {
  admin = 1,
  user = 0,
}

export type ApplicationWithUser = {
  id: number;
  name: string;
  comment: string;
  email: string;
  cost: number;
  status: ApplicationStatus;
  pubs: ApplicationPublication[];
  userId: number;
  createdAt: Date;
};

export type ApplicationPublication = {
  id: number;
  name: string;
  date: string;
};
