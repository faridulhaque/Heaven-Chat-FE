import { apiSlice } from "../apiSlice";
import { OnboardingPayload } from "../types";


const authApi = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    Onboarding: builder.mutation({
      query: (data: OnboardingPayload) => ({
        url: "/auth/onboarding",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useOnboardingMutation } = authApi;
