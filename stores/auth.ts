// stores/auth.ts
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null as null | { id: number; name: string },
    isLoggedIn: false,
  }),
  actions: {
    
   initAuth() {
  const token = localStorage.getItem('jwt');
  if (token && !this.isTokenExpired(token)) {
    this.token = token;
    this.isLoggedIn = true;
    const payload = this.decodeToken(token);
    if (payload && payload.sub && payload.name) {
      this.user = {
        id: Number(payload.sub),
        name: payload.name
      };
    } else {
      this.user = null;
    }
  } else {
    this.logout();
  }
},

    logout() {
      this.token = '';
      this.user = null;
      this.isLoggedIn = false;
      localStorage.removeItem('jwt');
    },
decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + c.charCodeAt(0).toString(16).padStart(2, '0');
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
},

isTokenExpired(token: string): boolean {
  const decoded = this.decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

  }
});
