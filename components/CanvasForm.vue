<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  initialData: Object
})

const emit = defineEmits(['submit'])

const name = ref(props.initialData?.name || '')
const description = ref(props.initialData?.description || '')
const gridSize = ref(props.initialData?.gridSize || 20)

const isValidGridSize = (value: number) =>
  value % 20 === 0 && value >= 20 && value <= 180

const onSubmit = () => {
  if (!isValidGridSize(gridSize.value)) {
    alert('Grid size must be a multiple of 20 between 20 and 180.')
    return
  }

  emit('submit', {
    name: name.value,
    description: description.value,
    gridSize: gridSize.value
  })
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input v-model="name" placeholder="Name" required />
    <textarea v-model="description" placeholder="Description"></textarea>
    <input
      type="number"
      v-model.number="gridSize"
      min="20"
      max="180"
      step="20"
      required
      placeholder="Grid Size (20–180, multiple of 20)"
    />
    <button type="submit">Save</button>
  </form>
</template>
