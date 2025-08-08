import { ref } from 'vue'
import axios from 'axios'


export function useApi() {
  const data = ref<any>(null)
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  const get = async <T>(url: string): Promise<T | null> => {
    isLoading.value = true
    error.value = null
    try {
      const response = await axios.get<T>(url)
      data.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Unknown error'
      return null
    } finally {
      isLoading.value = false
    }
  }

  const post = async <T>(url: string, payload: T): Promise<void> => {
  isLoading.value = true
  error.value = null
  try {
    const response = await axios.post(url, payload)
    data.value = response.data
  } catch (err: any) {
    error.value = err.message || 'Unknown error'
  } finally {
    isLoading.value = false
  }
}

  return { data, error, isLoading, get, post }
}
