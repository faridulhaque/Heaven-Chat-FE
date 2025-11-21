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
  blocked: string[];
};

export type StartChatType = {
  members: string[];
};

export type Chat = {
  conversationId: string;
  members: string[];
  createdAt: string;
  counterParty: UserPayload;
};

export type TMessageDataFE = {
  message: string;
  type: string;
  to: string;
  from: string;
  conversationId: string;
};
