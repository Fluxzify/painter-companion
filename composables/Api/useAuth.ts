import { ref } from 'vue';
import axios from 'axios';
import { useAuthStore } from '~/stores/auth';

const TOKEN_KEY = 'jwt';

export function useAuth() {
  const authStore = useAuthStore();

  const data = ref<any>(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  const config = useRuntimeConfig();
  const apiBaseUrl = config.public.apiBaseUrl;

  const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
  });

 const register = async <T>(payload: T): Promise<void> => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axiosInstance.post('/auth/register', payload);
    data.value = response.data;

    localStorage.setItem(TOKEN_KEY, response.data.token);
    authStore.token = response.data.token;
    authStore.isLoggedIn = true;
    authStore.user = authStore.decodeToken(response.data.token);

    return response.data; // para el llamador

  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      error.value = err.response.data.message || 'Error desconocido';
    } else {
      error.value = err.message || 'Error desconocido';
    }
    throw err;  // propaga el error
  } finally {
    isLoading.value = false;
  }
};

  const login = async <T>(payload: T): Promise<void> => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await axiosInstance.post('/auth/login', payload);
    data.value = response.data;

    localStorage.setItem(TOKEN_KEY, response.data.token);
    authStore.token = response.data.token;
    authStore.isLoggedIn = true;
    authStore.user = authStore.decodeToken(response.data.token);

    return response.data;  // <-- devuelves explícitamente para que el llamador pueda usar then/await correctamente

  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      error.value = err.response.data.message || 'Error desconocido';
    } else {
      error.value = err.message || 'Error desconocido';
    }
    throw err;  // <-- muy importante para propagar el error
  } finally {
    isLoading.value = false;
  }
};


  return {
    data,
    error,
    isLoading,
    register,
    login,
  };
}
