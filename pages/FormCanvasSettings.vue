<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const description = ref('')
const gridSize = ref(20)

const isValidGridSize = (value: number) =>
  value % 20 === 0 && value >= 20 && value <= 180

const onSubmit = () => {
  if (!isValidGridSize(gridSize.value)) {
    alert('Grid size must be a multiple of 20 between 20 and 180.')
    return
  }

  console.log('Form submitted:', {
    name: name.value,
    description: description.value,
    gridSize: gridSize.value,
  })

  alert('Settings saved successfully!')
}
</script>

<template>
  <div class="min-h-screen flex justify-center items-center bg-base-100">
    <form @submit.prevent="onSubmit" class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
      <legend class="fieldset-legend mb-4">Settings of your new canvas</legend>

      <label class="label" for="name">Name</label>
      <input
        id="name"
        type="text"
        class="input"
        placeholder="Name"
        v-model="name"
        required
      />

      <label class="label mt-4" for="description">Description</label>
      <textarea
        id="description"
        class="input"
        placeholder="Description"
        v-model="description"
      ></textarea>

      <label class="label mt-4" for="gridSize">Grid Size</label>
      <input
        id="gridSize"
        type="number"
        class="input"
        placeholder="Grid Size (20–180, multiple of 20)"
        v-model.number="gridSize"
        min="20"
        max="180"
        step="20"
        required
      />

      <button class="btn btn-neutral mt-6" type="submit">Save</button>
    </form>
  </div>
</template>
