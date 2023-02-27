import { defineStore } from 'pinia';
import jwt_decode from 'jwt-decode';
export const useUserStore = defineStore('userStore', {
  state: (): state => ({
    token: { id_token: '', expires_in: 0 },
    isAuthenticated: false,
  }),
  getters: {
    idToken: (state): string => state.token.id_token,
    expiresIn: (state): number => state.token.expires_in,
    decodedIdToken: (state): decodedIdToken => jwt_decode(state.token.id_token),
    isLoggedIn: () => !!localStorage.getItem('jaguar'),
    name(): string {
      return this.decodedIdToken['cognito:username'];
    },
    email(): string {
      return this.decodedIdToken.email;
    },
    phoneNo(): string {
      return this.decodedIdToken.phone_number;
    },
  },
  actions: {
    setToken(token: token) {
      this.token = token;
      this.isAuthenticated = true;

      localStorage.setItem('jaguar', JSON.stringify(token));
    },
  },
});

interface token {
  id_token: string;
  expires_in: number;
}

interface decodedIdToken {
  at_hash: string;
  aud: string;
  auth_time: number;
  'cognito:username': string;
  email: string;
  email_verified: boolean;
  exp: number;
  family_name: string;
  given_name: string;
  iat: number;
  iss: string;
  jti: string;
  middle_name: string;
  origin_jti: string;
  phone_number: string;
  phone_number_verified: boolean;
  sub: string;
  token_use: string;
}

interface state {
  token: token;
  isAuthenticated: boolean;
}
