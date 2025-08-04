import { defineStore } from 'pinia'

export const useCanvasSettingsStore = defineStore('canvasSettings', {
  state: () => ({
    gridSize: 40,
  }),
  actions: {
    setGridSize(newSize: number) {
      const isValid = newSize > 0 && newSize <= 180 && newSize % 20 === 0
      if (isValid) {
        this.gridSize = newSize
      } else {
        console.warn('Grid size must be a multiple of 20 and between 1 and 180.')
      }
    },
  },
})
