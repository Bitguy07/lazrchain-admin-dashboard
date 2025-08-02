// src/features/wallet/walletAddressApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const walletAddressApi = createApi({
  reducerPath: "walletApi",
  baseQuery: fetchBaseQuery({ baseUrl: "api/admin" }),
  endpoints: (builder) => ({
    // POST: Save Wallet Address
    saveWalletAddress: builder.mutation<
      { success: boolean; message: string },
      { email: string; walletAddress: string }
    >({
      query: (data) => ({
        url: "/walletAddress",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const {
  useSaveWalletAddressMutation,
} = walletAddressApi;
