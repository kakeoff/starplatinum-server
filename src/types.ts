export type UserInfo = {
  id: number;
  login: string;
  email: string;
  fullName: string;
  phone: string | null;
  address: string | null;
  companyName: string | null;
  lastVisitDate: Date | null;
  role: number;
  avatarUrl: string;
  createdAt: Date;
};
