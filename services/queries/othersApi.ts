import { apiSlice } from "../apiSlice";

const othersApi = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({}),

  overrideExisting: true,
});

export const {} = othersApi;
