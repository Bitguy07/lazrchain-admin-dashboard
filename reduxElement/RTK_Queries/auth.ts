import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: "api/admin" , credentials: 'include',}),
  endpoints: (builder) => ({

    //SignUp request
    signup: builder.mutation({
      query: (body) => ({
        url: '/auth/signup',
        method: 'POST',
        body,
      }),
    }),

    //LogIn request
    signin: builder.mutation({
      query: (body) => ({
        url: '/auth/signin',
        method: 'POST',
        body,
      }),
    }),

    //Verify authentication status
    verifyAuth: builder.query<{
      isAuthenticated: boolean;
      id?: string;
      email?: string;
      error?: string;
    }, void>({
      query: () => 'auth/verify',
    }),

    logout: builder.mutation<{ message: string; isAuthenticated: boolean }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

  }),
});

export const { useSignupMutation, useSigninMutation, useVerifyAuthQuery, useLogoutMutation } = authApi;
