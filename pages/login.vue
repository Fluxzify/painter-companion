<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '~/composables/Api/useAuth';

interface UserLoginDTO {
  email: string;
  password: string;
}

const user = ref<UserLoginDTO>({
  email: '',
  password: '',
});

const auth = useAuth();
const router = useRouter();

const onSubmit = () => {
  if (!user.value.email.trim()) {
    alert('El email es obligatorio');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.value.email)) {
    alert('El email no es válido');
    return;
  }

  if (!user.value.password.trim()) {
    alert('La contraseña es obligatoria');
    return;
  }

  // Llamada API
  auth.login(user.value)
    .then(() => {
      console.log('token:', auth.data.value);
      router.push('/');  // Aquí haces la redirección al home '/'
    })
    .catch((error) => {
      console.error('Error while login:', error);
      alert('Error');
    });

  console.log('Registering with:', user.value);
};
</script>

<template>
  <div class="min-h-screen flex justify-center items-center bg-base-100">
    <form @submit.prevent="onSubmit" class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 space-y-4">
      <legend class="fieldset-legend mb-4">Login</legend>

    
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
        Login
      </button>
<NuxtLink to="register" class="btn btn-soft btn-primary">Don't have an account? Register here</NuxtLink>


    </form>
  </div>
</template>
