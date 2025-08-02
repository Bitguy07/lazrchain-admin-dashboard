// src/features/Ref_Rew_Tiers/referralBonusApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const tiersApi = createApi({
  reducerPath: 'tiersApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/user' }),
  tagTypes: ['ReferralTiers', 'InvestmentTiers'],

  endpoints: (builder) => ({

    // Referral Bonus Tiers (GET)
    getReferralBonusTiers: builder.query<
      {
        success: boolean;
        tiers: {
          _id: string;
          tierName: string;
          minInvestment: number;
          maxInvestment: number;
          referralPercentage: number;
          description: string;
          createdAt: string;
          updatedAt: string;
        }[];
      },
      void
    >({
      query: () => ({
        url: '/referralTier',
        method: 'GET',
      }),
      providesTags: ['ReferralTiers'],
    }),

    // Mutation for updating a tier
    updateReferralTier: builder.mutation<
      { success: boolean; updatedTier: any }, // You can define a more specific type if needed
      { id: string; body: Partial<{
        tierName?: string;
        minInvestment?: number;
        maxInvestment?: number;
        referralPercentage?: number;
        description?: string;
      }> }
    >({
      query: ({ id, body }) => ({
        url: `/referralTier/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['ReferralTiers'],
    }),

    // Investment Tiers
    getInvestmentTiers: builder.query<
      {
        success: boolean;
        tiers: {
          _id: string;
          tierName: string;
          min: number;
          max: number;
          dailyYieldMin: number;
          dailyYieldMax: number;
          description: string;
          createdAt: string;
          updatedAt: string;
        }[];
      },
      void
    >({
      query: () => ({
        url: '/investmentTier',
        method: 'GET',
      }),
      providesTags: ['InvestmentTiers'],
    }),

    // Mutation for updating an investment tier
    updateInvestmentTier: builder.mutation<
      { success: boolean; updatedTier: any },
      {
        id: string;
        body: Partial<{
          tierName?: string;
          min?: number;
          max?: number;
          dailyYieldMin?: number;
          dailyYieldMax?: number;
          description?: string;
        }>;
      }
    >({
      query: ({ id, body }) => ({
        url: `/investmentTier/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['InvestmentTiers'],
    }),

  }),
});

export const {
  useGetReferralBonusTiersQuery,
  useUpdateReferralTierMutation,
  useGetInvestmentTiersQuery,
  useUpdateInvestmentTierMutation,
} = tiersApi;
