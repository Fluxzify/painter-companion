// composables/useRotation.ts
import { computed } from 'vue'

export function useRotation(origin: { x: number; y: number }, target: { x: number; y: number }) {
  const angle = computed(() => {
    const dx = target.x - origin.x
    const dy = target.y - origin.y
    return Math.atan2(dy, dx) * (180 / Math.PI)
  })

  return { angle }
}
