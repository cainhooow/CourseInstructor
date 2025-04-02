export type UserPasswordDTO = {
  id: string;
  password: string;
  active: boolean;
  userId: string;

  created_at: Date;
  updated_at: Date;
};

export type PasswordResetDTO = {
  id: string;
  token: string;
  expires_at: Date;
  userId: string;

  created_at: Date;
  updated_at: Date;
};
