<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, defineExpose } from 'vue'
import hieloImageSrc from '~/assets/Canva/Effects/Hielo.png'
import frameImageSrc from '~/assets/Canva/Frames/Default.png'

import { useCanvasDimensions } from '~/composables/canvas/useCanvasDimensions'
import { useMousePosCanva } from '~/composables/canvas/useMousePosCanva'
import { useBlockPainter } from '~/composables/canvas/useBlockPainter'

const canvasRef = ref<HTMLCanvasElement | null>(null)
defineExpose({ canvasRef })

const ctx = ref<CanvasRenderingContext2D | null>(null)
const powerImg = ref<HTMLImageElement | null>(null)

// 🟡 mousePosition se crea aquí, reactivo
const mousePosition = reactive({ x: 0, y: 0 })
let updateMouse: ((e: MouseEvent) => void) | null = null

const { drawBlock } = useBlockPainter(canvasRef, ctx, powerImg, mousePosition)

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

onMounted(() => {
  const image = new Image()
  image.src = hieloImageSrc
  image.onload = () => (powerImg.value = image)

  const canvas = canvasRef.value
  if (!canvas) return

  ctx.value = canvas.getContext('2d')

  // 🔁 Ahora sí pasamos canvas existente + mousePosition
  const result = useMousePosCanva(canvas, mousePosition)
  updateMouse = result.updateMouse

  canvas.addEventListener('mousemove', updateMouse)
  canvas.addEventListener('click', drawBlock)

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

})

onUnmounted(() => {
  const canvas = canvasRef.value
  if (canvas && updateMouse) {
    canvas.removeEventListener('mousemove', updateMouse)
    canvas.removeEventListener('click', drawBlock)
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
