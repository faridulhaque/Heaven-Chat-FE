export type registerPayload = {
  email: string;
  name: string;
  avatar: string;
};

export type loginPayload = {
  email: string;
  name: string;
  avatar: string;
};

export type UserPayload = {
  email: string;
  name: string;
  userId: string;
  avatar: string;
};

export type StartChatType = {
  members: string[];
};

export type Chat = {
  conversationId: string;
  members: string[];
  createdAt: string;
  counterParty: UserPayload
};
