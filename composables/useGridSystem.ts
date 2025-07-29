import type { Ref } from 'vue'
import { useCanvasSettingsStore } from '~/stores/canvasSettings'
export function useGridSystem(canvasRef: Ref<HTMLCanvasElement | null>, mousePosition: { x: number, y: number }) {
  const snapToGrid = (pos: number, gridSize: number) =>
    Math.floor(pos / gridSize) * gridSize
 
  const calculateBlockPos = () => {
    const gridSize = useCanvasSettingsStore()

    return {
      x: snapToGrid(mousePosition.x, gridSize.gridSize),
      y: snapToGrid(mousePosition.y, gridSize.gridSize)
    }
  }

  return {
    calculateBlockPos
    
  }
}