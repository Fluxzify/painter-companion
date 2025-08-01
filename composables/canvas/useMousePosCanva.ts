// composables/useMousePosCanva.ts

export function useMousePosCanva(canvas: HTMLCanvasElement, mousePosition: { x: number; y: number }) {
  const updateMouse = (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect()
    mousePosition.x = event.clientX - rect.left
    mousePosition.y = event.clientY - rect.top

  }

  return {
    updateMouse
  }
}
