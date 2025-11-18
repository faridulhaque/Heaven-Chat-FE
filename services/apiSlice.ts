import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  // baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_ROOT_API }),
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,

    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["tasks"],
  endpoints: (build) => ({}),
});
