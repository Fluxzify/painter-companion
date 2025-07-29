// composables/useCanvasPainter.ts
import type { Ref } from 'vue'
import { useCanvasSettingsStore } from '~/stores/canvasSettings'

export function useCanvasPainter(
  ctx: Ref<CanvasRenderingContext2D | null>,
  powerImg: Ref<HTMLImageElement | null>
) {
 const gridSize = useCanvasSettingsStore()

  const draw = (mousePosition: { x: number, y: number }) => {
    if (!ctx.value || !powerImg.value) return

    ctx.value.drawImage(
      powerImg.value,
      mousePosition.x - 10,
      mousePosition.y - 10,
      gridSize.gridSize,
      gridSize.gridSize
    )
  }

  return {
    draw
  }
}
