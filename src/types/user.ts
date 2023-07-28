export type User = {
  uuid: string;

  data: {
    accessed_providers: {
      provider_name: string;
      unique_identifier: string;
      last_accessed: string;
    }[];
    email?: string;
  };

  date_created: string;
  state: UserState;
};

export type UserUniqueIdentifier = {
  uuid: string;
  provider: string;
  user_id: string;

  date_created: string;
};

export enum UserState {
  USER_ACTIVE = "active",
  USER_INACTIVE = "inactive",
}
