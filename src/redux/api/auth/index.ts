import jwtDecode from 'jwt-decode'
import { api } from 'redux/api'
import { DecodedAccountToken, SignupBody } from 'types'
import { GetOAuthTokenRequest, GetOAuthTokenResponse } from './types'

const authEndpoint = api.injectEndpoints({
  endpoints: (build) => ({
    signup: build.mutation<void, SignupBody>({
      query: (body) => ({
        url: 'api/add/user',
        method: 'POST',
        body,
      }),
    }),
    getOAuthToken: build.mutation<GetOAuthTokenResponse, GetOAuthTokenRequest>({
      query: ({ login, password }) => ({
        url: `/oauth/token?username=${login}&password=${password}&grant_type=password`,
        method: 'POST',
        headers: {
          Authorization: 'Basic YWNhZGVtaWNzOm15aGVscGVyLWtleQ==',
        },
      }),
      transformResponse: (response: GetOAuthTokenResponse) => {
        const token = response.access_token
        const decodedToken = jwtDecode<DecodedAccountToken>(token)
        const stringId = decodedToken.authorities[1]
        const parsedStringId = stringId.split(':')
        const id = parsedStringId[1]

        return {
          ...response,
          user_id: Number(id),
        }
      },
    }),
  }),
})

export const {
  useSignupMutation,
  useGetOAuthTokenMutation,
  endpoints: { getOAuthToken },
} = authEndpoint
