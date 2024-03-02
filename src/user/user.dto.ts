export type UpdateUserDto = {
  id: number;
  role?: number;
  login?: string;
  avatarUrl?: string;
};

export type UpdateMeDto = {
  login?: string;
  avatarUrl?: string;
};
