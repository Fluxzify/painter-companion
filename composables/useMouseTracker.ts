// composables/useMouseTracker.ts
import { reactive } from 'vue'

export function useMouseTracker(canvasRef: Ref<HTMLCanvasElement | null>) {
  const mousePosition = reactive({ x: 0, y: 0 })

  const updateMouse = (event: MouseEvent) => {
    if (!canvasRef.value) return
    const rect = canvasRef.value.getBoundingClientRect()
    mousePosition.x = event.clientX - rect.left
    mousePosition.y = event.clientY - rect.top
}

  return {
    mousePosition,
    updateMouse
  }
}
