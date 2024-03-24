export type UpdateUserRoleDto = {
  id: number;
  role: number;
};

export type UpdateMeDto = {
  login?: string;
  avatarUrl?: string;
};
