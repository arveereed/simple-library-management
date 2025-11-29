export type UserDataSignUpType = {
  user_id: string;
  fullname: string;
  email: string;
};

export type UserType = {
  id: string;
  createdAt: object;
  fullname: string;
  email: string;
  user_id: string;
};

export type FireStoreUserType = UserType & {
  id: string;
};
