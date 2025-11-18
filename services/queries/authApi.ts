import { apiSlice } from "../apiSlice";
import { loginPayload, registerPayload } from "../types";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    register: builder.mutation({
      query: (data: registerPayload) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (data: loginPayload) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
