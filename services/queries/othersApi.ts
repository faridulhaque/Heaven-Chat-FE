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

    getMessages: builder.query({
      query: (conversationId: string) => ({
        url: `/chat/${conversationId}/messages`,
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

    checkIfBlocked: builder.query({
      query: (members: string[]) => ({
        url: `/chat/blocked?members=${members[0]}&members=${members[1]}`,
        method: "GET",
      }),
      providesTags: ["blocking"],
    }),

    blockUser: builder.mutation({
      query: (id: string) => ({
        url: `/chat/block/${id}`,
        method: "PUT",
      }),

      invalidatesTags: ["blocking"],
    }),

    deleteChat: builder.mutation({
      query: (id: string) => ({
        url: `/chat/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: ["blocking"],
    }),
  }),
});

export const {
  useStartChatMutation,
  useGetChatListQuery,
  useGetOneChatQuery,
  useGetMessagesQuery,
  useBlockUserMutation,
  useCheckIfBlockedQuery,
  useDeleteChatMutation,
} = othersApi;
