// composables/useCanvasDimensions.ts
import { ref } from 'vue'
import { useCanvasSettingsStore } from '~/stores/canvasSettings'

export function useCanvasDimensions(
  frameWidth: number,
  frameHeight: number,
  padding: {
    left: number
    right: number
    top: number
    bottom: number
  },
) {
        const gridSize = useCanvasSettingsStore()

  const canvasWidth = ref(0)
  const canvasHeight = ref(0)
  const canvasInnerWidth = ref(0)
  const canvasInnerHeight = ref(0)
  const canvasInnerLeft = ref(0)
  const canvasInnerTop = ref(0)

  const resizeCanvas = () => {
    const maxWidth = window.innerWidth * 0.8
    const maxHeight = window.innerHeight * 0.8

    let width = maxWidth
    let height = (frameHeight / frameWidth) * width

    if (height > maxHeight) {
      height = maxHeight
      width = (frameWidth / frameHeight) * height
    }

    const scale = width / frameWidth

    // Redondear el ancho y alto para que sean múltiplos del gridSize
    const scaledWidth = Math.floor(width / gridSize.gridSize) * gridSize.gridSize
    const scaledHeight = Math.floor(height / gridSize.gridSize) * gridSize.gridSize

    const adjustedScale = scaledWidth / frameWidth

    canvasWidth.value = scaledWidth
    canvasHeight.value = scaledHeight
    canvasInnerLeft.value = padding.left * adjustedScale
    canvasInnerTop.value = padding.top * adjustedScale
    canvasInnerWidth.value = scaledWidth - (padding.left + padding.right) * adjustedScale
    canvasInnerHeight.value = scaledHeight - (padding.top + padding.bottom) * adjustedScale
  }

  return {
    canvasWidth,
    canvasHeight,
    canvasInnerWidth,
    canvasInnerHeight,
    canvasInnerLeft,
    canvasInnerTop,
    resizeCanvas
  }
}
