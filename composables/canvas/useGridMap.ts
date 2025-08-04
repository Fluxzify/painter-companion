// composables/useGridMap.ts
import { ref } from 'vue'

export interface GridCell {
  x: number
  y: number
  power: string
}

export function useGridMap() {
  const gridMap = ref(new Map<string, GridCell>())

  // Convierte coordenadas a key tipo "x,y"
  const getKey = (x: number, y: number): string => `${x},${y}`

  // Agrega o actualiza una celda
const setCell = (x: number, y: number, power: string) => {
  const key = getKey(x, y)
  const existing = gridMap.value.get(key)

  // Si ya existe y tiene el mismo poder, no hacer nada
  if (existing && existing.power === power) return

  // Si no existe o tiene poder distinto, actualizar
  gridMap.value.set(key, { x, y, power })
}

  // Obtiene una celda, si existe
  const getCell = (x: number, y: number): GridCell | undefined => {
    const key = getKey(x, y)
    return gridMap.value.get(key)
  }

  // Devuelve todas las celdas pintadas en una lista ordenada (opcional)
  const getPaintedCells = (): GridCell[] => {
    return Array.from(gridMap.value.values())
  }

  // Borra una celda pintada
  const removeCell = (x: number, y: number) => {
    const key = getKey(x, y)
    gridMap.value.delete(key)
  }

  // Limpiar el mapa
  const clear = () => {
    gridMap.value.clear()
  }
const isCellPainted = (x: number, y: number): boolean => {
  const key = getKey(x, y)
  return gridMap.value.has(key)
}
  return {
    gridMap,
    setCell,
    getCell,
    getPaintedCells,
    removeCell,
    clear,
    isCellPainted
  }
}
