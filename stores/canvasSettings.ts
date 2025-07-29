import { defineStore } from 'pinia'

export const useCanvasSettingsStore = defineStore('canvasSettings', {
  state: () => ({
    gridSize: 40,
  }),
  actions: {
    setGridSize(newSize: number) {
      if (newSize > 0) {
        this.gridSize = newSize
      }
    },
  },
})