<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, defineExpose, watch } from 'vue'
import frameImageSrc from '~/assets/Canva/Frames/Default.png'
import { useCanvasDimensions } from '~/composables/canvas/useCanvasDimensions'
import { useMousePosCanva } from '~/composables/canvas/useMousePosCanva'
import { useBlockPainter } from '~/composables/canvas/useBlockPainter'
import { useGridMap } from '~/composables/canvas/useGridMap'
import { usePowerSkins } from '~/composables/canvas/usePowerSkins'
import { useGridSystem } from '~/composables/canvas/useGridSystem'

const canvasRef = ref<HTMLCanvasElement | null>(null)
defineExpose({ canvasRef })

const ctx = ref<CanvasRenderingContext2D | null>(null)

const powerSkin = ref('cobweb')
const { powerSkinUrl } = usePowerSkins(powerSkin)
const loadedPowerImg = ref<HTMLImageElement | null>(null) // reemplazo de powerImg

const mousePosition = reactive({ x: 0, y: 0 })
let updateMouse: ((e: MouseEvent) => void) | null = null

const { drawBlock } = useBlockPainter(canvasRef, ctx, loadedPowerImg, mousePosition)
const gridStore = useGridMap()
const { calculateBlockPos } = useGridSystem(canvasRef, mousePosition)

const frameWidth = 2490
const frameHeight = 1650
const padding = { left: 211, right: 227, top: 150, bottom: 80 }

const {
  canvasWidth,
  canvasHeight,
  canvasInnerWidth,
  canvasInnerHeight,
  canvasInnerLeft,
  canvasInnerTop,
  resizeCanvas
} = useCanvasDimensions(frameWidth, frameHeight, padding)

// Cargar imagen del poder dinámicamente al cambiar skin
watch(
  powerSkinUrl,
  async (url) => {
    if (!url) return
    try {
      loadedPowerImg.value = await loadImage(url)
      console.log('Power image loaded:', url)
    } catch (error) {
      console.error('Failed to load power image:', error)
    }
  },
  { immediate: true }
)

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

function draw() {
const position = calculateBlockPos()

  if (gridStore.isCellPainted(position.x, position.y)) {
    return 
  }

  const result = drawBlock()
  if (result) {
    gridStore.setCell(result.x, result.y, powerSkin.value)
    console.log(gridStore.getPaintedCells())
  }
  }
  


onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx.value = canvas.getContext('2d')

  const result = useMousePosCanva(canvas, mousePosition)
  updateMouse = result.updateMouse

  canvas.addEventListener('mousemove', updateMouse)
  canvas.addEventListener('click', draw)

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  const canvas = canvasRef.value
  if (canvas && updateMouse) {
    canvas.removeEventListener('mousemove', updateMouse)
    canvas.removeEventListener('click', draw)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>


<template>
  <div
    class="canvas-wrapper"
    :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px', position: 'relative' }"
  >
    <div
      class="canvas-inner"
      :style="{
        position: 'absolute',
        top: canvasInnerTop + 'px',
        left: canvasInnerLeft + 'px',
        width: canvasInnerWidth + 'px',
        height: canvasInnerHeight + 'px',
        overflow: 'hidden'
      }"
    >
      <canvas
        ref="canvasRef"
        :width="canvasInnerWidth"
        :height="canvasInnerHeight"
        :style="{
          width: canvasInnerWidth + 'px',
          height: canvasInnerHeight + 'px',
          border: '1px solid rgb(6,65,141)',
          backgroundColor: '#eee'
        }"
      ></canvas>
    </div>
    <img
      :src="frameImageSrc"
      alt="Marco"
      class="frame"
      :style="{
        width: canvasWidth + 'px',
        height: canvasHeight + 'px',
        pointerEvents: 'none',
        userSelect: 'none',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 2
      }"
    />
  </div>
</template>

<style scoped>
.canvas-wrapper {
  margin: auto;
}
</style>
