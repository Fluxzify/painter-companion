<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '~/composables/Api/useAuth'

interface UserRegisterDTO {
  name: string;
  email: string;
  password: string;
}

const user = ref<UserRegisterDTO>({
  name: '',
  email: '',
  password: '',
})

const api = useAuth()

const onSubmit = () => {
  // Validaciones
  if (!user.value.name.trim()) {
    alert('El nombre es obligatorio')
    return
  }

  if (!user.value.email.trim()) {
    alert('El email es obligatorio')
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(user.value.email)) {
    alert('El email no es válido')
    return
  }

  if (!user.value.password.trim()) {
    alert('La contraseña es obligatoria')
    return
  }

  // Llamada API
api.register(user.value)
    .then(() => {

    
    })
    .catch((error) => {
      console.error('Error in register:', error)
      alert('Error al registrar usuario')
    })

  console.log('Registering with:', user.value)
}
</script>

<template>
  <div class="min-h-screen flex justify-center items-center bg-base-100">
    <form @submit.prevent="onSubmit" class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 space-y-4">
      <legend class="fieldset-legend mb-4">Register</legend>

      <div class="form-control">
        <label class="label" for="name">
          <span class="label-text">Name</span>
        </label>
        <input id="name" type="text" class="input input-bordered" placeholder="Your name" v-model="user.name"
          required />
      </div>

      <div class="form-control">
        <label class="label" for="email">
          <span class="label-text">Email</span>
        </label>
        <input id="email" type="email" class="input input-bordered" placeholder="example@mail.com" v-model="user.email"
          required />
      </div>

      <div class="form-control">
        <label class="label" for="password">
          <span class="label-text">Password</span>
        </label>
        <input id="password" type="password" class="input input-bordered" placeholder="********" v-model="user.password"
          required />
      </div>

      <button class="btn btn-neutral w-full mt-2" type="submit">
        Register
      </button>
      <NuxtLink to="login" class="btn btn-soft btn-primary">Already have an account? Login here</NuxtLink>


    </form>
  </div>
</template>
