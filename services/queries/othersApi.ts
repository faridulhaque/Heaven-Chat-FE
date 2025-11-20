import { apiSlice } from "../apiSlice";
import { StartChatType } from "../types";

const othersApi = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    startChat: builder.mutation({
      query: (data: StartChatType) => ({
        url: "/chat/start",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["chat"],
    }),

    getChatList: builder.query({
      query: () => ({
        url: "/chat/list",
        method: "GET",
      }),
      providesTags: ["chat"],
    }),

    getOneChat: builder.query({
      query: (id: string) => ({
        url: `/chat/conversation/${id}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useStartChatMutation, useGetChatListQuery, useGetOneChatQuery } =
  othersApi;
